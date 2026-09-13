import "./style.css";
import { io } from "socket.io-client";
import { createScene } from "./scene.js";
import { TRACK, LENGTH, point } from "../../shared/track.js";

const $ = (id) => document.getElementById(id),
  socket = io(),
  keys = {},
  map = $("minimap").getContext("2d");

let view,
  state,
  offset = 0,
  toastTimer,
  sound = false,
  lastCountdown = "",
  lastPhase = "",
  quality = 1;

// Procedural multi-harmonic engine audio system
class EngineAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.subOsc = null;
    this.coreOsc = null;
    this.roarOsc = null;
    this.filter = null;
    this.skidGain = null;
    this.skidFilter = null;
    this.skidSource = null;
    this.rpm = 950;
    this.active = false;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    const t = this.ctx.currentTime;

    // Master volume gain
    this.master = this.ctx.createGain();
    this.master.gain.setValueAtTime(0, t);
    this.master.connect(this.ctx.destination);

    // Warm soft-clipping saturation
    const waveshaper = this.ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = ((Math.PI + 3) * x) / (Math.PI + 3 * Math.abs(x));
    }
    waveshaper.curve = curve;
    waveshaper.connect(this.master);

    // Resonant intake / throttle filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(450, t);
    this.filter.Q.setValueAtTime(2.2, t);
    this.filter.connect(waveshaper);

    // Sub-bass oscillator (deep fundamental chassis rumble)
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = "triangle";
    this.subOsc.frequency.setValueAtTime(35, t);
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.09, t);
    this.subOsc.connect(subGain);
    subGain.connect(this.master);
    this.subOsc.start();

    // Core cylinder combustion oscillator
    this.coreOsc = this.ctx.createOscillator();
    this.coreOsc.type = "sawtooth";
    this.coreOsc.frequency.setValueAtTime(70, t);
    const coreGain = this.ctx.createGain();
    coreGain.gain.setValueAtTime(0.045, t);
    this.coreOsc.connect(coreGain);
    coreGain.connect(this.filter);
    this.coreOsc.start();

    // Exhaust roar oscillator (higher cylinder harmonics)
    this.roarOsc = this.ctx.createOscillator();
    this.roarOsc.type = "sawtooth";
    this.roarOsc.frequency.setValueAtTime(140, t);
    const roarGain = this.ctx.createGain();
    roarGain.gain.setValueAtTime(0.025, t);
    this.roarOsc.connect(roarGain);
    roarGain.connect(this.filter);
    this.roarOsc.start();

    // Tire skid screech noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    this.skidSource = this.ctx.createBufferSource();
    this.skidSource.buffer = noiseBuffer;
    this.skidSource.loop = true;

    this.skidFilter = this.ctx.createBiquadFilter();
    this.skidFilter.type = "bandpass";
    this.skidFilter.frequency.setValueAtTime(1150, t);
    this.skidFilter.Q.setValueAtTime(3.2, t);

    this.skidGain = this.ctx.createGain();
    this.skidGain.gain.setValueAtTime(0, t);

    this.skidSource.connect(this.skidFilter);
    this.skidFilter.connect(this.skidGain);
    this.skidGain.connect(this.master);
    this.skidSource.start();

    this.active = true;
  }

  update(speed, isAccelerating, isBraking, isDrifting, isRacing, isFinished) {
    if (!this.ctx || !this.active) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const t = this.ctx.currentTime;
    if (!isRacing || isFinished) {
      this.master.gain.setTargetAtTime(0, t, 0.15);
      return;
    }

    this.master.gain.setTargetAtTime(0.85, t, 0.1);

    // Multi-gear RPM calculation (1st to 4th gear)
    const absSpeed = Math.abs(speed);
    let gearRatio = 0;
    if (absSpeed < 13) gearRatio = absSpeed / 13;
    else if (absSpeed < 25) gearRatio = (absSpeed - 11) / 14;
    else if (absSpeed < 38) gearRatio = (absSpeed - 22) / 16;
    else gearRatio = Math.min(1.0, (absSpeed - 35) / 18);

    let targetRpm = 950 + gearRatio * 5200;
    if (isAccelerating) targetRpm += 850;
    if (isBraking) targetRpm = Math.max(850, targetRpm - 600);

    // Smooth RPM response
    this.rpm += (targetRpm - this.rpm) * 0.14;

    // Frequencies derived from engine RPM
    const baseFreq = Math.max(30, (this.rpm / 60) * 1.6);
    this.subOsc.frequency.setTargetAtTime(baseFreq * 0.5, t, 0.08);
    this.coreOsc.frequency.setTargetAtTime(baseFreq, t, 0.08);
    this.roarOsc.frequency.setTargetAtTime(baseFreq * 2.0, t, 0.08);

    // Resonant intake filter: opens on throttle, closes on overrun
    let filterFreq = 420 + (this.rpm / 7000) * 1300;
    if (isAccelerating) filterFreq += 1800;
    if (isBraking) filterFreq = Math.max(380, filterFreq * 0.7);
    this.filter.frequency.setTargetAtTime(filterFreq, t, 0.09);

    // Tire skid sound during drift or hard braking
    let skidVolume = 0;
    if (isDrifting && absSpeed > 6) skidVolume = 0.06 + Math.min(0.07, absSpeed / 200);
    else if (isBraking && absSpeed > 18) skidVolume = 0.035;
    this.skidGain.gain.setTargetAtTime(skidVolume, t, 0.08);
  }

  beep(freq = 600, duration = 0.12) {
    if (!this.ctx) return;
    try {
      const o = this.ctx.createOscillator(),
        g = this.ctx.createGain(),
        t = this.ctx.currentTime;
      o.connect(g);
      g.connect(this.ctx.destination);
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + duration);
      o.start(t);
      o.stop(t + duration);
    } catch {}
  }

  mute() {
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    }
  }
}

