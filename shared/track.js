// Each room owns a circuit; there is no mutable global active-track state.
const definitions = [
  { id: "palm", name: "Palm Grand Prix", rx: 120, rz: 330, sway: 0, width: 24 },
  { id: "azure", name: "Azure Coast", rx: 165, rz: 300, sway: 18, width: 25 },
  { id: "ember", name: "Ember Valley", rx: 145, rz: 380, sway: -16, width: 26 },
  {
    id: "aurora",
    name: "Aurora Speedway",
    rx: 195,
    rz: 260,
    sway: 12,
    width: 26,
  },
];
function buildTrack(config) {
  const { rx, rz, sway } = config;
  // Analytic closed curves have continuous tangents and curvature at the seam.
  // Gentle lateral shaping creates distinct flowing ovals without angular turns.
  function getRawPoint(t) {
    const x = rx * Math.cos(t) + sway * (Math.cos(2 * t) - 1);
    const z = rz * Math.sin(t);
    const dx = -rx * Math.sin(t) - 2 * sway * Math.sin(2 * t);
    const dz = rz * Math.cos(t);
    return { x, z, yaw: Math.atan2(dx, dz) };
  }
  // Arc-length lookup keeps geometry, checkpoints and barrier spacing consistent.
  const SAMPLES = 2000;
  const rawSamples = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = (i * Math.PI * 2) / SAMPLES;
    rawSamples.push(getRawPoint(t));
  }

  const rawLengths = [0];
  for (let i = 1; i < rawSamples.length; i++) {
    rawLengths.push(
      rawLengths[i - 1] +
        Math.hypot(
          rawSamples[i].x - rawSamples[i - 1].x,
          rawSamples[i].z - rawSamples[i - 1].z,
        ),
    );
  }
  const TOTAL_LENGTH = rawLengths.at(-1);

  // Generate uniform arc-length equidistant lookup samples
  const UNIFORM_COUNT = 1600;
  const samples = [];
  for (let i = 0; i <= UNIFORM_COUNT; i++) {
    const targetS = (i * TOTAL_LENGTH) / UNIFORM_COUNT;
    let lo = 0,
      hi = rawLengths.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (rawLengths[mid] <= targetS) lo = mid;
      else hi = mid;
    }
    const a = rawSamples[lo],
      b = rawSamples[hi];
    const t =
      (targetS - rawLengths[lo]) / (rawLengths[hi] - rawLengths[lo] || 1);
    const delta = Math.atan2(Math.sin(b.yaw - a.yaw), Math.cos(b.yaw - a.yaw));
    samples.push({
      x: a.x + (b.x - a.x) * t,
      z: a.z + (b.z - a.z) * t,
      yaw: a.yaw + delta * t,
    });
  }

  const lengths = [0];
  for (let i = 1; i < samples.length; i++) {
    lengths.push(
      lengths[i - 1] +
        Math.hypot(
          samples[i].x - samples[i - 1].x,
          samples[i].z - samples[i - 1].z,
        ),
    );
  }

  const LENGTH = lengths.at(-1);

  function point(s, offset = 0) {
    s = ((s % LENGTH) + LENGTH) % LENGTH;
    let lo = 0,
      hi = lengths.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (lengths[mid] <= s) lo = mid;
      else hi = mid;
    }
    const a = samples[lo],
      b = samples[hi],
      t = (s - lengths[lo]) / (lengths[hi] - lengths[lo] || 1);
    const delta = Math.atan2(Math.sin(b.yaw - a.yaw), Math.cos(b.yaw - a.yaw)),
      yaw = a.yaw + delta * t;
    return {
      x: a.x + (b.x - a.x) * t + Math.cos(yaw) * offset,
      z: a.z + (b.z - a.z) * t - Math.sin(yaw) * offset,
      yaw,
    };
  }

  // Exact spatial rejection: skip segment blocks whose bounds cannot beat the best hit.
  const blocks = [];
  for (let start = 0; start < samples.length - 1; start += 24) {
    const end = Math.min(samples.length - 1, start + 24);
    let minX = Infinity,
      maxX = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity;
    for (let i = start; i <= end; i++) {
      const p = samples[i];
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minZ = Math.min(minZ, p.z);
      maxZ = Math.max(maxZ, p.z);
    }
    blocks.push({ start, end, minX, maxX, minZ, maxZ });
  }
  function nearest(x, z) {
    let best = Infinity,
      s = 0;
    for (const block of blocks) {
      const bx = Math.max(block.minX - x, 0, x - block.maxX),
        bz = Math.max(block.minZ - z, 0, z - block.maxZ);
      if (bx * bx + bz * bz > best) continue;
      for (let i = block.start; i < block.end; i++) {
        const a = samples[i],
          b = samples[i + 1],
          dx = b.x - a.x,
          dz = b.z - a.z;
        const lenSq = dx * dx + dz * dz;
        const t =
          lenSq > 0
            ? Math.max(
                0,
                Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / lenSq),
              )
            : 0;
        const distance = (x - a.x - dx * t) ** 2 + (z - a.z - dz * t) ** 2;
        if (distance < best) {
          best = distance;
          s = lengths[i] + t * (lengths[i + 1] - lengths[i]);
        }
      }
    }
    return { s: s % LENGTH, distance: Math.sqrt(best) };
  }

  const gates = Array.from({ length: 24 }, (_, i) => point((i * LENGTH) / 24));

  const padding = config.width / 2 + 15;
  const bounds = Object.freeze({
    minX: Math.min(...samples.map((p) => p.x)) - padding,
    maxX: Math.max(...samples.map((p) => p.x)) + padding,
    minZ: Math.min(...samples.map((p) => p.z)) - padding,
    maxZ: Math.max(...samples.map((p) => p.z)) + padding,
  });
  return Object.freeze({
    id: config.id,
    name: config.name,
    width: config.width,
    laps: 3,
    maxPlayers: 6,
    segments: 240,
    length: LENGTH,
    point,
    nearest,
    gates: Object.freeze(gates.map(Object.freeze)),
    bounds,
  });
}
export const TRACKS = Object.freeze(definitions.map(buildTrack));
export function getTrack(id = "palm") {
  return TRACKS.find((track) => track.id === id) || TRACKS[0];
}
// Compatibility exports are permanently bound to the default circuit.
export const TRACK = TRACKS[0];
export const LENGTH = TRACK.length;
export const point = TRACK.point;
export const nearest = TRACK.nearest;
export const gates = TRACK.gates;
