import * as C from "cannon-es";
import { TRACK, LENGTH, point, nearest, gates } from "../shared/track.js";

export class Race {
  constructor() {
    this.world = new C.World({ gravity: new C.Vec3(0, -18, 0) });
    this.world.defaultContactMaterial.friction = 0;
    const ground = new C.Body({ mass: 0, shape: new C.Plane() });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.addBody(ground);
    for (let i = 0; i < TRACK.segments; i++)
      for (const side of [-1, 1]) {
        const p = point(
          ((i + 0.5) * LENGTH) / TRACK.segments,
          side * (TRACK.width / 2 + 0.5),
        );
        const b = new C.Body({
          mass: 0,
          shape: new C.Box(
            new C.Vec3(0.5, 1.2, (LENGTH / TRACK.segments) * 0.57),
          ),
          position: new C.Vec3(p.x, 1, p.z),
        });
        b.quaternion.setFromEuler(0, p.yaw, 0);
        this.world.addBody(b);
      }
    this.cars = new Map();
  }
  add(id, index) {
    const b = new C.Body({
      mass: 150,
      shape: new C.Box(new C.Vec3(0.9, 0.45, 1.8)),
      fixedRotation: true,
      linearDamping: 0,
    });
    b.updateMassProperties();
    // Ghost opponents prevent griefing; barriers and ground remain physical.
    b.collisionFilterGroup = 2;
    b.collisionFilterMask = 1;
    const car = {
      id,
      b,
      yaw: 0,
      steer: 0,
      input: {},
      inputAt: 0,
      passed: 0,
      finished: null,
      resetAt: 0,
    };
    this.cars.set(id, car);
    this.world.addBody(b);
    this.reset(car, true, index);
    return car;
  }
  remove(id) {
    const c = this.cars.get(id);
    if (c) this.world.removeBody(c.b);
    this.cars.delete(id);
  }
  reset(c, grid = false, index = 0) {
    const s = grid ? -8 - Math.floor(index / 2) * 7 : (c.passed * LENGTH) / 24;
    const p = point(s, grid ? (index % 2 ? 3 : -3) : 0);
    c.b.position.set(p.x, 0.55, p.z);
    c.b.velocity.setZero();
    c.b.angularVelocity.setZero();
    c.yaw = p.yaw;
    c.b.quaternion.setFromEuler(0, c.yaw, 0);
    c.previous = { x: p.x, z: p.z };
  }
  step(dt, now, running, startAt) {
    for (const c of this.cars.values()) {
      const input =
        running && !c.finished && now - c.inputAt < 500 ? c.input : {};
      if (input.reset && now - c.resetAt > 2000) {
        this.reset(c);
        c.resetAt = now;
      }
      const f = { x: Math.sin(c.yaw), z: Math.cos(c.yaw) },
        v = c.b.velocity;
      let speed = v.x * f.x + v.z * f.z;
      const lateral = v.x * f.z - v.z * f.x;

      // Smooth, progressive steering response (eliminates jerky keyboard snaps)
      const targetSteer = (input.left ? -1 : 0) + (input.right ? 1 : 0);
      c.steer += (targetSteer - c.steer) * (1 - Math.exp(-14 * dt));

      // Acceleration and Braking
      if (input.up) {
        const punch = 26 - Math.max(0, speed / 50) * 10;
        speed += punch * dt;
      } else if (input.down) {
        if (speed > 1) speed -= 36 * dt; // Decisive braking
        else speed -= 16 * dt; // Smooth reverse
      } else {
        speed *= Math.exp(-0.4 * dt); // Natural rolling drag
      }

      // Aerodynamic drag and speed clamping
      speed *= Math.exp(-(input.drift ? 0.55 : 0.18) * dt);
      speed = Math.max(-12, Math.min(50, speed));
      if (!running || c.finished) speed *= Math.exp(-8 * dt);

      // Speed-sensitive steering: responsive at low speeds, stable at high speeds
      const speedFactor = Math.min(Math.abs(speed) / 8, 1);
      const stability = 1 / (1 + Math.max(0, (Math.abs(speed) - 15) / 35) ** 0.8);
      const turnAuthority = input.drift ? 2.2 : 1.45 * stability;
      c.yaw += c.steer * Math.sign(speed || 1) * speedFactor * turnAuthority * dt;

      // Lateral tire grip / controlled drift slip
      const slipDamping = input.drift ? 2.2 : 11;
      const slip = lateral * Math.exp(-slipDamping * dt);

      // Off-road grass friction (slight drag outside the asphalt road)
      const distFromCenter = nearest(c.b.position.x, c.b.position.z).distance;
      if (distFromCenter > TRACK.width / 2) {
        speed *= Math.exp(-1.4 * dt);
      }

      v.x = Math.sin(c.yaw) * speed + Math.cos(c.yaw) * slip;
      v.z = Math.cos(c.yaw) * speed - Math.sin(c.yaw) * slip;
      c.b.quaternion.setFromEuler(0, c.yaw, 0);
      c.previous = { x: c.b.position.x, z: c.b.position.z };
    }
    this.world.step(dt);
    for (const c of this.cars.values()) {
      if (running && !c.finished) this.progress(c, now, startAt);
      if (
        c.b.position.y < -5 ||
        nearest(c.b.position.x, c.b.position.z).distance > 45
      )
        this.reset(c);
    }
  }
  progress(c, now, startAt) {
    const next = (c.passed + 1) % 24,
      g = gates[next],
      p = c.b.position,
      old = c.previous;
    const before =
      (old.x - g.x) * Math.sin(g.yaw) + (old.z - g.z) * Math.cos(g.yaw);
    const after = (p.x - g.x) * Math.sin(g.yaw) + (p.z - g.z) * Math.cos(g.yaw);
    const across = Math.abs(
      (p.x - g.x) * Math.cos(g.yaw) - (p.z - g.z) * Math.sin(g.yaw),
    );
    if (before <= 0 && after > 0 && across < TRACK.width / 2 + 2) {
      c.passed++;
      if (c.passed === 24 * TRACK.laps) c.finished = now - startAt;
    }
  }
  snapshot() {
    return [...this.cars.values()].map((c) => ({
      id: c.id,
      x: c.b.position.x,
      y: c.b.position.y,
      z: c.b.position.z,
      yaw: c.yaw,
      speed: Math.hypot(c.b.velocity.x, c.b.velocity.z),
      steer: c.steer,
      passed: c.passed,
      finished: c.finished,
      progress:
        c.passed +
        Math.min(
          0.99,
          Math.max(
            -1,
            (((((nearest(c.b.position.x, c.b.position.z).s -
              ((c.passed % 24) * LENGTH) / 24 +
              LENGTH / 2) %
              LENGTH) +
              LENGTH) %
              LENGTH) -
              LENGTH / 2) /
              (LENGTH / 24),
          ),
        ),
    }));
  }
}