const engineAudio = new EngineAudio();

function notice(text) {
  $("toast").textContent = text;
  $("toast").style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("toast").style.display = "none"), 4500);
}

try {
  view = createScene($("game"));
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

$("sound").onclick = () => {
  sound = !sound;
  if (sound) engineAudio.init();
  else engineAudio.mute();
  $("sound").textContent = sound ? "SOUND ON" : "SOUND OFF";
};

$("quality").onclick = () => {
  quality = (quality + 1) % 3;
  view?.quality(quality);
  $("quality").textContent = "QUALITY " + ["LOW", "MEDIUM", "HIGH"][quality];
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
});

socket.on("disconnect", () => {
  $("connection").textContent = "RECONNECTING";
  state = null;
  for (const k in keys) keys[k] = false;
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

const time = (ms) => {
  const s = Math.max(0, ms) / 1000;
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
  $("players").innerHTML = state.players
    .map(
      (p) =>
        `<div class="player"><i class="swatch" style="background:${p.color}"></i>${esc(p.name)}<span class="badge">${p.id === state.host ? "HOST" : "DRIVER"}</span></div>`,
    )
    .join("");
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

  $("leaderboard").innerHTML = rows
    .map(
      (c, i) =>
        `<div class="leader-row"><span>${i + 1}　${esc(player(c.id)?.name)}</span><span>${c.finished !== null ? "FIN" : "L" + Math.min(3, Math.floor(c.passed / 24) + 1)}</span></div>`,
    )
    .join("");

  if (phase === "results") {
    $("winner").textContent =
      rows[0]?.finished !== null
        ? `${player(rows[0]?.id)?.name} takes the win.`
        : "Time’s up!";
    $("resultRows").innerHTML = rows
      .map(
        (c, i) =>
          `<div class="result-row"><b>${i + 1}</b><i class="swatch" style="background:${player(c.id)?.color}"></i><span>${esc(player(c.id)?.name)}</span><span>${c.finished !== null ? time(c.finished) : "DNF"}</span></div>`,
      )
      .join("");
    $("rematch").hidden = !host;
    $("resultWaiting").textContent = host
      ? "New grid. Same friends."
      : "Waiting for host to rematch…";
  }
}

socket.on("state", (s) => {
  if (!s || !Array.isArray(s.cars) || !Array.isArray(s.players)) return;
  state = s;
  offset = s.serverNow - Date.now();
  view?.update(s, socket.id);
  if (lastPhase !== s.phase) {
    if (s.phase === "results") beep(900, 0.6);
    lastPhase = s.phase;
  }
  render();
  if (s.phase === "lobby") {
    const url = new URL(location.href);
    url.searchParams.set("room", s.code);
    history.replaceState(null, "", url);
  }
});

const bindings = {
  KeyW: "up",
  ArrowUp: "up",
  KeyS: "down",
  ArrowDown: "down",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  Space: "drift",
  KeyR: "reset",
};

window.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLInputElement) return;
  const key = bindings[e.code];
  if (key && state) {
    e.preventDefault();
    keys[key] = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (bindings[e.code]) keys[bindings[e.code]] = false;
});

