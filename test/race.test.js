import { test } from "node:test";
import assert from "node:assert/strict";
import { io } from "socket.io-client";
import { Race } from "../server/race.js";
import { createGame } from "../server/index.js";
import { point, LENGTH, nearest } from "../shared/track.js";

test("circuit has left/right turns, sweepers, gentle bends and a long straight", () => {
  let left = false, right = false, sweepers = false, gentle = false, straight = 0, longest = 0;
  for(let s=0;s<LENGTH;s++) {
    const a=point(s),b=point(s+1);
    const turn=Math.atan2(Math.sin(b.yaw-a.yaw),Math.cos(b.yaw-a.yaw));
    left ||= turn < -0.01; right ||= turn > 0.01;
    sweepers ||= Math.abs(turn) > 0.015;
    gentle ||= Math.abs(turn) > 0.005 && Math.abs(turn) <= 0.015;
    straight=Math.abs(turn)<0.001?straight+1:0;longest=Math.max(longest,straight);
  }
  assert.ok(left && right && sweepers && gentle);assert.ok(longest>=80);
});
test("track is continuous and nearest recovers distance", () => {
  for (let s = 0; s < LENGTH; s += 0.7) {
    const p = point(s);
    assert.ok(Math.abs(nearest(p.x, p.z).s - s) < 0.001);
  }
  assert.ok(
    Math.hypot(
      point(-0.001).x - point(0.001).x,
      point(-0.001).z - point(0.001).z,
    ) < 0.003,
  );
});
test("server physics accelerates, brakes, reverses, collides and remains grounded", () => {
  const r = new Race(),
    c = r.add("a", 0);
  let now = 10000;
  const initialZ = c.b.position.z;
  c.input = { up: true };
  for (let i = 0; i < 100; i++) {
    c.inputAt = now;
    r.step(1 / 60, now, true, 10000);
    now += 1000 / 60;
  }
  assert.ok(c.b.position.z > initialZ + 10);
  assert.ok(c.b.position.y > 0.3 && c.b.position.y < 0.7);
  c.input = { down: true };
  for (let i = 0; i < 220; i++) {
    c.inputAt = now;
    r.step(1 / 60, now, true, 10000);
    now += 1000 / 60;
  }
  assert.ok(c.b.velocity.z < 0);
  c.b.position.set(126, 0.55, 0);
  c.yaw = Math.PI / 2;
  c.input = { up: true };
  for (let i = 0; i < 180; i++) {
    c.inputAt = now;
    r.step(1 / 60, now, true, 10000);
    now += 1000 / 60;
  }
  assert.ok(c.b.position.x < 132, "barrier contains car");
});
test("checkpoints reject skips/backward crossings; 3 ordered laps finish", () => {
  const r = new Race(),
    c = r.add("a", 0);
  function cross(n, back = false) {
    const s = (n * LENGTH) / 24,
      a = point(s - (back ? -1 : 1)),
      b = point(s + (back ? -1 : 1));
    c.previous = a;
    c.b.position.set(b.x, 0.5, b.z);
    r.progress(c, 10000 + n * 100, 10000);
  }
  cross(3);
  assert.equal(c.passed, 0);
  cross(1, true);
  assert.equal(c.passed, 0);
  for (let n = 1; n <= 72; n++) cross(n);
  assert.equal(c.passed, 72);
  assert.equal(c.finished, 7200);
  r.reset(c);
  assert.equal(c.passed, 72);
});
test("stale inputs stop accelerating and lobby ignores inputs", () => {
  const r = new Race(),
    c = r.add("a", 0);
  c.input = { up: true };
  c.inputAt = 0;
  r.step(1 / 60, 10000, true, 0);
  assert.ok(Math.abs(c.b.velocity.z) < 0.01);
  c.inputAt = 10000;
  r.step(1 / 60, 10000, false, 0);
  assert.ok(Math.abs(c.b.velocity.z) < 0.01);
});
test("a car can physically drive three complete laps through every checkpoint", () => {
  const r = new Race(),
    c = r.add("driver", 0);
  let now = 10000;
  for (let i = 0; i < 18000 && !c.finished; i++) {
    const p = c.b.position,
      target = point(nearest(p.x, p.z).s + 10),
      desired = Math.atan2(target.x - p.x, target.z - p.z),
      error = Math.atan2(Math.sin(desired - c.yaw), Math.cos(desired - c.yaw));
    c.input = { up: true, left: error < -0.045, right: error > 0.045 };
    c.inputAt = now;
    r.step(1 / 60, now, true, 10000);
    now += 1000 / 60;
  }
  assert.equal(c.passed, 72);
  assert.ok(c.finished > 10000 && c.finished < 300000);
});
test("real Socket.IO clients: validation, isolation, host authority, movement, results, rematch, cleanup", async (t) => {
  const game = await createGame();
  await new Promise((resolve) => game.http.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${game.http.address().port}`,
    clients = [];
  t.after(async () => {
    clients.forEach((s) => s.disconnect());
    await game.close();
  });
  async function connect() {
    const s = io(url, { forceNew: true, transports: ["websocket"] });
    clients.push(s);
    await new Promise((resolve) => s.on("connect", resolve));
    return s;
  }
  const a = await connect(),
    b = await connect(),
    c = await connect();
  const send = (s, e, d = {}) =>
    new Promise((resolve, reject) =>
      s.timeout(2000).emit(e, d, (err, r) => (err ? reject(err) : resolve(r))),
    );
  assert.equal((await send(a, "enter", null)).ok, false);
  assert.equal(
    (await send(a, "enter", { name: "x".repeat(19), create: true })).ok,
    false,
  );
  assert.equal(
    (await send(b, "enter", { name: "B", code: "AAAAA" })).ok,
    false,
  );
  const created = await send(a, "enter", { name: "Alpha", create: true });
  assert.equal(created.ok, true);
  const room = game.rooms.get(created.code);
  assert.equal((await send(a, "start")).ok, false);
  assert.equal(
    (await send(b, "enter", { name: "Bravo", code: created.code })).ok,
    true,
  );
  await send(c, "enter", { name: "Other", create: true });
  assert.equal((await send(b, "start")).ok, false);
  assert.equal((await send(a, "start")).ok, true);
  assert.equal(room.phase, "countdown");
  assert.equal(
    (await send(c, "enter", { name: "No", code: created.code })).ok,
    false,
  );
  room.startAt = Date.now() - 1000;
  let bState;
  b.on("state", (s) => (bState = s));
  const initial = room.race.cars.get(a.id).b.position.z;
  for (let i = 0; i < 8; i++) {
    a.emit("input", { up: true });
    await new Promise((r) => setTimeout(r, 50));
  }
  assert.ok(room.race.cars.get(a.id).b.position.z > initial);
  assert.ok(bState.cars.find((p) => p.id === a.id).z > initial);
  assert.equal(bState.players.length, 2);
  room.race.cars.get(a.id).finished = 1200;
  room.race.cars.get(b.id).finished = 1500;
  await new Promise((r) => setTimeout(r, 80));
  assert.equal(room.phase, "results");
  assert.equal((await send(b, "rematch")).ok, false);
  assert.equal((await send(a, "rematch")).ok, true);
  assert.equal(room.phase, "lobby");
  assert.equal(room.race.cars.get(a.id).passed, 0);
  const aid = a.id,
    bid = b.id;
  await send(a, "leave");
  assert.equal(room.host, bid);
  assert.ok(!room.players.has(aid));
  await send(b, "leave");
  assert.ok(!game.rooms.has(created.code));
});
test("six-player cap, spoof resistance, real disconnect host transfer and finish timeout", async (t) => {
  const game = await createGame();
  await new Promise((resolve) => game.http.listen(0, "127.0.0.1", resolve));
  const sockets = [];
  t.after(async () => {
    sockets.forEach((s) => s.disconnect());
    await game.close();
  });
  const send = (s, e, d = {}) =>
    new Promise((resolve, reject) =>
      s.timeout(2000).emit(e, d, (err, r) => (err ? reject(err) : resolve(r))),
    );
  for (let i = 0; i < 7; i++) {
    const s = io(`http://127.0.0.1:${game.http.address().port}`, {
      forceNew: true,
    });
    sockets.push(s);
    await new Promise((resolve) => s.on("connect", resolve));
  }
  const { code } = await send(sockets[0], "enter", {
    name: "Host",
    create: true,
  });
  for (let i = 1; i < 6; i++)
    assert.equal(
      (await send(sockets[i], "enter", { name: "Driver" + i, code })).ok,
      true,
    );
  assert.equal(
    (await send(sockets[6], "enter", { name: "Seventh", code })).ok,
    false,
  );
  const room = game.rooms.get(code);
  assert.equal(new Set([...room.players.values()].map((p) => p.color)).size, 6);
  await send(sockets[0], "start");
  room.startAt = Date.now() - 1000;
  sockets[1].emit("input", { x: 99999, passed: 72, finished: 1, up: "yes" });
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(room.race.cars.get(sockets[1].id).passed, 0);
  assert.equal(room.race.cars.get(sockets[1].id).finished, null);
  const next = sockets[1].id;
  sockets[0].disconnect();
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(room.host, next);
  assert.equal(room.players.size, 5);
  room.race.cars.get(next).finished = 5000;
  await new Promise((r) => setTimeout(r, 50));
  assert.ok(room.endAt > Date.now());
  room.endAt = Date.now() - 1;
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(room.phase, "results");
  assert.ok(room.race.snapshot().some((c) => c.finished === null));
});
