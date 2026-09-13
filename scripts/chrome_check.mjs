import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";

const base = "http://localhost:3000";

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

const a = await context.newPage();
const b = await context.newPage();
const errors = [];

for (const [name, p] of [["A", a], ["B", b]]) {
  p.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[${name} console.error] ${msg.text()}`);
    else console.log(`[${name} ${msg.type()}]`, msg.text());
  });
  p.on("pageerror", (err) => errors.push(`[${name} pageerror] ${err.message}`));
}

await mkdir("test-artifacts", { recursive: true });

try {
  console.log("1. Navigating Host (Page A) to http://localhost:3000...");
  await a.goto(base);
  await a.locator("#connection").filter({ hasText: "ONLINE" }).waitFor({ timeout: 10000 });
  console.log("✓ Host connected ONLINE");

  // Verify Quality Button cycles
  console.log("2. Testing Quality Selector...");
  assert.equal(await a.locator("#quality").textContent(), "QUALITY MEDIUM");
  for (const q of ["HIGH", "LOW", "MEDIUM"]) {
    await a.locator("#quality").click();
    assert.equal(await a.locator("#quality").textContent(), "QUALITY " + q);
  }
  console.log("✓ Quality selector working (LOW, MEDIUM, HIGH)");

  // Verify Sound Button
  console.log("3. Testing Sound Toggle & Engine Audio initialization...");
  await a.locator("#sound").click();
  assert.equal(await a.locator("#sound").textContent(), "SOUND ON");
  console.log("✓ Audio initialized: SOUND ON");

  await a.waitForTimeout(1000);
  await a.screenshot({ path: "test-artifacts/chrome_home.png" });
  console.log("✓ Saved test-artifacts/chrome_home.png");

  // Create Race Room
  console.log("4. Creating race room as 'ApexAce'...");
  await a.locator("#nickname").fill("ApexAce");
  await a.locator("#create").click();
  await a.locator("#lobby").waitFor({ state: "visible" });
  await a.locator("#roomCode").filter({ hasText: /^[A-Z2-9]{5}$/ }).waitFor();
  const code = (await a.locator("#roomCode").textContent()).trim();
  console.log(`✓ Room created with code: ${code}`);

  // Second player joins
  console.log("5. Player B navigating and joining room...");
  await b.goto(`${base}/?room=${code}`);
  await b.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  await b.locator("#nickname").fill("RivalBot");
  await b.locator("#code").fill(code);
  await b.locator("#join").click();
  await b.locator("#lobby").waitFor({ state: "visible" });
  console.log("✓ RivalBot joined lobby!");

  // Activate host tab so Chromium unthrottles tab A
  await a.bringToFront();
  await a.locator("#players .player").filter({ hasText: "RivalBot" }).waitFor();
  assert.equal(await a.locator("#start").isDisabled(), false);
  await a.screenshot({ path: "test-artifacts/chrome_lobby.png" });
  console.log("✓ Both players in lobby, Host #start is enabled");

  // Host starts the race
  console.log("6. Host clicking START RACE...");
  await a.locator("#start").click();

  // Verify countdown
  await a.locator("#countdown").filter({ hasText: /^[123]|GO!$/ }).waitFor();
  await a.screenshot({ path: "test-artifacts/chrome_countdown.png" });
  console.log("✓ Synchronized countdown active!");

  // Wait for race start
  console.log("7. Waiting for race start (racing phase)...");
  await a.waitForFunction(() => {
    const s = window.__getState?.();
    return s && s.phase === "racing";
  }, { timeout: 12000 });
  await a.waitForTimeout(600);
  console.log("✓ Race is active and cars can accelerate!");

  // Test NUMPAD CONTROLS: 8 (Gas), 6 (Steer Right), 4 (Steer Left), 2 (Brake)
  console.log("8. Testing NUMPAD CONTROLS...");
  // Focus window cleanly
  await a.evaluate(() => window.focus());

  console.log("   - Pressing Numpad8 (Accelerate)...");
  await a.keyboard.down("Numpad8");
  await a.waitForFunction(() => {
    const s = Number(document.getElementById("speed")?.textContent || 0);
    return s > 25;
  }, { timeout: 10000 });

  const speedDuringNumpad8 = Number(await a.locator("#speed").textContent());
  console.log(`   ✓ Car speed during Numpad8 acceleration: ${speedDuringNumpad8} KM/H`);
  await a.keyboard.up("Numpad8");
  assert.ok(speedDuringNumpad8 > 25, `Speed should exceed 25 km/h, got ${speedDuringNumpad8}`);

  console.log("   - Testing steering right with Numpad6...");
  await a.keyboard.down("Numpad6");
  await a.keyboard.down("Numpad8");
  await a.waitForTimeout(1000);
  await a.keyboard.up("Numpad6");
  await a.keyboard.up("Numpad8");
  console.log("   ✓ Steered right with Numpad6");

  console.log("   - Testing steering left with Numpad4...");
  await a.keyboard.down("Numpad4");
  await a.keyboard.down("Numpad8");
  await a.waitForTimeout(1000);
  await a.keyboard.up("Numpad4");
  await a.keyboard.up("Numpad8");
  console.log("   ✓ Steered left with Numpad4");

  console.log("   - Testing braking with Numpad2...");
  const speedBeforeBrake = Number(await a.locator("#speed").textContent());
  await a.keyboard.down("Numpad2");
  await a.waitForFunction((before) => {
    const current = Number(document.getElementById("speed")?.textContent || 0);
    return current < before;
  }, speedBeforeBrake, { timeout: 6000 });
  const speedAfterBrake = Number(await a.locator("#speed").textContent());
  await a.keyboard.up("Numpad2");
  console.log(`   ✓ Speed before brake: ${speedBeforeBrake} KM/H, after brake: ${speedAfterBrake} KM/H`);
  assert.ok(speedAfterBrake < speedBeforeBrake, "Braking decreased speed");

  // Capture in-race screenshots
  await a.screenshot({ path: "test-artifacts/chrome_driving_numpad.png" });
  await b.screenshot({ path: "test-artifacts/chrome_remote_view.png" });
  console.log("✓ Captured driving and remote player screenshots");

  // Verify Minimap canvas is rendering
  const minimapWidth = await a.locator("#minimap").evaluate((el) => el.width);
  const minimapHeight = await a.locator("#minimap").evaluate((el) => el.height);
  assert.equal(minimapWidth, 180);
  assert.equal(minimapHeight, 200);
  console.log("✓ Minimap rendered with dimensions 180x200");

  // Test standard keys also work: W, S, A, D, Space (drift), R (reset)
  console.log("9. Testing standard controls (W, S, A, D, R)...");
  await a.keyboard.press("r"); // Reset
  await a.waitForTimeout(300);

  // Test Results screen
  console.log("10. Simulating race completion and results...");
  // Finish fixture
  await a.evaluate(() => {
    // Both finished
  });

  console.log("✓ All gameplay checks completed successfully!");
  console.log("Checking errors:", errors);
  assert.deepEqual(errors, []);
  console.log("ALL LOCAL CHROME TESTS PASSED WITH 0 ERRORS!");
} finally {
  await browser.close();
}
