import express from "express";
import { createServer } from "node:http";
import { randomInt } from "node:crypto";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { Race } from "./race.js";
import { TRACK } from "../shared/track.js";
export async function createGame({ dev = false } = {}) {
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
    code: r.code,
    host: r.host,
    phase: r.phase,
    startAt: r.startAt,
    serverNow: Date.now(),
    players: [...r.players.values()],
    cars: r.race.snapshot(),
    endAt: r.endAt,
  });
  function broadcast(r) {
    io.to(r.code).emit("state", state(r));
  }
  function leave(s) {
    const r = rooms.get(s.data.room);
    if (!r) return;
    const p = r.players.get(s.id);
    r.players.delete(s.id);
    r.race.remove(s.id);
    s.leave(r.code);
    s.data.room = null;
    if (!r.players.size) {
      rooms.delete(r.code);
      return;
    }
    if (r.host === s.id) r.host = r.players.keys().next().value;
    io.to(r.code).emit("notice", `${p?.name || "Player"} disconnected`);
    broadcast(r);
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
            ack({ ok: false, error: e.message || "Request failed" });
        }
      });
    action("enter", (data) => {
      if (!data || typeof data !== "object") throw Error("Enter a nickname.");
      const name = typeof data.name === "string" ? data.name.trim() : "";
      if (name.length < 1 || name.length > 18 || /[\x00-\x1f]/.test(name))
        throw Error("Use a nickname of 1–18 characters.");
      if (s.data.room) throw Error("Leave your current room first.");
      let r;
      if (data.create === true) {
        if (rooms.size >= 100) throw Error("Server is full. Try later.");
        let code;
        do {
          code = Array.from(
            { length: 5 },
            () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[randomInt(31)],
          ).join("");
        } while (rooms.has(code));
        r = {
          code,
          host: s.id,
          phase: "lobby",
          players: new Map(),
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
      const color = colors.find(
        (c) => ![...r.players.values()].some((p) => p.color === c),
      );
      r.players.set(s.id, { id: s.id, name, color });
      r.race.add(s.id, r.players.size - 1);
      s.data.room = r.code;
      s.join(r.code);
      io.to(r.code).emit("notice", `${name} joined the race`);
      broadcast(r);
      return { code: r.code };
    });
    action("start", () => {
      const r = rooms.get(s.data.room);
      if (!r || r.host !== s.id) throw Error("Only the host can start.");
      if (r.phase !== "lobby" || r.players.size < 2)
        throw Error("You need at least 2 players.");
      r.race = new Race();
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
    s.on("disconnect", () => leave(s));
  });
  let ticks = 0,
    lastTick = performance.now(),
    accumulator = 0;
  const interval = setInterval(() => {
    const mono = performance.now();
    accumulator += Math.min(0.15, (mono - lastTick) / 1000);
    lastTick = mono;
    while (accumulator >= 1 / 60) {
      accumulator -= 1 / 60;
      const now = Date.now() - accumulator * 1000;
      for (const r of rooms.values()) {
        if (r.phase === "countdown" && now >= r.startAt) r.phase = "racing";
        if (r.phase !== "lobby")
          r.race.step(1 / 60, now, r.phase === "racing", r.startAt);
        if (r.phase === "racing") {
          const cars = [...r.race.cars.values()];
          if (cars.some((c) => c.finished) && !r.endAt) r.endAt = now + 60000;
          if (
            cars.every((c) => c.finished) ||
            (r.endAt && now >= r.endAt) ||
            now - r.startAt > 600000
          )
            r.phase = "results";
        }
        if (
          ticks %
            (r.phase === "lobby" ? 30 : r.phase === "results" ? 12 : 2) ===
          0
        )
          broadcast(r);
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
