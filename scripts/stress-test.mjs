import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { createGame } from "../server/index.js";

const game = await createGame();
await new Promise((resolve) => game.http.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${game.http.address().port}`;

console.log(`Starting APEX Multi-Race Stress Test on ${base}...`);

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--enable-webgl",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});

const context1 = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const context2 = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});

const p1 = await context1.newPage();
const p2 = await context2.newPage();
const errors = [];

for (const p of [p1, p2]) {
  p.on("pageerror", (e) => {
    console.error("Page error:", e.message);
    errors.push(e.message);
  });
  p.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error("Console error:", msg.text());
      errors.push(msg.text());
    }
  });
}

try {
  // Step 1: Initial load
  await p1.goto(base);
  await p1.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  await p1.locator("#nickname").fill("Driver1");
  await p1.locator("#create").click();
  await p1.locator("#lobby").waitFor({ state: "visible" });

  const code = (await p1.locator("#roomCode").textContent()).trim();
  assert.match(code, /^[A-Z2-9]{5}$/);

  await p2.goto(`${base}/?room=${code}`);
  await p2.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  await p2.locator("#nickname").fill("Driver2");
  await p2.locator("#code").fill(code);
  await p2.locator("#join").click();
  await p2.locator("#lobby").waitFor({ state: "visible" });

  await p1.bringToFront();
  await p1.locator("#players .player").filter({ hasText: "Driver2" }).waitFor();

  console.log("Both drivers in lobby. Beginning 5-cycle endurance test...");

  // Run 5 full consecutive race-and-rematch cycles
  for (let cycle = 1; cycle <= 5; cycle++) {
    console.log(`--- RACE CYCLE ${cycle} OF 5 ---`);

    // Host starts race
    await p1.bringToFront();
    await p1.locator("#start").waitFor({ state: "visible" });
    await p1.locator("#start").click();

    // Both observe synchronized countdown
    await Promise.all([
      p1.locator("#countdown").filter({ hasText: /^[123]$/ }).waitFor(),
      p2.locator("#countdown").filter({ hasText: /^[123]$/ }).waitFor(),
    ]);

    // Wait for racing phase
    await p1.waitForFunction(() => window.__getState()?.phase === "racing");
    await p2.waitForFunction(() => window.__getState()?.phase === "racing");

    // Both drive for a brief period
    await p1.bringToFront();
    await p1.evaluate(() => window.focus());
    await p1.keyboard.down("w");
    await p2.bringToFront();
    await p2.evaluate(() => window.focus());
    await p2.keyboard.down("w");

    await p1.waitForTimeout(1200);

    await p1.keyboard.up("w");
    await p2.keyboard.up("w");

    // Check speeds
    const speed1 = Number(await p1.locator("#speed").textContent());
    assert.ok(speed1 > 20, `Driver 1 speed should be > 20, got ${speed1}`);

    // Cycle 3 special test: test input jitter / rapid steering
    if (cycle === 3) {
      await p1.keyboard.down("a");
      await p1.waitForTimeout(200);
      await p1.keyboard.up("a");
      await p1.keyboard.down("d");
      await p1.waitForTimeout(200);
      await p1.keyboard.up("d");
    }

    // Verify car physics state from server
    const room = game.rooms.get(code);
    assert.ok(room, "Room must exist");
    for (const car of room.race.cars.values()) {
      assert.equal(car.b.position.y, 0.55, "Car must stay strictly grounded at y=0.55");
      assert.equal(car.b.velocity.y, 0, "Vertical velocity must stay at 0");
      assert.ok(Number.isFinite(car.b.position.x), "Car x must be finite");
      assert.ok(Number.isFinite(car.b.position.z), "Car z must be finite");
      assert.ok(Number.isFinite(car.yaw), "Car yaw must be finite");
    }

    // Simulate completion of 3 laps
    [...room.race.cars.values()].forEach((c, i) => {
      c.passed = 72;
      c.finished = 65000 + i * 1500;
    });

    // Results screen appears on both clients
    await p1.locator("#results").waitFor({ state: "visible" });
    await p2.locator("#results").waitFor({ state: "visible" });

    const winnerText = await p1.locator("#winner").textContent();
    assert.equal(winnerText, "Driver1 takes the win.");

    // If not final cycle, run rematch
    if (cycle < 5) {
      await p1.bringToFront();
      await p1.locator("#rematch").waitFor({ state: "visible" });
      await p1.locator("#rematch").click();

      // Both clients transition cleanly back to lobby
      await p1.locator("#lobby").waitFor({ state: "visible" });
      await p2.locator("#lobby").waitFor({ state: "visible" });

      // Verify room state is clean in lobby
      assert.equal(room.phase, "lobby");
      assert.equal(room.startAt, 0);
      assert.equal(room.endAt, 0);
      console.log(`Cycle ${cycle} rematch succeeded cleanly.`);
    }
  }

  // Final cycle cleanup: Leave room
  await p1.bringToFront();
  await p1.locator("#results .leave").click();
  await p1.locator("#home").waitFor({ state: "visible" });

  await p2.bringToFront();
  await p2.locator("#results .leave").click();
  await p2.locator("#home").waitFor({ state: "visible" });

  assert.deepEqual(errors, [], `Expected 0 errors during stress test, but got: ${errors.join(", ")}`);

  console.log("PASS: 5 consecutive race & rematch cycles, physics grounded, 0 errors!");
} finally {
  await browser.close();
  await game.close();
}
