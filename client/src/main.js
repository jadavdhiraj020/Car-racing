import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-600.css";
import "./style.css";
import { io } from "socket.io-client";
import { createScene } from "./scene.js";
import { getTrack } from "../../shared/track.js";
import { validSnapshot } from "../../shared/protocol.js";

const $ = (id) => document.getElementById(id),
  socket = io(),
  keys = {},
  inputSources = new Map(),
  map = $("minimap").getContext("2d");

let track = getTrack(),
  TRACK = track,
  LENGTH = track.length,
  point = track.point,
  nearest = track.nearest,
  mapCenterX = 0,
  mapCenterZ = 0,
  mapScale = 1;
const toCX = (x) => 90 + (x - mapCenterX) * mapScale;
const toCY = (z) => 100 - (z - mapCenterZ) * mapScale;

// Pre-render static minimap background once to prevent 3200 binary searches/sec
const mapBg = document.createElement("canvas");
mapBg.width = 180;
mapBg.height = 200;
const bgCtx = mapBg.getContext("2d");

function rebuildMinimap() {
  const { minX, maxX, minZ, maxZ } = track.bounds;
  mapCenterX = (minX + maxX) / 2;
  mapCenterZ = (minZ + maxZ) / 2;
  mapScale = Math.min(150 / (maxX - minX), 170 / (maxZ - minZ));
  bgCtx.clearRect(0, 0, 180, 200);
  bgCtx.beginPath();
  for (let i = 0; i <= 160; i++) {
    const p = point((i * LENGTH) / 160);
    if (i === 0) bgCtx.moveTo(toCX(p.x), toCY(p.z));
    else bgCtx.lineTo(toCX(p.x), toCY(p.z));
  }
  bgCtx.closePath();
  bgCtx.strokeStyle = "#b1c4a444";
  bgCtx.lineWidth = Math.max(7, track.width * mapScale + 3);
  bgCtx.stroke();
  bgCtx.strokeStyle = "#d6fc71aa";
  bgCtx.lineWidth = 3;
  bgCtx.stroke();
  const f0 = point(0, -track.width / 2),
    f1 = point(0, track.width / 2);
  bgCtx.beginPath();
  bgCtx.moveTo(toCX(f0.x), toCY(f0.z));
  bgCtx.lineTo(toCX(f1.x), toCY(f1.z));
  bgCtx.strokeStyle = "#ffffff";
  bgCtx.lineWidth = 2.5;
  bgCtx.stroke();
}
rebuildMinimap();

let view,
  state,
  offset = 0,
  toastTimer,
  sound = false,
  lastCountdown = "",
  lastPhase = "",
  lastGantryStep = -1,
  quality = 1,
  cameraIndex = 0;
const cameraModes = ["chase", "cockpit", "overhead"];

window.__getState = () => (state ? structuredClone(state) : null);
window.__getKeys = () => ({ ...keys });
window.__getDiagnostics = () => ({
  render: view?.metrics(),
  audio: engineAudio.metrics?.(),
  network: { rttMs: networkRtt, jitterMs: networkJitter, offsetMs: offset },
});
let clockKnown = false,
  clockSamples = [],
  networkRtt = 0,
  networkJitter = 0,
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
    const sorted = [...clockSamples].sort((a, b) => a.rtt - b.rtt);
    const best = sorted[0];
    // A delayed browser callback is not sustained network jitter. Ease small
    // clock corrections to keep the shared interpolation timeline continuous.
    const correction = best.offset - offset;
    const muchBetterSample = networkRtt > 0 && best.rtt < networkRtt * 0.7;
    offset =
      !clockKnown || muchBetterSample || Math.abs(correction) > 500
        ? best.offset
        : offset + Math.max(-12, Math.min(12, correction));
    clockKnown = true;
    // The interquartile range ignores one-off render stalls yet tracks normal
    // variation. A single slow ping previously inflated the buffer for 80 s.
    const q1 = sorted[Math.floor((sorted.length - 1) * 0.25)].rtt;
    const q3 = sorted[Math.floor((sorted.length - 1) * 0.75)].rtt;
    networkRtt = best.rtt;
    networkJitter = sorted.length >= 4 ? Math.min(30, (q3 - q1) / 1.349) : 0;
    view?.network(offset, networkRtt, networkJitter);
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
  view = createScene($("game"), engineAudio, track);
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
  const initial = Math.round(engineAudio.volumes[name.toLowerCase()] * 100);
  $("volume" + name).value = initial;
  $("value" + name).textContent = initial + "%";
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

function cycleCamera() {
  cameraIndex = (cameraIndex + 1) % cameraModes.length;
  const mode = cameraModes[cameraIndex];
  view?.camera(mode);
  $("camera").textContent = "VIEW " + mode.toUpperCase() + " · C";
}
$("camera").onclick = cycleCamera;

function selectTrack(id) {
  const next = getTrack(id);
  if (next.id === track.id && view) return;
  view?.dispose();
  view = null;
  track = next;
  TRACK = track;
  LENGTH = track.length;
  point = track.point;
  nearest = track.nearest;
  rebuildMinimap();
  clearControls();
  inputHistory = [];
  lastMap = 0;
  try {
    view = createScene($("game"), engineAudio, track);
    view.quality(quality);
    view.camera(cameraModes[cameraIndex]);
    view.network(offset, networkRtt, networkJitter);
  } catch (error) {
    notice("Circuit could not load. Reload to reconnect to your room.");
    console.error(error);
  }
}

