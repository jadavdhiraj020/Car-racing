export const TRACK = {
  name: "Palm Circuit",
  width: 22,
  laps: 3,
  maxPlayers: 6,
  segments: 180,
};

// Grand Prix style flowing circuit:
// Long main straight, high-speed sweeping corners, gentle continuous bends,
// wide run-offs, and no sudden sharp kinks.
const knots = [
  { x: 120, z: -140 }, // [0] Final bend exit onto main straight
  { x: 120, z: 0 },    // [1] Start / Finish line (s = 0, yaw = 0)
  { x: 120, z: 120 },  // [2] Main straight mid
  { x: 120, z: 200 },  // [3] Main straight braking zone
  { x: 90, z: 280 },   // [4] Turn 1: sweeping right entry
  { x: 20, z: 330 },   // [5] Turn 2: apex of north sweeper
  { x: -60, z: 320 },  // [6] Turn 2 exit
  { x: -130, z: 250 }, // [7] Flowing left bend
  { x: -160, z: 140 }, // [8] Sector 2 entry
  { x: -110, z: 40 },  // [9] Flowing S-curve right
  { x: -90, z: -50 },  // [10] Flowing S-curve left
  { x: -140, z: -140 },// [11] Back straight transition
  { x: -160, z: -230 },// [12] South sweeper entry
  { x: -100, z: -310 },// [13] South carousel apex (large radius)
  { x: 0, z: -320 },   // [14] South curve exit
  { x: 90, z: -250 },  // [15] Final wide bend entry
];

const N = knots.length;

function getRawPoint(t) {
  t = ((t % N) + N) % N;
  const i = Math.floor(t);
  const u = t - i;
  const p0 = knots[(i - 1 + N) % N];
  const p1 = knots[i];
  const p2 = knots[(i + 1) % N];
  const p3 = knots[(i + 2) % N];
  const u2 = u * u;
  const u3 = u2 * u;

  const x = 0.5 * (
    2 * p1.x +
    (-p0.x + p2.x) * u +
    (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 +
    (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3
  );

  const z = 0.5 * (
    2 * p1.z +
    (-p0.z + p2.z) * u +
    (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * u2 +
    (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * u3
  );

  const dx = 0.5 * (
    (-p0.x + p2.x) +
    2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u +
    3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u2
  );

  const dz = 0.5 * (
    (-p0.z + p2.z) +
    2 * (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * u +
    3 * (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * u2
  );

  const yaw = Math.atan2(dx, dz);
  return { x, z, yaw };
}

// Pre-sample finely starting from t = 1 (where x = 120, z = 0, yaw = 0)
const SAMPLES = 2000;
const rawSamples = [];
for (let i = 0; i <= SAMPLES; i++) {
  const t = 1 + (i * N) / SAMPLES;
  rawSamples.push(getRawPoint(t));
}

const rawLengths = [0];
for (let i = 1; i < rawSamples.length; i++) {
  rawLengths.push(
    rawLengths[i - 1] +
      Math.hypot(rawSamples[i].x - rawSamples[i - 1].x, rawSamples[i].z - rawSamples[i - 1].z),
  );
}
const TOTAL_LENGTH = rawLengths.at(-1);

// Generate uniform arc-length equidistant lookup samples
const UNIFORM_COUNT = 1600;
const samples = [];
for (let i = 0; i <= UNIFORM_COUNT; i++) {
  const targetS = (i * TOTAL_LENGTH) / UNIFORM_COUNT;
  let lo = 0, hi = rawLengths.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (rawLengths[mid] <= targetS) lo = mid;
    else hi = mid;
  }
  const a = rawSamples[lo], b = rawSamples[hi];
  const t = (targetS - rawLengths[lo]) / (rawLengths[hi] - rawLengths[lo] || 1);
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
      Math.hypot(samples[i].x - samples[i - 1].x, samples[i].z - samples[i - 1].z),
  );
}

export const LENGTH = lengths.at(-1);

export function point(s, offset = 0) {
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

export function nearest(x, z) {
  let best = Infinity,
    s = 0;
  for (let i = 0; i < samples.length - 1; i++) {
    const a = samples[i],
      b = samples[i + 1],
      dx = b.x - a.x,
      dz = b.z - a.z;
    const lenSq = dx * dx + dz * dz;
    const t = lenSq > 0 ? Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / lenSq)) : 0;
    const distance = (x - a.x - dx * t) ** 2 + (z - a.z - dz * t) ** 2;
    if (distance < best) {
      best = distance;
      s = lengths[i] + t * (lengths[i + 1] - lengths[i]);
    }
  }
  return { s: s % LENGTH, distance: Math.sqrt(best) };
}

export const gates = Array.from({ length: 24 }, (_, i) =>
  point((i * LENGTH) / 24),
);
