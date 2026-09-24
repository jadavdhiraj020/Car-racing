import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-600.css";
import "./style.css";
import { io } from "socket.io-client";
import { createScene } from "./scene.js";
import { TRACK, LENGTH, point, nearest } from "../../shared/track.js";
import { validSnapshot } from "../../shared/protocol.js";

const $ = (id) => document.getElementById(id),
  socket = io(),
  keys = {},
  inputSources = new Map(),
  map = $("minimap").getContext("2d");

const toCX = (x) => 95 + (x + 20) * 0.23;
const toCY = (z) => 100 - (z - 5) * 0.23;

// Pre-render static minimap background once to prevent 3200 binary searches/sec
const mapBg = document.createElement("canvas");
mapBg.width = 180;
mapBg.height = 200;
const bgCtx = mapBg.getContext("2d");

bgCtx.beginPath();
for (let i = 0; i <= 160; i++) {
  const p = point((i * LENGTH) / 160);
  if (i === 0) bgCtx.moveTo(toCX(p.x), toCY(p.z));
  else bgCtx.lineTo(toCX(p.x), toCY(p.z));
}
bgCtx.closePath();
bgCtx.strokeStyle = "#b1c4a444";
bgCtx.lineWidth = 14;
bgCtx.stroke();

bgCtx.strokeStyle = "#d6fc71aa";
bgCtx.lineWidth = 3;
bgCtx.stroke();

const f0 = point(0, -11),
  f1 = point(0, 11);
bgCtx.beginPath();
bgCtx.moveTo(toCX(f0.x), toCY(f0.z));
bgCtx.lineTo(toCX(f1.x), toCY(f1.z));
bgCtx.strokeStyle = "#ffffff";
bgCtx.lineWidth = 2.5;
bgCtx.stroke();

let view,
  state,
  offset = 0,
  toastTimer,
  sound = false,
  lastCountdown = "",
  lastPhase = "",
  lastGantryStep = -1,
  quality = 1;

window.__getState = () => (state ? structuredClone(state) : null);
window.__getKeys = () => ({ ...keys });
window.__getDiagnostics = () => ({
  render: view?.metrics(),
  audio: engineAudio.metrics?.(),
});
let clockKnown = false,
  clockSamples = [],
  inputSeq = 0,
  inputHistory = [],
  lastRender = 0,
  lastMap = 0,
  lastHudUpdate = 0,
  lastRpmStyle = "",
  uiSignature = "";
function syncClock() {
  if (!socket.connected) return;
  const start = Date.now();
  socket.timeout(2000).emit("clock", {}, (error, serverTime) => {
    if (error || !Number.isFinite(serverTime)) return;
    const end = Date.now();
    clockSamples.push({
      rtt: end - start,
      offset: serverTime - (start + end) / 2,
    });
    clockSamples = clockSamples.slice(-16);
    const best = [...clockSamples].sort((a, b) => a.rtt - b.rtt)[0];
    offset = best.offset;
    clockKnown = true;
    const meanRtt =
      clockSamples.reduce((acc, s) => acc + s.rtt, 0) / clockSamples.length;
    const variance =
      clockSamples.reduce((acc, s) => acc + (s.rtt - meanRtt) ** 2, 0) /
      clockSamples.length;
    const stdDev = Math.sqrt(variance);
    view?.network(offset, best.rtt, stdDev);
  });
}
setInterval(syncClock, 5000);

import { EngineAudio } from "./audio.js";

const engineAudio = new EngineAudio();

function notice(text) {
  $("toast").textContent = text;
  $("toast").style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("toast").style.display = "none"), 4500);
}

try {
  view = createScene($("game"), engineAudio);
} catch (e) {
  notice(
    "3D could not start. Enable browser hardware acceleration and reload.",
  );
  console.error(e);
}

function beep(freq = 600, duration = 0.12) {
  if (!sound) return;
  engineAudio.beep(freq, duration);
}

$("sound").onclick = async () => {
  $("sound").disabled = true;
  sound = !sound;
  if (sound) {
    try {
      await engineAudio.init();
    } catch {
      sound = false;
      notice("Audio could not start. Try Chrome or Edge over HTTPS.");
    }
  } else engineAudio.mute();
  $("sound").textContent = sound ? "SOUND ON" : "SOUND OFF";
  $("sound").disabled = false;
};

