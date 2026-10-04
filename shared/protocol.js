import { TRACKS } from "./track.js";
const trackIds = new Set(TRACKS.map((track) => track.id));
// Validate the complete snapshot at the network boundary, before UI/audio/3D see it.
export function validSnapshot(s) {
  if (
    !s ||
    !trackIds.has(s.trackId) ||
    !["lobby", "countdown", "racing", "results"].includes(s.phase) ||
    typeof s.code !== "string" ||
    !/^[A-Z2-9]{5}$/.test(s.code) ||
    !Number.isSafeInteger(s.seq) ||
    s.seq < 1 ||
    !Number.isSafeInteger(s.raceId) ||
    s.raceId < 0 ||
    ![s.serverNow, s.startAt, s.endAt].every(Number.isFinite) ||
    !Array.isArray(s.players) ||
    !Array.isArray(s.reconnecting) ||
    !Array.isArray(s.cars) ||
    s.players.length < 1 ||
    s.players.length > 6 ||
    s.players.length !== s.cars.length
  )
    return false;
  const ids = new Set();
  for (const p of s.players) {
    if (
      !p ||
      typeof p.id !== "string" ||
      ids.has(p.id) ||
      typeof p.name !== "string" ||
      p.name.length > 18 ||
      !/^#[0-9a-f]{6}$/i.test(p.color)
    )
      return false;
    ids.add(p.id);
  }
  if (
    s.reconnecting.length > s.players.length ||
    new Set(s.reconnecting).size !== s.reconnecting.length ||
    s.reconnecting.some((id) => !ids.has(id))
  )
    return false;
  if (!ids.has(s.host)) return false;
  const cars = new Set();
  for (const c of s.cars) {
    if (
      !c ||
      !ids.has(c.id) ||
      cars.has(c.id) ||
      ![
        c.x,
        c.y,
        c.z,
        c.yaw,
        c.vx,
        c.vz,
        c.speed,
        c.steer,
        c.progress,
        c.impact,
      ].every(Number.isFinite) ||
      Math.abs(c.x) > 10000 ||
      Math.abs(c.z) > 10000 ||
      Math.abs(c.y) > 100 ||
      c.speed < 0 ||
      c.speed > 100 ||
      Math.abs(c.vx) > 100 ||
      Math.abs(c.vz) > 100 ||
      !Number.isInteger(c.passed) ||
      c.passed < 0 ||
      c.passed > 72 ||
      !Number.isSafeInteger(c.respawn) ||
      c.respawn < 0 ||
      !Number.isSafeInteger(c.ack) ||
      c.ack < 0 ||
      !(c.finished === null || (Number.isFinite(c.finished) && c.finished > 0))
    )
      return false;
    cars.add(c.id);
  }
  return true;
}