window.addEventListener("blur", () => {
  for (const k in keys) keys[k] = false;
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) for (const k in keys) keys[k] = false;
});

document.querySelectorAll("[data-key]").forEach((b) => {
  b.onpointerdown = (e) => {
    e.preventDefault();
    b.setPointerCapture(e.pointerId);
    keys[b.dataset.key] = true;
  };
  b.onpointerup =
    b.onpointercancel =
    b.onlostpointercapture =
      () => (keys[b.dataset.key] = false);
});

setInterval(() => {
  if (state && socket.connected) socket.volatile.emit("input", keys);
}, 1000 / 30);

function frame() {
  requestAnimationFrame(frame);
  if (!state) {
    if (sound) engineAudio.mute();
    return;
  }
  const c = state.cars.find((c) => c.id === socket.id);
  if (!c) return;
  const now = Date.now() + offset,
    elapsed = now - state.startAt;
  const count =
    state.phase === "countdown"
      ? String(Math.max(1, Math.ceil(-elapsed / 1000)))
      : state.phase === "racing" && elapsed < 1000
        ? "GO!"
        : "";
  $("countdown").textContent = count;
  if (count !== lastCountdown) {
    if (count) beep(count === "GO!" ? 900 : 500);
    lastCountdown = count;
  }
  $("lap").textContent = `${Math.min(3, Math.floor(c.passed / 24) + 1)} / 3`;
  $("position").textContent =
    `${ordered().findIndex((p) => p.id === c.id) + 1} / ${state.players.length}`;
  $("speed").textContent = Math.round(c.speed * 3.6);
  $("timer").textContent = time(c.finished ?? elapsed);
  $("finishMessage").textContent =
    c.finished !== null
      ? "FINISHED · Waiting for the rest of the grid"
      : state.endAt
        ? `Finish window: ${Math.max(0, Math.ceil((state.endAt - now) / 1000))}s`
        : "";

  // Dynamic engine audio updates
  if (sound) {
    engineAudio.update(
      c.speed,
      !!keys.up,
      !!keys.down,
      !!keys.drift,
      state.phase === "racing",
      c.finished !== null,
    );
  }

  // 2D Circuit Minimap (scaled for the new grand-prix circuit)
  map.clearRect(0, 0, 180, 200);
  const toCX = (x) => 95 + (x + 20) * 0.23;
  const toCY = (z) => 100 - (z - 5) * 0.23;

  // Track outer path
  map.beginPath();
  for (let i = 0; i <= 160; i++) {
    const p = point((i * LENGTH) / 160);
    if (i === 0) map.moveTo(toCX(p.x), toCY(p.z));
    else map.lineTo(toCX(p.x), toCY(p.z));
  }
  map.closePath();
  map.strokeStyle = "#b1c4a444";
  map.lineWidth = 14;
  map.stroke();

  // Track racing line
  map.strokeStyle = "#d6fc71aa";
  map.lineWidth = 3;
  map.stroke();

  // Start / finish line
  const f0 = point(0, -11),
    f1 = point(0, 11);
  map.beginPath();
  map.moveTo(toCX(f0.x), toCY(f0.z));
  map.lineTo(toCX(f1.x), toCY(f1.z));
  map.strokeStyle = "#ffffff";
  map.lineWidth = 2.5;
  map.stroke();

  // Player dots
  for (const p of state.players) {
    const t = state.cars.find((c) => c.id === p.id);
    if (!t) continue;
    const cx = toCX(t.x),
      cy = toCY(t.z);
    map.fillStyle = p.color;
    map.beginPath();
    map.arc(cx, cy, p.id === socket.id ? 5 : 3.5, 0, Math.PI * 2);
    map.fill();
    if (p.id === socket.id) {
      map.strokeStyle = "#ffffff";
      map.lineWidth = 1.5;
      map.stroke();
    }
  }
}
frame();