$("audioSettings").onclick = () => {
  const open = $("audioPanel").hidden;
  $("audioPanel").hidden = !open;
  $("audioSettings").setAttribute("aria-expanded", String(open));
};
for (const name of ["Master", "Engine", "Music", "Sfx"]) {
  $("volume" + name).oninput = () => {
    const value = Number($("volume" + name).value);
    $("value" + name).textContent = value + "%";
    engineAudio.setVolumes({ [name.toLowerCase()]: value / 100 });
  };
}
window.addEventListener("pagehide", () => {
  engineAudio.setSuspended(true);
});
window.addEventListener("pageshow", () => {
  engineAudio.setSuspended(document.hidden);
});

$("quality").onclick = () => {
  quality = (quality + 1) % 4;
  view?.quality(quality);
  $("quality").textContent =
    "QUALITY " + ["LOW", "MEDIUM", "HIGH", "ULTRA"][quality];
};

const invite = new URLSearchParams(location.search).get("room");
if (invite) $("code").value = invite.toUpperCase().slice(0, 5);

function request(event, data = {}) {
  return new Promise((resolve) => {
    if (!socket.connected) {
      notice("Connecting to server. Please wait and try again.");
      return resolve(false);
    }
    socket.timeout(5000).emit(event, data, (err, result) => {
      if (err || !result?.ok) {
        notice(result?.error || "Server did not respond. Please try again.");
        resolve(false);
      } else resolve(result);
    });
  });
}

$("create").onclick = () =>
  request("enter", { name: $("nickname").value, create: true });
$("join").onclick = () =>
  request("enter", {
    name: $("nickname").value,
    code: $("code").value.trim().toUpperCase(),
  });
$("start").onclick = () => request("start");
$("rematch").onclick = () => request("rematch");
document.querySelectorAll(".leave").forEach(
  (b) =>
    (b.onclick = async () => {
      if (await request("leave")) {
        state = null;
        clearControls();
        engineAudio.setPhase("home");
        engineAudio.silence();
        render();
        view?.update({ cars: [], players: [], phase: "lobby" }, socket.id);
        history.replaceState(null, "", location.pathname);
      }
    }),
);

$("copy").onclick = async () => {
  const url = new URL(location.href);
  url.searchParams.set("room", state.code);
  try {
    await navigator.clipboard.writeText(url.href);
    notice("Invite link copied. Send it to your friends!");
  } catch {
    notice("Copy the address bar to share your room.");
  }
};

socket.on("connect", () => {
  $("connection").textContent = "● ONLINE";
  inputSeq = 0;
  inputHistory = [];
  clockKnown = false;
  clockSamples = [];
  syncClock();
});

socket.on("disconnect", () => {
  $("connection").textContent = "RECONNECTING";
  state = null;
  engineAudio.setPhase("home");
  clearControls();
  if (sound) engineAudio.silence();
  render();
  view?.update({ cars: [], players: [], phase: "lobby" }, socket.id);
  notice(
    "Disconnected. When connected, rejoin the lobby with your code. An active race cannot be rejoined.",
  );
});

socket.on("connect_error", () => {
  $("connection").textContent = "SERVER UNAVAILABLE";
  notice(
    "Server unavailable or waking up. Wait a minute; connection retries automatically.",
  );
});

socket.on("notice", notice);

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const htmlCache = new Map();
const textCache = new Map();
function setText(id, value) {
  const text = String(value);
  if (textCache.get(id) !== text) {
    $(id).textContent = text;
    textCache.set(id, text);
  }
}
function setHtml(id, html) {
  if (htmlCache.get(id) !== html) {
    $(id).innerHTML = html;
    htmlCache.set(id, html);
  }
}
const time = (ms) => {
  const safeMs = Number.isFinite(ms) && ms > 0 ? ms : 0;
  const s = safeMs / 1000;
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
};

const ordered = () =>
  [...state.cars].sort((a, b) =>
    a.finished !== null && b.finished !== null
      ? a.finished - b.finished
      : a.finished !== null
        ? -1
        : b.finished !== null
          ? 1
          : b.progress - a.progress,
  );

