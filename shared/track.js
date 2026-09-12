export const TRACK = {
  name: "Palm Circuit",
  width: 18,
  laps: 3,
  maxPlayers: 6,
  segments: 180,
};
// Long start straight, broad sweepers, and a tighter left/right chicane.
const BASE_LENGTH = 160 + 2 * Math.PI * 48;
function basePoint(s, offset = 0) {
  s = ((s % BASE_LENGTH) + BASE_LENGTH) % BASE_LENGTH;
  let x, z, yaw;
  if (s < 80) {
    x = 48;
    z = -40 + s;
    yaw = 0;
  } else if (s < 80 + Math.PI * 48) {
    const a = (s - 80) / 48;
    x = 48 * Math.cos(a);
    z = 40 + 48 * Math.sin(a);
    yaw = -a;
  } else if (s < 160 + Math.PI * 48) {
    const t = (s - 80 - Math.PI * 48) / 80;
    x = -48 + 9 * Math.sin(2 * Math.PI * t) ** 3;
    z = 40 - 80 * t;
    yaw = Math.atan2(
      54 * Math.PI * Math.sin(2 * Math.PI * t) ** 2 * Math.cos(2 * Math.PI * t),
      -80,
    );
  } else {
    const a = (s - 160 - Math.PI * 48) / 48;
    x = -48 * Math.cos(a);
    z = -40 - 48 * Math.sin(a);
    yaw = -Math.PI - a;
  }
  return { x: x + Math.cos(yaw) * offset, z: z - Math.sin(yaw) * offset, yaw };
}

// Arc-length lookup keeps checkpoint spacing and progress consistent through the chicane.
const samples = Array.from({ length: 961 }, (_, i) =>
  basePoint((i * BASE_LENGTH) / 960),
);
const lengths = [0];
for (let i = 1; i < samples.length; i++)
  lengths.push(
    lengths[i - 1] +
      Math.hypot(
        samples[i].x - samples[i - 1].x,
        samples[i].z - samples[i - 1].z,
      ),
  );
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
    t = (s - lengths[lo]) / (lengths[hi] - lengths[lo]);
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
    const t = Math.max(
      0,
      Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz)),
    );
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