const invite = new URLSearchParams(location.search).get("room");
if (invite) $("code").value = invite.toUpperCase().slice(0, 5);

const resumeStorageKey = "apex-race-resume";
let resumeSession = null;
let resumeTimer = null;
let resumeGeneration = 0;
let resumeDeadline = 0;
try {
  const saved = JSON.parse(sessionStorage.getItem(resumeStorageKey));
  if (
    saved &&
    /^[A-Z2-9]{5}$/.test(saved.code) &&
    typeof saved.token === "string" &&
    saved.token.length >= 32 &&
    (!invite || invite.toUpperCase() === saved.code)
  )
    resumeSession = saved;
} catch {}

function clearResume() {
  resumeGeneration++;
  clearTimeout(resumeTimer);
  resumeTimer = null;
  resumeSession = null;
  resumeDeadline = 0;
  try {
    sessionStorage.removeItem(resumeStorageKey);
  } catch {}
}

function rememberResume(code, token) {
  if (!/^[A-Z2-9]{5}$/.test(code) || typeof token !== "string") return;
  resumeGeneration++;
  clearTimeout(resumeTimer);
  resumeTimer = null;
  resumeSession = { code, token };
  resumeDeadline = 0;
  try {
    sessionStorage.setItem(resumeStorageKey, JSON.stringify(resumeSession));
  } catch {}
}

function tryResume() {
  if (!resumeSession || !socket.connected || state) return;
  if (!resumeDeadline) resumeDeadline = Date.now() + 32000;
  const generation = ++resumeGeneration;
  socket.timeout(5000).emit("enter", resumeSession, (error, result) => {
    if (generation !== resumeGeneration || !resumeSession) return;
    if (!error && result?.ok && result.resumed) {
      rememberResume(result.code, result.token);
      notice("Race connection restored.");
    } else if ((error || result?.retryable) && Date.now() < resumeDeadline) {
      resumeTimer = setTimeout(tryResume, 700);
    } else {
      clearResume();
      notice("Your race seat expired. Join the next lobby with your friends.");
    }
  });
}

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

$("create").onclick = async () => {
  clearResume();
  const result = await request("enter", {
    name: $("nickname").value,
    create: true,
    resume: true,
  });
  if (result?.token) rememberResume(result.code, result.token);
};
$("join").onclick = async () => {
  clearResume();
  const result = await request("enter", {
    name: $("nickname").value,
    code: $("code").value.trim().toUpperCase(),
    resume: true,
  });
  if (result?.token) rememberResume(result.code, result.token);
};
$("start").onclick = () => request("start");
$("rematch").onclick = () => request("rematch");
document.querySelectorAll(".leave").forEach(
  (b) =>
    (b.onclick = async () => {
      if (await request("leave")) {
        clearResume();
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
  networkRtt = 0;
  networkJitter = 0;
  syncClock();
  setTimeout(syncClock, 350);
  setTimeout(syncClock, 1200);
  if (resumeSession) tryResume();
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
    resumeSession
      ? "Connection lost. Reconnecting to your race…"
      : "Disconnected. When connected, rejoin the lobby with your code.",
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
  setText("trackName", track.name.toUpperCase());
  setText("lobbyTrack", track.name + " · " + Math.round(LENGTH) + " m");
  const reconnecting = new Set(state.reconnecting || []);
  $("roomCode").textContent = state.code;
  setHtml(
    "players",
    state.players
      .map(
        (p) =>
          `<div class="player"><i class="swatch" style="background:${p.color}"></i>${esc(p.name)}<span class="badge">${reconnecting.has(p.id) ? "RECONNECTING" : p.id === state.host ? "HOST" : "DRIVER"}</span></div>`,
      )
      .join(""),
  );
  $("start").hidden = !host;
  $("start").disabled = reconnecting.size > 0;
  $("waiting").textContent =
    `${state.players.length} / 6 drivers · ` +
    (host
      ? reconnecting.size > 0
        ? "Waiting for reconnecting drivers…"
        : state.players.length < 2
          ? "Start a solo test race or invite friends."
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
  selectTrack(s.trackId);
  state = s;
  if (!clockKnown) {
    offset = s.serverNow - Date.now();
    view?.network(offset, 0, 0);
  }
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
  const signature =
    s.phase +
    s.host +
    s.trackId +
    s.reconnecting.join(",") +
    s.players.map((p) => p.id).join(",");
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
  if (e.code === "KeyC" && !e.repeat) {
    e.preventDefault();
    cycleCamera();
    return;
  }
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
    // Key changes and releases must arrive; only unchanged periodic updates
    // may be dropped when a connection is congested.
    if (force) socket.emit("input", packet);
    else socket.volatile.emit("input", packet);
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
    const onKerb =
      distFromCenter >= TRACK.width / 2 - 1.2 &&
      distFromCenter <= TRACK.width / 2 + 0.6;
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

      if (sound)
        engineAudio.impact(
          state.phase === "racing" &&
            c.finished === null &&
            Number.isFinite(c.impact)
            ? c.impact
            : 0,
        );
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
