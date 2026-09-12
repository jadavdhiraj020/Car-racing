import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { createGame } from "../server/index.js";
const game = await createGame();
await new Promise((resolve) => game.http.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${game.http.address().port}`;
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--enable-webgl",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  }),
  a = await context.newPage(),
  b = await context.newPage(),
  errors = [];
for (const p of [a, b]) p.on("pageerror", (e) => errors.push(e.message));
await mkdir("test-artifacts", { recursive: true });
try {
  await a.goto(base);
  await a.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  assert.equal(await a.locator("#quality").textContent(), "QUALITY MEDIUM");
  for (const label of ["HIGH", "LOW", "MEDIUM"]) {
    await a.locator("#quality").click();
    assert.equal(await a.locator("#quality").textContent(), "QUALITY " + label);
  }
  await a.waitForTimeout(2500);
  await a.screenshot({ path: "test-artifacts/home.png" });
  await a.locator("#nickname").fill("Dhiraj");
  await a.locator("#create").click();
  await a.locator("#lobby").waitFor({ state: "visible" });
  const code = await a.locator("#roomCode").textContent();
  await b.goto(`${base}/?room=${code}`);
  await b.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  await b.locator("#nickname").fill("Rahul");
  await b.locator("#join").click();
  await b.locator("#lobby").waitFor({ state: "visible" });
  await a.locator("#start").click();
  await a.locator("#countdown").filter({ hasText: "3" }).waitFor();
  await b.locator("#countdown").filter({ hasText: "3" }).waitFor();
  await a.waitForTimeout(3300);
  await a.keyboard.down("w");
  await a.waitForTimeout(1800);
  await a.keyboard.up("w");
  assert.ok(Number(await a.locator("#speed").textContent()) > 40);
  await a.screenshot({ path: "test-artifacts/race.png" });
  await b.screenshot({ path: "test-artifacts/remote.png" });
  await a.keyboard.down("d");
  await a.keyboard.down("w");
  await a.waitForTimeout(800);
  await a.keyboard.up("d");
  await a.keyboard.up("w");
  await a.keyboard.press("r");
  // Finish fixture checks result/rematch presentation. Physical three-lap racing is tested separately.
  const room = game.rooms.get(code);
  [...room.race.cars.values()].forEach((c, i) => {
    c.passed = 72;
    c.finished = 75000 + i * 2000;
  });
  await a.locator("#results").waitFor({ state: "visible" });
  await b.locator("#results").waitFor({ state: "visible" });
  assert.equal(
    await a.locator("#winner").textContent(),
    "Dhiraj takes the win.",
  );
  await a.screenshot({ path: "test-artifacts/results.png" });
  await a.locator("#rematch").click();
  await a.locator("#lobby").waitFor({ state: "visible" });
  await b.locator("#lobby").waitFor({ state: "visible" });
  await a.locator("#lobby .leave").click();
  await a.locator("#home").waitFor({ state: "visible" });
  await b.locator("#lobby .leave").click();
  await b.locator("#home").waitFor({ state: "visible" });
  await a.setViewportSize({ width: 390, height: 844 });
  await a.screenshot({ path: "test-artifacts/mobile.png" });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: two Chrome pages, 3D, create/join, synchronized countdown, keyboard driving, leave; no page errors.",
  );
} finally {
  await browser.close();
  await game.close();
}
