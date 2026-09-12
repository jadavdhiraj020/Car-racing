import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { TRACK, LENGTH, point, gates } from "../../shared/track.js";
export function createScene(canvas) {
  const engine = new Engine(canvas, true, {
    stencil: false,
    preserveDrawingBuffer: true,
  });
  engine.setHardwareScalingLevel(1.5);
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.64, 0.79, 0.74, 1);
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.0018;
  scene.fogColor = new Color3(0.64, 0.79, 0.74);
  new HemisphericLight("sky", new Vector3(0, 1, 0), scene).intensity = 0.65;
  const sun = new DirectionalLight("sun", new Vector3(-0.5, -1, 0.3), scene);
  sun.intensity = 0.7;
  const camera = new FreeCamera("camera", new Vector3(145, 105, -130), scene);
  camera.setTarget(new Vector3(10, 0, 0));
  camera.minZ = 0.1;
  camera.maxZ = 900;
  camera.fov = 0.85;
  function material(name, color) {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.FromHexString(color);
    m.specularColor = new Color3(0.15, 0.15, 0.15);
    return m;
  }
  const grass = material("sage grass", "#62846c"),
    road = material("warm asphalt", "#414d4d"),
    cream = material("ivory", "#ece8ca"),
    lime = material("acid yellow", "#d6fc71"),
    red = material("coral", "#df6b53"),
    dark = material("rubber", "#182525"),
    glass = material("smoked windows", "#275058"),
    bark = material("palm trunks", "#81735b"),
    leaf = material("palm fronds", "#376d51");
  function box(name, w, h, d, x, y, z, m, yaw = 0, parent) {
    const mesh = MeshBuilder.CreateBox(
      name,
      { width: w, height: h, depth: d },
      scene,
    );
    mesh.position.set(x, y, z);
    mesh.rotation.y = yaw;
    mesh.material = m;
    if (parent) mesh.parent = parent;
    return mesh;
  }
  box("island", 450, 0.5, 450, 0, -0.35, 0, grass);
  const edges = [-9, 9].map((offset) =>
    Array.from({ length: TRACK.segments + 1 }, (_, i) => {
      const p = point((i * LENGTH) / TRACK.segments, offset);
      return new Vector3(p.x, 0.08, p.z);
    }),
  );
  const surface = MeshBuilder.CreateRibbon(
    "road",
    { pathArray: edges, sideOrientation: 2 },
    scene,
  );
  surface.material = road;
  for (let i = 0; i < TRACK.segments; i++) {
    const p = point(((i + 0.5) * LENGTH) / TRACK.segments),
      len = LENGTH / TRACK.segments;

    for (const side of [-1, 1]) {
      const edge = point((i + 0.5) * len, side * 8.6),
        wall = point((i + 0.5) * len, side * 9.5);
      box(
        "curb",
        0.75,
        0.16,
        Math.hypot(
          point((i + 1) * len, side * 8.6).x - point(i * len, side * 8.6).x,
          point((i + 1) * len, side * 8.6).z - point(i * len, side * 8.6).z,
        ) * 0.998,
        edge.x,
        0.08,
        edge.z,
        i % 2 ? cream : red,
        p.yaw,
      );
      box(
        "barrier",
        1,
        1.4,
        Math.hypot(
          point((i + 1) * len, side * 9.5).x - point(i * len, side * 9.5).x,
          point((i + 1) * len, side * 9.5).z - point(i * len, side * 9.5).z,
        ) * 0.998,
        wall.x,
        0.7,
        wall.z,
        i % 6 < 3 ? cream : dark,
        p.yaw,
      );
    }
    if (i % 3 === 0)
      box("lane stripe", 0.16, 0.03, 1.5, p.x, 0.1, p.z, cream, p.yaw);
  }
  for (let i = 0; i < 12; i++) {
    const p = point(0, -8.25 + i * 1.5);
    for (let j = 0; j < 2; j++)
      box(
        "finish checker",
        1.5,
        0.04,
        1.4,
        p.x,
        0.13,
        p.z + j * 1.4,
        (i + j) % 2 ? dark : cream,
      );
  }
  box("gantry left", 0.7, 8, 0.7, 37, 4, 0, dark);
  box("gantry right", 0.7, 8, 0.7, 59, 4, 0, dark);
  box("start arch", 23, 2, 0.7, 48, 8, 0, lime);
  function sign(text, x, y, z, width = 16, height = 4, yaw = 0) {
    const tex = new DynamicTexture("sign", { width: 1024, height: 256 }, scene);
    tex.drawText(
      text,
      null,
      175,
      "bold 125px sans-serif",
      "#d6fc71",
      "#152b22",
      true,
    );
    const mat = material("sign material", "#ffffff");
    mat.diffuseTexture = tex;
    mat.emissiveColor = new Color3(0.2, 0.2, 0.2);
    const s = MeshBuilder.CreatePlane(
      "sign",
      { width, height, sideOrientation: 2 },
      scene,
    );
    s.position.set(x, y, z);
    s.rotation.y = yaw;
    s.material = mat;
    return s;
  }
  sign("APEX  /  START", 48, 8, -0.4, 20, 1.65);
  const gateMeshes = gates.map((p, i) => {
    const root = new TransformNode("checkpoint " + i, scene);
    for (const offset of [-7.8, 7.8])
      box("checkpoint post", 0.2, 3, 0.2, offset, 1.5, 0, lime, 0, root);
    root.position.set(p.x, 0, p.z);
    root.rotation.y = p.yaw;
    return root;
  });
  for (let i = 0; i < 12; i++) {
    const p = point((i * LENGTH) / 12 + 10);
    const arrow = sign("↑", p.x, 0.18, p.z, 2, 3, p.yaw);
    arrow.rotation.x = Math.PI / 2;
  }
  function palm(x, z, size = 1) {
    const trunk = MeshBuilder.CreateCylinder(
      "palm",
      {
        height: 7 * size,
        diameterTop: 0.35,
        diameterBottom: 0.6,
        tessellation: 7,
      },
      scene,
    );
    trunk.position.set(x, 3.5 * size, z);
    trunk.material = bark;
    for (let a = 0; a < 5; a++) {
      const frond = MeshBuilder.CreateSphere(
        "frond",
        { diameter: 1, segments: 5 },
        scene,
      );
      frond.scaling.set(1.4 * size, 0.35 * size, 5 * size);
      frond.rotation.y = (a * Math.PI * 2) / 5;
      frond.position.set(
        x + Math.sin(frond.rotation.y) * 1.7 * size,
        7 * size,
        z + Math.cos(frond.rotation.y) * 1.7 * size,
      );
      frond.material = leaf;
    }
  }
  for (let i = 0; i < 28; i++) {
    const p = point((i * LENGTH) / 28, 18 + (i % 3) * 6);
    palm(p.x, p.z, 0.9 + (i % 4) * 0.15);
  }
  for (let i = 0; i < 6; i++) palm(-17 + i * 7, 20 + (i % 2) * 15, 1.2);
  box("clubhouse", 23, 8, 13, -12, 4, -15, cream);
  box("club roof", 26, 0.7, 16, -12, 8.3, -15, red);
  box("club windows", 21, 3, 0.1, -12, 5, -21.55, glass);
  sign("PALM CLUB", -12, 9.8, -22, 19, 3);
  for (let i = 0; i < 4; i++)
    box(
      "grandstand",
      9,
      1 + i,
      30,
      -72,
      0.5 + i / 2,
      -10,
      i % 2 ? cream : dark,
    );
  const water = material("lagoon", "#599ca0");
  box("lagoon", 420, 0.1, 420, 0, -0.65, 0, water);
  const cars = new Map();
  function car(player) {
    const root = new TransformNode(player.id, scene),
      paint = material(player.id, player.color);
    box("body", 1.9, 0.65, 3.7, 0, 0.25, 0, paint, 0, root);
    box("hood", 1.8, 0.25, 1.3, 0, 0.62, 1, paint, 0, root);
    box("cabin", 1.5, 0.65, 1.65, 0, 0.86, -0.25, glass, 0, root);
    box("roof", 1.6, 0.12, 1.1, 0, 1.2, -0.35, paint, 0, root);
    box("spoiler", 2.15, 0.12, 0.35, 0, 0.9, -1.65, dark, 0, root);
    for (const x of [-0.63, 0.63]) {
      box("headlight", 0.48, 0.18, 0.06, x, 0.44, 1.88, cream, 0, root);
      box("taillight", 0.48, 0.15, 0.06, x, 0.43, -1.88, red, 0, root);
    }
    const wheels = [];
    for (const x of [-1, 1])
      for (const z of [-1.15, 1.15]) {
        const pivot = new TransformNode("wheel pivot", scene);
        pivot.parent = root;
        pivot.position.set(x, -0.05, z);
        const axle = new TransformNode("spinning axle", scene);
        axle.parent = pivot;
        const wheel = MeshBuilder.CreateCylinder(
          "wheel",
          { diameter: 0.72, height: 0.35, tessellation: 12 },
          scene,
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.parent = axle;
        wheel.material = dark;
        box("wheel spoke", 0.03, 0.48, 0.1, x * 0.18, 0, 0, cream, 0, axle);
        box("wheel spoke", 0.03, 0.1, 0.48, x * 0.18, 0, 0, cream, 0, axle);
        wheels.push({ pivot, wheel: axle, front: z > 0 });
      }
    const label = sign(player.name, 0, 2.5, 0, 3.5, 0.85);
    label.parent = root;
    label.billboardMode = 7;
    const result = {
      root,
      wheels,
      target: null,
      dispose: () => {
        root.dispose();
        paint.dispose();
        label.material.dispose(false, true);
      },
    };
    cars.set(player.id, result);
    return result;
  }
  let targets = [],
    me = null,
    racing = false,
    last = performance.now();
  function update(state, id) {
    targets = state.cars;
    me = id;
    racing = ["countdown", "racing", "results"].includes(state.phase);
    for (const p of state.players) if (!cars.has(p.id)) car(p);
    for (const [id, c] of cars)
      if (!state.players.some((p) => p.id === id)) {
        c.dispose();
        cars.delete(id);
      }
    for (const t of targets) {
      const c = cars.get(t.id);
      if (c && !c.target) c.root.position.set(t.x, t.y, t.z);
      if (c) c.target = t;
    }
    const mine = targets.find((c) => c.id === me);
    gateMeshes.forEach((g, i) =>
      g.setEnabled(!!mine && i === (mine.passed + 1) % 24),
    );
  }
  engine.runRenderLoop(() => {
    const now = performance.now(),
      dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    for (const c of cars.values()) {
      const t = c.target;
      if (!t) continue;
      const alpha = 1 - Math.exp(-14 * dt);
      const dest = new Vector3(t.x, t.y, t.z);
      if (Vector3.Distance(c.root.position, dest) > 12)
        c.root.position.copyFrom(dest);
      else c.root.position = Vector3.Lerp(c.root.position, dest, alpha);
      const d = Math.atan2(
        Math.sin(t.yaw - c.root.rotation.y),
        Math.cos(t.yaw - c.root.rotation.y),
      );
      c.root.rotation.y += d * alpha;
      for (const w of c.wheels) {
        w.wheel.rotation.x += (t.speed * dt) / 0.36;
        w.pivot.rotation.y = w.front ? t.steer * 0.35 : 0;
      }
    }
    const mine = cars.get(me);
    if (racing && mine) {
      const p = mine.root.position,
        yaw = mine.root.rotation.y;
      const desired = new Vector3(
        p.x - Math.sin(yaw) * 12,
        p.y + 6,
        p.z - Math.cos(yaw) * 12,
      );
      camera.position = Vector3.Lerp(
        camera.position,
        desired,
        1 - Math.exp(-5 * dt),
      );
      camera.setTarget(
        new Vector3(p.x + Math.sin(yaw) * 5, p.y + 1, p.z + Math.cos(yaw) * 5),
      );
    } else {
      const t = now * 0.000025;
      camera.position.set(130 + Math.sin(t) * 15, 100, -110 + Math.cos(t) * 15);
      camera.setTarget(new Vector3(7, 0, 4));
    }
    scene.render();
  });
  window.addEventListener("resize", () => engine.resize());
  return {
    update,
    quality: (level) => engine.setHardwareScalingLevel([2, 1.5, 1][level]),
    scene,
  };
}
