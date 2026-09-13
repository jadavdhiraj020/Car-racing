import { TRACK, nearest } from "./track.js";
// Shared kinematic controller: authoritative server and bounded client prediction.
export function drive(c, input, dt, active = true) {
  if (!Number.isFinite(c.yaw)) c.yaw = 0;
  if (!Number.isFinite(c.steer)) c.steer = 0;
  if (!Number.isFinite(c.vx)) c.vx = 0;
  if (!Number.isFinite(c.vz)) c.vz = 0;

  const f = { x: Math.sin(c.yaw), z: Math.cos(c.yaw) },
    v = { x: c.vx, z: c.vz };
  let speed = v.x * f.x + v.z * f.z;
  const lateral = v.x * f.z - v.z * f.x;

  // Smooth, progressive steering response: snappy turn-in with zero twitch
  const targetSteer = (input.left ? -1 : 0) + (input.right ? 1 : 0);
  c.steer += (targetSteer - c.steer) * (1 - Math.exp(-28 * dt));
  c.steer = Math.max(-1, Math.min(1, c.steer));

  // Acceleration and Braking with dynamic power delivery
  if (input.up && !input.down) {
    const punch = 28 - Math.max(0, speed / 50) * 11.5;
    speed += punch * dt;
  } else if (input.down) {
    if (speed > 1)
      speed -= 38 * dt; // Decisive braking
    else speed -= 18 * dt; // Smooth reverse
  } else {
    speed *= Math.exp(-0.45 * dt); // Natural rolling drag
  }

  // Aerodynamic drag and speed clamping
  speed *= Math.exp(-(input.drift ? 0.55 : 0.18) * dt);
  speed = Math.max(-12, Math.min(50, speed));
  if (!active) speed *= Math.exp(-8 * dt);

  // Speed-sensitive steering with weight transfer dynamics
  const accelRate = (input.up ? 1 : 0) - (input.down ? 1 : 0);
  const weightTransfer = Math.max(-0.2, Math.min(0.3, -accelRate * 0.15));
  const frontGrip = 1.0 + weightTransfer;
  const speedFactor = Math.min(Math.abs(speed) / 7.5, 1);
  const stability = 1 / (1 + Math.max(0, Math.abs(speed) - 16) / 54);
  const turnAuthority = input.drift ? 2.22 : 1.5 * stability * frontGrip;
  const previousYaw = c.yaw;
  c.yaw += c.steer * Math.sign(speed || 1) * speedFactor * turnAuthority * dt;

  // Lateral tire grip / controlled drift slip
  const slipDamping = input.drift ? 2.2 : 11.5;
  const slip =
    (lateral - (input.drift ? speed * Math.sin(c.yaw - previousYaw) : 0)) *
    Math.exp(-slipDamping * dt);

  // Off-road grass friction (slight drag outside the asphalt road)
  if (Number.isFinite(c.x) && Number.isFinite(c.z)) {
    const distFromCenter = nearest(c.x, c.z).distance;
    if (distFromCenter > TRACK.width / 2) {
      speed *= Math.exp(-1.4 * dt);
    }
  }

  v.x = Math.sin(c.yaw) * speed + Math.cos(c.yaw) * slip;
  v.z = Math.cos(c.yaw) * speed - Math.sin(c.yaw) * slip;

  c.vx = Number.isFinite(v.x) ? v.x : 0;
  c.vz = Number.isFinite(v.z) ? v.z : 0;
}
export function predict(c, input, dt) {
  drive(c, input, dt);
  if (Number.isFinite(c.vx) && Number.isFinite(c.vz)) {
    c.x += c.vx * dt;
    c.z += c.vz * dt;
  }
}
