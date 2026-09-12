export const TRACK = {
  name: "Palm Circuit",
  width: 18,
  laps: 3,
  maxPlayers: 6,
  segments: 120,
};
// A stadium loop: long straights connected by semicircles. Travel clockwise.
export const LENGTH = 160 + 2 * Math.PI * 48;
export function point(s, offset = 0) {
  s = ((s % LENGTH) + LENGTH) % LENGTH;
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
    x = -48;
    z = 40 - (s - 80 - Math.PI * 48);
    yaw = -Math.PI;
  } else {
    const a = (s - 160 - Math.PI * 48) / 48;
    x = -48 * Math.cos(a);
    z = -40 - 48 * Math.sin(a);
    yaw = -Math.PI - a;
  }
  return { x: x + Math.cos(yaw) * offset, z: z - Math.sin(yaw) * offset, yaw };
}
export function nearest(x, z) {
  let s;
  if (z > 40) {
    let a = Math.atan2(z - 40, x);
    s = 80 + 48 * a;
  } else if (z < -40) {
    let a = Math.atan2(-z - 40, -x);
    s = 160 + Math.PI * 48 + 48 * a;
  } else s = x >= 0 ? z + 40 : 80 + Math.PI * 48 + 40 - z;
  const p = point(s);
  return { s, distance: Math.hypot(x - p.x, z - p.z) };
}
export const gates = Array.from({ length: 24 }, (_, i) =>
  point((i * LENGTH) / 24),
);
