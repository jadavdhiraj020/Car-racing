import { drive } from "../shared/driving.js";
import * as C from "cannon-es";
import { TRACK, LENGTH, point, nearest, gates } from "../shared/track.js";

import { CAR_HALF_WIDTH, CAR_HALF_LENGTH, overlap } from "../shared/contact.js";

export class Race {
  constructor() {
    this.world = new C.World({ gravity: new C.Vec3(0, -18, 0) });
    this.world.defaultContactMaterial.friction = 0;
    this.world.defaultContactMaterial.restitution = 0.06;
    this.world.solver.iterations = 20;
    this.world.solver.tolerance = 0.0001;
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
    this.world.broadphase = new C.SAPBroadphase(this.world);
    this.world.broadphase.axisIndex = 2;
    this.cars = new Map();
  }
  add(id, index) {
    const b = new C.Body({
      mass: 150,
      shape: new C.Box(new C.Vec3(CAR_HALF_WIDTH, 0.45, CAR_HALF_LENGTH)),
      fixedRotation: true,
      linearDamping: 0,
    });
    b.updateMassProperties();
    // Cars, barriers and ground all share authoritative contact resolution.
    b.collisionFilterGroup = 2;
    b.collisionFilterMask = 3;
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
      respawn: 0,
      impact: 0,
    };
    b.addEventListener("collide", (event) => {
      car.impact = Math.max(
        car.impact,
        Math.min(
          1,
          Math.abs(event.contact.getImpactVelocityAlongNormal()) / 18,
        ),
      );
    });
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
    let p = point(s, grid ? (index % 2 ? 3 : -3) : 0);
    let free = false;
    for (let back = 0; back <= 60 && !free; back += 6) {
      for (const lane of [grid ? (index % 2 ? 3 : -3) : 0, -4, 4, -7, 7]) {
        const candidate = point(s - back, lane);
        if (
          [...this.cars.values()].every(
            (other) =>
              other === c ||
              !overlap(
                candidate,
                {
                  x: other.b.position.x,
                  z: other.b.position.z,
                  yaw: other.yaw,
                },
                0.3,
              ),
          )
        ) {
          p = candidate;
          free = true;
          break;
        }
      }
    }
    if (!free) return false;
    c.respawn++;
    c.steer = 0;
    c.input = {};
    c.inputAt = 0;
    c.b.position.set(p.x, 0.55, p.z);
    c.b.velocity.setZero();
    c.b.angularVelocity.setZero();
    c.yaw = p.yaw;
    c.b.quaternion.setFromEuler(0, c.yaw, 0);
    c.previous = { x: p.x, z: p.z };
    return true;
  }
  step(dt, now, running, startAt) {
    for (const c of this.cars.values()) {
      const input =
        running && !c.finished && now - c.inputAt < 500 ? c.input : {};
      if (input.reset && now - c.resetAt > 2000) {
        this.reset(c);
        c.resetAt = now;
      }
      c.impact = (c.impact || 0) * Math.exp(-12 * dt);
      const motion = {
        x: c.b.position.x,
        z: c.b.position.z,
        yaw: c.yaw,
        steer: c.steer,
        vx: c.b.velocity.x,
        vz: c.b.velocity.z,
      };
      drive(motion, input, dt, running && !c.finished);
      c.yaw = motion.yaw;
      c.steer = motion.steer;
      c.b.velocity.x = motion.vx;
      c.b.velocity.z = motion.vz;
      c.b.position.y = 0.55;
      c.b.velocity.y = 0;
      c.ack = c.inputSeq || 0;
      c.b.quaternion.setFromEuler(0, c.yaw, 0);
      c.previous = { x: c.b.position.x, z: c.b.position.z };
    }
    // Two substeps limit high-speed contact penetration and tunnelling.
    this.world.step(dt / 2);
    this.world.step(dt / 2);

    // Multi-pass contact resolution: prevents overlap and exchanges physical impulse
    const bodies = [...this.cars.values()];
    const frames = new Map(
      bodies.map((c) => [c, point(nearest(c.b.position.x, c.b.position.z).s)]),
    );
    for (let pass = 0; pass < 12; pass++) {
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i],
            b = bodies[j];
          const hit = overlap(
            { x: a.b.position.x, z: a.b.position.z, yaw: a.yaw },
            { x: b.b.position.x, z: b.b.position.z, yaw: b.yaw },
            0.02,
          );
          if (!hit) continue;
          const correction = (hit.depth + 0.002) * 0.5;
          a.b.position.x -= hit.x * correction;
          a.b.position.z -= hit.z * correction;
          b.b.position.x += hit.x * correction;
          b.b.position.z += hit.z * correction;
          a.b.aabbNeedsUpdate = b.b.aabbNeedsUpdate = true;

          const closing =
            (b.b.velocity.x - a.b.velocity.x) * hit.x +
            (b.b.velocity.z - a.b.velocity.z) * hit.z;
          if (closing < 0) {
            const impulse = -closing * 0.6;
            a.b.velocity.x -= hit.x * impulse;
            a.b.velocity.z -= hit.z * impulse;
            b.b.velocity.x += hit.x * impulse;
            b.b.velocity.z += hit.z * impulse;
            const impactMag = Math.min(
              1,
              Math.abs(closing) / 10 + hit.depth * 1.5,
            );
            a.impact = Math.max(a.impact, impactMag);
            b.impact = Math.max(b.impact, impactMag);
          }
        }
      }
      // Project against the road edge as part of the same contact solve, so a pile-up cannot push a car through a barrier.
      for (const c of bodies) {
        const frame = frames.get(c),
          nx = Math.cos(frame.yaw),
          nz = -Math.sin(frame.yaw);
        const offset =
          (c.b.position.x - frame.x) * nx + (c.b.position.z - frame.z) * nz;
        const relative = c.yaw - frame.yaw;
        const extent =
          CAR_HALF_WIDTH * Math.abs(Math.cos(relative)) +
          CAR_HALF_LENGTH * Math.abs(Math.sin(relative));
        const limit = TRACK.width / 2 - extent - 0.025;
        if (Math.abs(offset) > limit) {
          const excess = offset - Math.sign(offset) * limit;
          c.b.position.x -= nx * excess;
          c.b.position.z -= nz * excess;
          c.b.aabbNeedsUpdate = true;
          const outward =
            (c.b.velocity.x * nx + c.b.velocity.z * nz) * Math.sign(offset);
          if (outward > 0) {
            c.impact = Math.max(c.impact, Math.min(1, outward / 18));
            c.b.velocity.x -= nx * outward * Math.sign(offset);
            c.b.velocity.z -= nz * outward * Math.sign(offset);
          }
        }
      }
    }
    for (const c of this.cars.values()) {
      c.b.position.y = 0.55;
      c.b.velocity.y = 0;
      if (running && !c.finished) this.progress(c, now, startAt, dt);
      c.impact *= Math.exp(-6 * dt);
      if (nearest(c.b.position.x, c.b.position.z).distance > 45)
        this.reset(c);
    }
  }
  progress(c, now, startAt, dt = 0) {
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
      if (c.passed === 24 * TRACK.laps)
        c.finished = Math.max(
          0.001,
          now - startAt - dt * 1000 * (1 - -before / (after - before)),
        );
    }
  }
  snapshot() {
    return [...this.cars.values()].map((c) => ({
      id: c.id,
      ack: c.ack || 0,
      x: c.b.position.x,
      y: c.b.position.y,
      z: c.b.position.z,
      yaw: c.yaw,
      vx: c.b.velocity.x,
      vz: c.b.velocity.z,
      respawn: c.respawn,
      impact: c.impact,
      throttle: c.input.up === true,
      braking: c.input.down === true,
      drift: c.input.drift === true,
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
