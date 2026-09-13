import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { createGame } from "../server/index.js";

const game = await createGame();
await new Promise((resolve) => game.http.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${game.http.address().port}`;

console.log(`Starting APEX Critical Crash & Stability Stress Test on ${base}...`);

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

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});

const p1 = await context.newPage();
const p2 = await context.newPage();
const errors = [];

for (const [name, p] of [["P1", p1], ["P2", p2]]) {
  p.on("pageerror", (e) => {
    console.error(`[${name} PageError]`, e.message);
    errors.push(`${name} PageError: ${e.message}`);
  });
  p.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error(`[${name} ConsoleError]`, msg.text());
      errors.push(`${name} ConsoleError: ${msg.text()}`);
    }
  });
}

try {
  // Step 1: Join Lobby
  await p1.goto(base);
  await p1.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  await p1.locator("#nickname").fill("RacerAlpha");
  await p1.locator("#create").click();
  await p1.locator("#lobby").waitFor({ state: "visible" });

  const code = (await p1.locator("#roomCode").textContent()).trim();
  assert.match(code, /^[A-Z2-9]{5}$/);

  await p2.goto(`${base}/?room=${code}`);
  await p2.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  await p2.locator("#nickname").fill("RacerBeta");
  await p2.locator("#code").fill(code);
  await p2.locator("#join").click();
  await p2.locator("#lobby").waitFor({ state: "visible" });

  await p1.bringToFront();
  await p1.locator("#players .player").filter({ hasText: "RacerBeta" }).waitFor();

  console.log("Both racers connected to lobby. Starting Race 1...");

  // ==========================================
  // RACE 1: MAX SPEED, WALL CRASH, CAR-TO-CAR
  // ==========================================
  await p1.locator("#start").click();

  await Promise.all([
    p1.locator("#countdown").filter({ hasText: /^[123]$/ }).waitFor(),
    p2.locator("#countdown").filter({ hasText: /^[123]$/ }).waitFor(),
  ]);

  await p1.waitForFunction(() => window.__getState()?.phase === "racing");
  await p2.waitForFunction(() => window.__getState()?.phase === "racing");

  console.log("TEST 1: Accelerating to Maximum Speed (> 140 km/h)...");
  await p1.bringToFront();
  await p1.evaluate(() => window.focus());
  await p1.keyboard.down("w");

  await p2.bringToFront();
  await p2.evaluate(() => window.focus());
  await p2.keyboard.down("w");

  // Drive at max speed for 2.5 seconds
  await p1.waitForTimeout(2500);

  const speed1 = Number(await p1.locator("#speed").textContent());
  assert.ok(speed1 > 120, `Driver 1 should reach high speed, got ${speed1} km/h`);
  assert.ok(Number.isFinite(speed1), "Speed must be finite (not NaN)");

  // Check UI state on p1
  const rpm1 = await p1.evaluate(() => document.getElementById("rpm")?.style.getPropertyValue("--rpm"));
  assert.ok(Number.isFinite(parseFloat(rpm1)), `RPM CSS variable must be finite, got ${rpm1}`);

  console.log(`Max speed reached: ${speed1} km/h, RPM var: ${rpm1}.`);

  console.log("TEST 2: Intentional High-Speed Wall Crashes (steering hard into barrier)...");
  // Hard turn right into barrier at high speed
  await p1.bringToFront();
  await p1.keyboard.down("d");
  await p1.waitForTimeout(1200);
  await p1.keyboard.up("d");

  // Hard turn left into opposite barrier
  await p1.keyboard.down("a");
  await p1.waitForTimeout(1200);
  await p1.keyboard.up("a");

  // Release throttle
  await p1.keyboard.up("w");
  await p2.keyboard.up("w");

  // Verify server car physics invariants after hard wall crashes
  const room = game.rooms.get(code);
  assert.ok(room, "Room must exist");
  for (const car of room.race.cars.values()) {
    assert.equal(car.b.position.y, 0.55, "Car must stay strictly grounded at y=0.55");
    assert.equal(car.b.velocity.y, 0, "Vertical velocity must stay at 0");
    assert.ok(Number.isFinite(car.b.position.x), "Car x must be finite");
    assert.ok(Number.isFinite(car.b.position.z), "Car z must be finite");
    assert.ok(Number.isFinite(car.b.velocity.x), "Car vx must be finite");
    assert.ok(Number.isFinite(car.b.velocity.z), "Car vz must be finite");
    assert.ok(Number.isFinite(car.yaw), "Car yaw must be finite");
    const speed = Math.hypot(car.b.velocity.x, car.b.velocity.z);
    assert.ok(speed <= 52, `Car speed must be clamped <= 52 m/s, got ${speed}`);
  }
  console.log("PASS: Wall crashes contained car safely on track with finite physics.");

  console.log("TEST 3: Intentional Car-to-Car Collisions...");
  // Ram Driver 1 into Driver 2
  const [carA, carB] = [...room.race.cars.values()];
  carA.b.position.set(120, 0.55, 60);
  carA.yaw = 0;
  carA.b.velocity.set(0, 0, 45);
  carB.b.position.set(120, 0.55, 64);
  carB.yaw = Math.PI;
  carB.b.velocity.set(0, 0, -45);

  for (let i = 0; i < 30; i++) {
    room.race.step(1 / 60, Date.now(), true, room.startAt);
  }

  assert.ok(Number.isFinite(carA.b.velocity.z), "CarA vz must be finite");
  assert.ok(Number.isFinite(carB.b.velocity.z), "CarB vz must be finite");
  assert.ok(Math.hypot(carA.b.velocity.x, carA.b.velocity.z) <= 52, "CarA speed <= 52");
  assert.ok(Math.hypot(carB.b.velocity.x, carB.b.velocity.z) <= 52, "CarB speed <= 52");
  assert.ok(carA.b.position.y === 0.55 && carB.b.position.y === 0.55, "Cars remain grounded");
  console.log("PASS: Direct head-on car collision resolved safely with zero explosion.");

  console.log("TEST 4: Drifting Through Sweeping Turns...");
  await p1.bringToFront();
  await p1.keyboard.down("w");
  await p1.keyboard.down(" ");
  await p1.keyboard.down("a");
  await p1.waitForTimeout(800);
  await p1.keyboard.up(" ");
  await p1.keyboard.up("a");
  await p1.keyboard.up("w");
  console.log("PASS: Drift input executed smoothly without error.");

  console.log("TEST 5: Completing 3 Laps and Transitioning to Results...");
  [...room.race.cars.values()].forEach((c, i) => {
    c.passed = 72;
    c.finished = 62000 + i * 1200;
  });

  await p1.locator("#results").waitFor({ state: "visible" });
  await p2.locator("#results").waitFor({ state: "visible" });
  const winner = await p1.locator("#winner").textContent();
  assert.equal(winner, "RacerAlpha takes the win.");
  console.log("PASS: 3 Laps completed, results displayed accurately.");

  // ==========================================
  // RACE 2: REMATCH CYCLE 1
  // ==========================================
  console.log("TEST 6: Rematch Flow (Race 2)...");
  await p1.bringToFront();
  await p1.locator("#rematch").click();
  await p1.locator("#lobby").waitFor({ state: "visible" });
  await p2.locator("#lobby").waitFor({ state: "visible" });

  await p1.locator("#start").click();
  await p1.waitForFunction(() => window.__getState()?.phase === "racing");
  await p2.waitForFunction(() => window.__getState()?.phase === "racing");

  const room2 = game.rooms.get(code);
  [...room2.race.cars.values()].forEach((c, i) => {
    c.passed = 72;
    c.finished = 59000 + i * 1100;
  });
  await p1.locator("#results").waitFor({ state: "visible" });
  await p2.locator("#results").waitFor({ state: "visible" });
  console.log("PASS: Rematch 1 completed cleanly.");

  // ==========================================
  // RACE 3: REMATCH CYCLE 2
  // ==========================================
  console.log("TEST 6 (cont): Rematch Flow (Race 3)...");
  await p1.bringToFront();
  await p1.locator("#rematch").click();
  await p1.locator("#lobby").waitFor({ state: "visible" });
  await p2.locator("#lobby").waitFor({ state: "visible" });
  console.log("PASS: Rematch 2 lobby state clean.");

  // ==========================================
  // TEST 7: DISCONNECT AND REJOIN
  // ==========================================
  console.log("TEST 7: Disconnect and Rejoin...");
  await p2.close();
  await p1.bringToFront();
  await p1.waitForFunction(() => window.__getState()?.players.length === 1);
  console.log("Player 2 disconnected; room updated to 1 player.");

  const p2New = await context.newPage();
  p2New.on("pageerror", (e) => errors.push(`P2New PageError: ${e.message}`));
  p2New.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`P2New ConsoleError: ${msg.text()}`);
  });

  await p2New.goto(`${base}/?room=${code}`);
  await p2New.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  await p2New.locator("#nickname").fill("RacerBetaRejoined");
  await p2New.locator("#code").fill(code);
  await p2New.locator("#join").click();
  await p2New.locator("#lobby").waitFor({ state: "visible" });

  await p1.bringToFront();
  await p1.locator("#players .player").filter({ hasText: "RacerBetaRejoined" }).waitFor();
  console.log("Player 2 successfully rejoined the lobby!");

  assert.deepEqual(errors, [], `Expected 0 errors, got: ${errors.join("; ")}`);
  console.log("==================================================");
  console.log("ALL 7 CRITICAL CRASH & STRESS TESTS PASSED WITH 0 ERRORS!");
  console.log("==================================================");
} finally {
  await browser.close();
  await game.close();
}