function render() {
  const phase = state?.phase;
  document.body.classList.toggle("racing", !!state && phase !== "lobby");
  $("home").hidden = !!state;
  $("lobby").hidden = phase !== "lobby";
  $("results").hidden = phase !== "results";
  $("hud").hidden = !["countdown", "racing"].includes(phase);
  $("touch").hidden =
    !["countdown", "racing"].includes(phase) ||
    !matchMedia("(pointer:coarse)").matches;
  if (!state) return;

  const host = state.host === socket.id;
  $("roomCode").textContent = state.code;
  setHtml(
    "players",
    state.players
      .map(
        (p) =>
          `<div class="player"><i class="swatch" style="background:${p.color}"></i>${esc(p.name)}<span class="badge">${p.id === state.host ? "HOST" : "DRIVER"}</span></div>`,
      )
      .join(""),
  );
  $("start").hidden = !host;
  $("start").disabled = state.players.length < 2;
  $("waiting").textContent =
    `${state.players.length} / 6 drivers · ` +
    (host
      ? state.players.length < 2
        ? "Invite a friend to start."
        : "Everyone in? Start when ready."
      : "Waiting for host to start…");

  const rows = ordered(),
    player = (id) => state.players.find((p) => p.id === id);
  const leaderProgress = rows[0]?.progress || 0;

  setHtml(
    "leaderboard",
    rows
      .map((c, i) => {
        const p = player(c.id);
        const isMe = c.id === socket.id;
        const delta =
          i === 0
            ? "LEADER"
            : c.finished !== null
              ? time(c.finished)
              : `+${Math.round((Math.max(0, leaderProgress - c.progress) * LENGTH) / 24)}m`;
        return (
          `<div class="leader-row ${isMe ? "me" : ""}">` +
          `<span class="leader-pos">${i + 1}</span>` +
          `<i class="swatch" style="background:${p?.color || "#fff"}"></i>` +
          `<span class="leader-name">${esc(p?.name || "Driver")}</span>` +
          `<span class="leader-gap">${c.finished !== null ? "FIN" : delta}</span>` +
          `</div>`
        );
      })
      .join(""),
  );

  if (phase === "results") {
    $("winner").textContent =
      rows[0]?.finished !== null
        ? `${player(rows[0]?.id)?.name} takes the win.`
        : "Time’s up!";
    setHtml(
      "resultRows",
      rows
        .map(
          (c, i) =>
            `<div class="result-row"><b>${i + 1}</b><i class="swatch" style="background:${player(c.id)?.color}"></i><span>${esc(player(c.id)?.name)}</span><span>${c.finished !== null ? time(c.finished) : "DNF"}</span></div>`,
        )
        .join(""),
    );
    $("rematch").hidden = !host;
    $("resultWaiting").textContent = host
      ? "New grid. Same friends."
      : "Waiting for host to rematch…";
  }
  updateHud();
}

socket.on("state", (s) => {
  if (!validSnapshot(s) || (state?.code === s.code && s.seq <= state.seq))
    return;
  engineAudio.setPhase(s.phase);
  state = s;
  if (!clockKnown) offset = s.serverNow - Date.now();
  updateHud();
  try {
    view?.update(s, socket.id);
  } catch (err) {
    console.warn("View update warning:", err);
  }
  if (lastPhase !== s.phase) {
    if (s.phase === "results") {
      if (sound) engineAudio.celebrate();
      document.querySelectorAll(".confetti").forEach((e) => e.remove());
      for (let i = 0; i < 28; i++) {
        const piece = document.createElement("i");
        piece.className = "confetti";
        piece.style.cssText =
          "--x:" +
          ((i * 37) % 100) +
          "vw;--delay:" +
          (i % 7) * 0.09 +
          "s;--hue:" +
          i * 43 +
          ";";
        document.body.append(piece);
        setTimeout(() => piece.remove(), 4500);
      }
      document.getElementById("results").classList.remove("celebrate");
      requestAnimationFrame(() =>
        document.getElementById("results").classList.add("celebrate"),
      );
    }
    lastPhase = s.phase;
  }
  sendInput();
  const signature = s.phase + s.host + s.players.map((p) => p.id).join(",");
  if (signature !== uiSignature || performance.now() - lastRender > 100) {
    render();
    lastRender = performance.now();
    uiSignature = signature;
  }
  if (s.phase === "lobby") {
    const url = new URL(location.href);
    url.searchParams.set("room", s.code);
    history.replaceState(null, "", url);
  }
});

