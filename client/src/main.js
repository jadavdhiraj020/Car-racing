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
  audio,
  osc,
  gain,
  sound = false,
  lastCountdown = "",
  lastPhase = "",
  low = false;
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
  if (!sound || !audio) return;
  const o = audio.createOscillator(),
    g = audio.createGain();
  o.connect(g);
  g.connect(audio.destination);
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.06, audio.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
  o.start();
  o.stop(audio.currentTime + duration);
}
$("sound").onclick = () => {
  sound = !sound;
  if (sound && !audio) {
    audio = new AudioContext();
    osc = audio.createOscillator();
    gain = audio.createGain();
    osc.type = "sawtooth";
    osc.connect(gain);
    gain.connect(audio.destination);
    gain.gain.value = 0;
    osc.start();
  }
  audio?.resume();
  $("sound").textContent = sound ? "SOUND ON" : "SOUND OFF";
  if (!sound && gain) gain.gain.value = 0;
};
$("quality").onclick = () => {
  low = !low;
  view?.quality(low);
  $("quality").textContent = low ? "QUALITY LOW" : "QUALITY HIGH";
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
    if (gain) gain.gain.value = 0;
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
  if (sound && gain) {
    gain.gain.value =
      state.phase === "racing" && c.finished === null ? 0.018 : 0;
    osc.frequency.setTargetAtTime(40 + c.speed * 3, audio.currentTime, 0.1);
  }
  map.clearRect(0, 0, 180, 200);
  map.beginPath();
  for (let i = 0; i <= 120; i++) {
    const p = point((i * LENGTH) / 120);
    map.lineTo(90 + p.x * 0.75, 100 + p.z * 0.75);
  }
  map.strokeStyle = "#b1c4a477";
  map.lineWidth = 13;
  map.stroke();
  for (const p of state.players) {
    const t = state.cars.find((c) => c.id === p.id);
    if (!t) continue;
    map.fillStyle = p.color;
    map.beginPath();
    map.arc(
      90 + t.x * 0.75,
      100 + t.z * 0.75,
      p.id === socket.id ? 4.5 : 3,
      0,
      Math.PI * 2,
    );
    map.fill();
  }
}
frame();
