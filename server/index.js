import express from "express";
import { createServer } from "node:http";
import { randomBytes, randomInt } from "node:crypto";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { Race } from "./race.js";
import { TRACK } from "../shared/track.js";
export async function createGame({ dev = false } = {}) {
  const RECONNECT_GRACE_MS = 30000;
  const app = express(),
    http = createServer(app),
    io = new Server(http, { maxHttpBufferSize: 2048 }),
    rooms = new Map();
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.get("/favicon.ico", (_req, res) => res.status(204).end());
  let vite;
  if (dev) {
    vite = await (
      await import("vite")
    ).createServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else
    app.use(express.static(fileURLToPath(new URL("../dist", import.meta.url))));
  const colors = [
    "#ff584d",
    "#43c9ff",
    "#b5f363",
    "#ffcf57",
    "#c999ff",
    "#ff9c45",
  ];
  const state = (r) => ({
    seq: (r.stateSeq = (r.stateSeq || 0) + 1),
    raceId: r.raceId || 0,
    code: r.code,
    host: r.host,
    phase: r.phase,
    startAt: r.startAt,
    serverNow: Date.now(),
    players: [...r.players.values()],
    reconnecting: [...r.pending.values()].map((pending) => pending.id),
    cars: r.race.snapshot(),
    endAt: r.endAt,
  });
  function broadcast(r, volatile = false) {
    const packet = state(r);
    if (volatile) io.volatile.to(r.code).emit("state", packet);
    else io.to(r.code).emit("state", packet);
  }
  function removePlayer(r, id) {
    const p = r.players.get(id);
    if (!p) return;
    r.players.delete(id);
    r.race.remove(id);
    r.tokens.delete(id);
    for (const [token, pending] of r.pending)
      if (pending.id === id) r.pending.delete(token);
    if (!r.players.size) {
      rooms.delete(r.code);
      return;
    }
    if (r.host === id) r.host = r.players.keys().next().value;
    if (r.phase === "racing") {
      const remainingCars = [...r.race.cars.values()];
      if (remainingCars.every((c) => c.finished !== null)) r.phase = "results";
    }
    io.to(r.code).emit("notice", `${p.name} disconnected`);
    broadcast(r);
  }
  function leave(s, disconnected = false) {
    const r = rooms.get(s.data.room);
    if (!r) return;
    const p = r.players.get(s.id);
    s.leave(r.code);
    s.data.room = null;
    const token = r.tokens.get(s.id);
    if (disconnected && token && p) {
      const c = r.race.cars.get(s.id);
      if (c) {
        c.input = {};
        c.inputAt = 0;
        c.inputSeq = 0;
      }
      r.pending.set(token, {
        id: s.id,
        until: Date.now() + RECONNECT_GRACE_MS,
      });
      if (r.host === s.id) {
        const replacement = [...r.players.keys()].find(
          (id) =>
            id !== s.id && ![...r.pending.values()].some((v) => v.id === id),
        );
        if (replacement) r.host = replacement;
      }
      io.to(r.code).emit("notice", `${p.name} is reconnecting`);
      broadcast(r);
      return;
    }
    removePlayer(r, s.id);
  }
  io.on("connection", (s) => {
    let requests = 0,
      windowAt = Date.now();
    s.use((_packet, next) => {
      if (Date.now() - windowAt > 1000) {
        windowAt = Date.now();
        requests = 0;
      }
      if (++requests > 70) return next(new Error("Slow down"));
      next();
    });
    const action = (event, fn) =>
      s.on(event, (data, ack) => {
        try {
          const result = fn(data);
          if (typeof ack === "function") ack({ ok: true, ...result });
        } catch (e) {
          if (typeof ack === "function")
            ack({
              ok: false,
              error: e.message || "Request failed",
              retryable: e.retryable === true,
            });
        }
      });
    action("enter", (data) => {
      if (!data || typeof data !== "object") throw Error("Enter a nickname.");
      if (s.data.room) throw Error("Leave your current room first.");
      if (data.token !== undefined) {
        if (
          typeof data.code !== "string" ||
          !/^[A-Z2-9]{5}$/.test(data.code) ||
          typeof data.token !== "string" ||
          !/^[A-Za-z0-9_-]{43}$/.test(data.token)
        )
          throw Error("Invalid reconnect details.");
        const r = rooms.get(data.code);
        if (!r) throw Error("Room not found. Ask your friend for a new code.");
        const pending = r?.pending.get(data.token);
        if (!pending && [...r.tokens.values()].includes(data.token)) {
          const error = Error(
            "Previous connection is still closing. Retrying...",
          );
          error.retryable = true;
          throw error;
        }
        if (!pending || pending.until <= Date.now())
          throw Error("Reconnect window expired. Join the next lobby.");
        const oldId = pending.id;
        const p = r.players.get(oldId),
          c = r.race.cars.get(oldId);
        if (!p || !c) throw Error("Racer is no longer available.");
        r.pending.delete(data.token);
        r.players.delete(oldId);
        r.players.set(s.id, { ...p, id: s.id });
        r.race.cars.delete(oldId);
        c.id = s.id;
        c.input = {};
        c.inputAt = 0;
        c.inputSeq = 0;
        c.ack = 0;
        r.race.cars.set(s.id, c);
        r.tokens.delete(oldId);
        r.tokens.set(s.id, data.token);
        if (r.host === oldId) r.host = s.id;
        else if (
          [...r.pending.values()].some((pending) => pending.id === r.host)
        )
          r.host = s.id;
        s.data.room = r.code;
        s.join(r.code);
        io.to(r.code).emit("notice", `${p.name} reconnected`);
        broadcast(r);
        return { code: r.code, token: data.token, resumed: true };
      }
      const name = typeof data.name === "string" ? data.name.trim() : "";
      if (name.length < 1 || name.length > 18 || /[\x00-\x1f]/.test(name))
        throw Error("Use a nickname of 1–18 characters.");
      let r;
      if (data.create === true) {
        if (rooms.size >= 100) throw Error("Server is full. Try later.");
        let code;
        do {
          code = Array.from(
            { length: 5 },
            () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[randomInt(32)],
          ).join("");
        } while (rooms.has(code));
        r = {
          code,
          host: s.id,
          phase: "lobby",
          players: new Map(),
          tokens: new Map(),
          pending: new Map(),
          race: new Race(),
          startAt: 0,
          endAt: 0,
        };
        rooms.set(code, r);
      } else {
        if (typeof data.code !== "string" || !/^[A-Z2-9]{5}$/.test(data.code))
          throw Error("Enter a valid 5-character room code.");
        r = rooms.get(data.code);
        if (!r) throw Error("Room not found. Ask your friend for a new code.");
      }
      if (r.phase !== "lobby")
        throw Error("Race in progress. Join after the rematch.");
      if (r.players.size >= 6) throw Error("Room is full (6 players).");
      const color =
        colors.find(
          (c) => ![...r.players.values()].some((p) => p.color === c),
        ) || colors[r.players.size % colors.length];
      r.players.set(s.id, { id: s.id, name, color });
      r.race.add(s.id, r.players.size - 1);
      const token =
        data.resume === true ? randomBytes(32).toString("base64url") : null;
      if (token) r.tokens.set(s.id, token);
      s.data.room = r.code;
      s.join(r.code);
      io.to(r.code).emit("notice", `${name} joined the race`);
      broadcast(r);
      return { code: r.code, ...(token ? { token } : {}) };
    });
    action("start", () => {
      const r = rooms.get(s.data.room);
      if (!r || r.host !== s.id) throw Error("Only the host can start.");
      if (r.phase !== "lobby") throw Error("Race is already in progress.");
      if (r.pending.size)
        throw Error("Wait for reconnecting racers before starting.");
      r.race = new Race();
      r.raceId = (r.raceId || 0) + 1;
      [...r.players.keys()].forEach((id, i) => r.race.add(id, i));
      r.phase = "countdown";
      r.startAt = Date.now() + 3000;
      r.endAt = 0;
      broadcast(r);
    });
    action("rematch", () => {
      const r = rooms.get(s.data.room);
      if (!r || r.host !== s.id || r.phase !== "results")
        throw Error("Only the host can rematch after results.");
      r.phase = "lobby";
      r.startAt = 0;
      r.endAt = 0;
      r.race = new Race();
      [...r.players.keys()].forEach((id, i) => r.race.add(id, i));
      broadcast(r);
    });
    action("leave", () => leave(s));
    s.on("clock", (_data, ack) => {
      if (typeof ack === "function") ack(Date.now());
    });
    s.on("input", (data) => {
      const c = rooms.get(s.data.room)?.race.cars.get(s.id);
      if (!c || !data || typeof data !== "object") return;
      if (data.seq !== undefined) {
        if (
          !Number.isSafeInteger(data.seq) ||
          data.seq < 0 ||
          data.seq <= (c.inputSeq || 0)
        )
          return;
        c.inputSeq = data.seq;
      }
      c.input = Object.fromEntries(
        ["up", "down", "left", "right", "drift", "reset"].map((k) => [
          k,
          data[k] === true,
        ]),
      );
      c.inputAt = Date.now();
    });
    s.on("disconnect", () => leave(s, true));
  });
  let ticks = 0,
    lastTick = performance.now(),
    accumulator = 0;
  const interval = setInterval(() => {
    const mono = performance.now();
    // Do not let sustained CPU overload build an ever-older physics queue.
    // Five fixed steps are the most this callback can execute; discard older
    // debt so authoritative positions and timestamps stay close to wall time.
    accumulator = Math.min(
      5 / 60,
      accumulator + Math.max(0, (mono - lastTick) / 1000),
    );
    lastTick = mono;
    let steps = 0;
    while (accumulator >= 1 / 60 && steps < 5) {
      accumulator -= 1 / 60;
      steps++;
      const now = Date.now() - accumulator * 1000;
      for (const r of rooms.values()) {
        if (ticks % 30 === 0)
          for (const [token, pending] of r.pending)
            if (pending.until <= now) removePlayer(r, pending.id);
        if (!rooms.has(r.code)) continue;
        if (r.phase === "countdown" && now >= r.startAt) {
          r.phase = "racing";
          broadcast(r);
        }
        if (r.phase !== "lobby")
          r.race.step(1 / 60, now, r.phase === "racing", r.startAt);
        if (r.phase === "racing") {
          const cars = [...r.race.cars.values()];
          if (cars.some((c) => c.finished !== null) && !r.endAt)
            r.endAt = now + 60000;
          if (
            (cars.length > 0 && cars.every((c) => c.finished !== null)) ||
            (r.endAt && now >= r.endAt) ||
            now - r.startAt > 600000
          ) {
            r.phase = "results";
            broadcast(r);
          }
        }
        if (
          ticks %
            (r.phase === "lobby" ? 30 : r.phase === "results" ? 12 : 2) ===
          0
        )
          // Drop stale high-rate positions under backpressure, but deliver a
          // reliable keyframe about every 233 ms to preserve phase and clock sync.
          broadcast(
            r,
            (r.phase === "countdown" || r.phase === "racing") &&
              ticks % 14 !== 0,
          );
      }
      ticks++;
    }
  }, 8);
  return {
    http,
    io,
    rooms,
    close: async () => {
      clearInterval(interval);
      await vite?.close();
      await new Promise((resolve) => io.close(resolve));
      if (http.listening) await new Promise((resolve) => http.close(resolve));
    },
  };
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const game = await createGame({ dev: process.argv.includes("--dev") });
  game.http.listen(Number(process.env.PORT) || 3000, "0.0.0.0", () =>
    console.log("APEX racing: http://localhost:" + (process.env.PORT || 3000)),
  );
}