const bindings = {
  KeyW: "up",
  ArrowUp: "up",
  Numpad8: "up",
  Digit8: "up",
  KeyS: "down",
  ArrowDown: "down",
  Numpad2: "down",
  Digit2: "down",
  KeyA: "left",
  ArrowLeft: "left",
  Numpad4: "left",
  Digit4: "left",
  KeyD: "right",
  ArrowRight: "right",
  Numpad6: "right",
  Digit6: "right",
  Space: "drift",
  Numpad0: "drift",
  Numpad5: "drift",
  KeyR: "reset",
  NumpadEnter: "reset",
};

function resolveKey(e) {
  return (
    bindings[e.code] ||
    (e.key === "8"
      ? "up"
      : e.key === "2"
        ? "down"
        : e.key === "4"
          ? "left"
          : e.key === "6"
            ? "right"
            : null)
  );
}

// Multiple physical keys or fingers may hold the same logical control.
function setControl(source, key, pressed) {
  const previous = inputSources.get(source);
  if (pressed) inputSources.set(source, key);
  else inputSources.delete(source);
  let changed = false;
  for (const control of new Set([previous, key])) {
    if (!control) continue;
    const active = [...inputSources.values()].includes(control);
    if (!!keys[control] !== active) {
      keys[control] = active;
      changed = true;
    }
  }
  if (changed) sendInput(true);
}

function clearControls() {
  inputSources.clear();
  for (const k in keys) keys[k] = false;
}

window.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLInputElement) return;
  const key = resolveKey(e);
  if (key && state) {
    e.preventDefault();
    setControl(`keyboard:${e.code || e.key}`, key, true);
  }
});

window.addEventListener("keyup", (e) => {
  const key = resolveKey(e);
  if (key) {
    setControl(`keyboard:${e.code || e.key}`, key, false);
  }
});

window.addEventListener("blur", () => {
  clearControls();
  sendInput(true);
});

document.addEventListener("visibilitychange", () => {
  engineAudio.setSuspended(document.hidden);
  if (document.hidden) {
    clearControls();
    sendInput(true);
  }
});

document.querySelectorAll("[data-key]").forEach((b) => {
  b.onpointerdown = (e) => {
    e.preventDefault();
    b.setPointerCapture(e.pointerId);
    setControl(`pointer:${e.pointerId}`, b.dataset.key, true);
  };
  b.onpointerup =
    b.onpointercancel =
    b.onlostpointercapture =
      (e) => {
        setControl(`pointer:${e.pointerId}`, b.dataset.key, false);
      };
});

let lastInputSent = 0;
function sendInput(force = false) {
  view?.input(keys, inputHistory);
  const now = performance.now();
  if (state && socket.connected && (force || now - lastInputSent >= 33)) {
    const packet = { ...keys, seq: ++inputSeq };
    socket.volatile.emit("input", packet);
    inputHistory.push({ seq: packet.seq, at: now, input: { ...keys } });
    if (inputHistory.length > 90) inputHistory.shift();
    lastInputSent = now;
  }
}
setInterval(sendInput, 1000 / 30);

function updateCountdown() {
  if (!state) return;
  const now = Date.now() + offset,
    elapsed = now - state.startAt;
  const count =
    state.phase === "countdown"
      ? String(Math.min(3, Math.max(1, Math.ceil(-elapsed / 1000))))
      : state.phase === "racing" && elapsed < 1000
        ? "GO!"
        : "";
  if (count !== lastCountdown) {
    setText("countdown", count);
    lastCountdown = count;
    $("countdown").classList.remove("pulse");
    void $("countdown").offsetWidth;
    if (count) $("countdown").classList.add("pulse");
  }

  // Synchronized 5-light HUD gantry and audio tones
  const gantryHud = $("gantryHud");
  if (gantryHud) {
    const isCountdown = state.phase === "countdown";
    const isJustStarted = state.phase === "racing" && elapsed < 1200;
    gantryHud.hidden = !isCountdown && !isJustStarted;
    if (isCountdown) {
      let litCount = 1;
      if (elapsed >= -600) litCount = 5;
      else if (elapsed >= -1200) litCount = 4;
      else if (elapsed >= -1800) litCount = 3;
      else if (elapsed >= -2400) litCount = 2;
      if (litCount !== lastGantryStep) {
        gantryHud.querySelectorAll("i").forEach((dot, idx) => {
          dot.className = idx < litCount ? "lit" : "";
        });
        if (sound) engineAudio.countdownLight(litCount);
        lastGantryStep = litCount;
      }
    } else if (isJustStarted) {
      if (lastGantryStep !== 0) {
        gantryHud.querySelectorAll("i").forEach((dot) => {
          dot.className = "green";
        });
        if (sound) engineAudio.countdownLight(0);
        lastGantryStep = 0;
      }
    } else {
      lastGantryStep = -1;
    }
  }
}

function updateHud() {
  if (!state) return;
  lastHudUpdate = performance.now();
  const now = Date.now() + offset,
    elapsed = now - state.startAt;
  updateCountdown();
  const c = state.cars.find((c) => c.id === socket.id);
  if (!c) return;
  setText("lap", `${Math.min(3, Math.floor((c.passed || 0) / 24) + 1)} / 3`);
  setText(
    "position",
    `${ordered().findIndex((p) => p.id === c.id) + 1} / ${state.players.length}`,
  );
  const safeSpeed = Number.isFinite(c.speed)
    ? Math.max(0, Math.round(c.speed * 3.6))
    : 0;
  setText("speed", safeSpeed);
  setText("timer", time(c.finished ?? elapsed));
  setText(
    "finishMessage",
    c.finished !== null
      ? "FINISHED · Waiting for the rest of the grid"
      : state.endAt
        ? `Finish window: ${Math.max(0, Math.ceil((state.endAt - now) / 1000))}s`
        : "",
  );
}

function frame() {
  requestAnimationFrame(frame);
  try {
    if (document.hidden) return;
    sendInput();
    if (!state) {
      if (sound) engineAudio.silence();
      return;
    }
    const c = state.cars.find((c) => c.id === socket.id);
    if (!c) return;
    if (performance.now() - lastHudUpdate > 100) updateHud();

    // Dynamic engine audio & kerb rumble updates
    const safeX = Number.isFinite(c.x) ? c.x : 0;
    const safeZ = Number.isFinite(c.z) ? c.z : 0;
    const distFromCenter = nearest(safeX, safeZ).distance;
    const onKerb = distFromCenter >= 9.8 && distFromCenter <= 11.6;
    try {
      engineAudio.update(
        Number.isFinite(c.speed) ? c.speed : 0,
        !!keys.up,
        !!keys.down,
        !!keys.drift,
        state.phase === "racing",
        c.finished !== null,
        onKerb,
      );

      if (sound) engineAudio.impact(Number.isFinite(c.impact) ? c.impact : 0);
    } catch {}

    setText(
      "gear",
      keys.down && (c.speed || 0) < 2
        ? "R"
        : state.phase !== "racing"
          ? "N"
          : engineAudio.gear || "1",
    );
    const safeRpm = Number.isFinite(engineAudio?.rpm) ? engineAudio.rpm : 1000;
    const rpmPercent = Math.min(100, Math.max(0, (safeRpm / 13500) * 100));
    const rpmStyle = rpmPercent.toFixed(1);
    if (rpmStyle !== lastRpmStyle) {
      $("rpm").style.setProperty("--rpm", rpmStyle);
      lastRpmStyle = rpmStyle;
    }
    $("rpm").classList.toggle("shift-blink", safeRpm > 12400);
    view?.input(keys, inputHistory);
    if (performance.now() - lastMap < 50) return;
    lastMap = performance.now();
    // 2D Circuit Minimap (scaled for the new grand-prix circuit)
    map.clearRect(0, 0, 180, 200);
    map.drawImage(mapBg, 0, 0);

    // Player dots
    for (const p of state.players) {
      const t = state.cars.find((c) => c.id === p.id);
      if (!t || !Number.isFinite(t.x) || !Number.isFinite(t.z)) continue;
      const cx = toCX(t.x),
        cy = toCY(t.z);
      if (!Number.isFinite(cx) || !Number.isFinite(cy)) continue;
      map.fillStyle = p.color || "#fff";
      map.beginPath();
      map.arc(cx, cy, p.id === socket.id ? 5 : 3.5, 0, Math.PI * 2);
      map.fill();
      if (p.id === socket.id) {
        map.strokeStyle = "#ffffff";
        map.lineWidth = 1.5;
        map.stroke();
      }
    }
  } catch (err) {
    console.warn("Frame loop exception handled:", err);
  }
}
frame();
