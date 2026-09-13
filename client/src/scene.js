import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { predict } from "../../shared/driving.js";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Matrix } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator.js";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { TRACK, LENGTH, point, gates, nearest } from "../../shared/track.js";

import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { RawCubeTexture } from "@babylonjs/core/Materials/Textures/rawCubeTexture";
import { overlap } from "../../shared/contact.js";
export function createScene(canvas, audioSystem = null) {
  const engine = new Engine(canvas, true, {
    stencil: false,
    preserveDrawingBuffer: false,
  });
  engine.setHardwareScalingLevel(1.5);

  const scene = new Scene(engine);
  // Atmospheric haze and clear sky
  scene.clearColor = new Color4(0.58, 0.77, 0.74, 1);
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.0012;
  scene.fogColor = new Color3(0.58, 0.77, 0.74);

  // Balanced hemispheric and directional lighting
  const skyLight = new HemisphericLight("sky", new Vector3(0, 1, 0), scene);
  skyLight.intensity = 0.75;
  skyLight.groundColor = new Color3(0.35, 0.45, 0.38);

  const sun = new DirectionalLight("sun", new Vector3(-0.6, -1.2, 0.5), scene);
  sun.position = new Vector3(120, 200, -100);
  sun.intensity = 0.95;

  let shadowGen = null;
  const glRenderer = engine.getGlInfo()?.renderer || "";
  const isSoftware = /swiftshader|llvmpipe/i.test(glRenderer);
  if (!isSoftware) {
    try {
      shadowGen = new ShadowGenerator(1024, sun);
      shadowGen.bias = 0.003;
      shadowGen.normalBias = 0.002;
    } catch (e) {
      console.warn("Shadows initialized in fallback mode", e);
    }
  }

  const camera = new FreeCamera("camera", new Vector3(180, 110, -150), scene);
  camera.setTarget(new Vector3(120, 0, 0));
  camera.minZ = 0.2;
  camera.maxZ = 1600;
  camera.fov = 0.82;

  function material(name, hex, spec = 0.15, emissiveHex = null) {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.FromHexString(hex);
    m.specularColor = new Color3(spec, spec, spec);
    if (emissiveHex) m.emissiveColor = Color3.FromHexString(emissiveHex);
    return m;
  }

  // A small, generated studio/sky cubemap gives paint and glass real view-dependent reflections.
  const faces = Array.from({ length: 6 }, (_, face) => {
    const data = new Uint8Array(64 * 64 * 4);
    for (let y = 0; y < 64; y++)
      for (let x = 0; x < 64; x++) {
        const sky = face === 2 ? 1 : face === 3 ? 0 : 1 - y / 63;
        const highlight =
          Math.exp(-((x - 40) ** 2 / 75 + (y - 20) ** 2 / 12)) * 0.7;
        const i = (y * 64 + x) * 4;
        data[i] = Math.min(255, 45 + sky * 115 + highlight * 100);
        data[i + 1] = Math.min(255, 60 + sky * 130 + highlight * 100);
        data[i + 2] = Math.min(255, 62 + sky * 150 + highlight * 100);
        data[i + 3] = 255;
      }
    return data;
  });
  const environment = new RawCubeTexture(
    scene,
    faces,
    64,
    5,
    0,
    true,
    false,
    3,
  );
  environment.coordinatesMode = 3;
  function finish(name, color, metallic = 0.6, roughness = 0.22) {
    const m = new PBRMaterial(name, scene);
    m.albedoColor = Color3.FromHexString(color);
    m.metallic = metallic;
    m.roughness = roughness;
    m.reflectionTexture = environment;
    m.environmentIntensity = 0.75;
    m.clearCoat.isEnabled = true;
    m.clearCoat.intensity = 1;
    m.clearCoat.roughness = 0.12;
    return m;
  }
  const chrome = finish("forged alloys", "#b7c4c8", 0.85, 0.18);
  const carbon = finish("carbon aero", "#111a20", 0.25, 0.4);
  // Material definitions
  const grass = material("fairway grass", "#3c6b4e", 0.05),
    sand = material("coastal sand", "#c8b082", 0.08),
    road = material("track asphalt", "#283133", 0.22),
    rubberMat = material("rubber racing groove", "#1a2123", 0.16),
    cream = material("ivory marking", "#f5f3e4", 0.3),
    lime = material("apex neon", "#d6fc71", 0.4, "#2a380e"),
    red = material("curb red", "#df4738", 0.25),
    dark = material("barrier dark", "#182022", 0.2),
    metal = material("gantry truss", "#4b585e", 0.4),
    glass = material("smoked canopy", "#18363d", 0.8),
    bark = material("palm trunk", "#6b5d49", 0.05),
    leaf = material("palm leaf", "#28583c", 0.08),
    water = material("lagoon water", "#2e7b85", 0.6);

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

  // Large coastal island terrain
  const island = box("island", 1100, 0.6, 1100, -20, -0.35, 5, grass);
  island.receiveShadows = !!shadowGen;

  // Sandy beach perimeter
  box("beach", 1160, 0.4, 1160, -20, -0.55, 5, sand);

  // Surrounding turquoise lagoon
  box("ocean", 1600, 0.1, 1600, -20, -0.75, 5, water);

  // Smooth wide road ribbon (22m wide)
  const edges = [-11, 11].map((offset) =>
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
  surface.receiveShadows = !!shadowGen;

  // Darkened rubber racing line groove along the racing apexes
  const rubberEdges = [-2.8, 2.8].map((offset) =>
    Array.from({ length: TRACK.segments + 1 }, (_, i) => {
      const p = point((i * LENGTH) / TRACK.segments, offset);
      return new Vector3(p.x, 0.083, p.z);
    }),
  );
  const rubberRibbon = MeshBuilder.CreateRibbon(
    "rubberRibbon",
    { pathArray: rubberEdges, sideOrientation: 2 },
    scene,
  );
  rubberRibbon.material = rubberMat;
  rubberRibbon.receiveShadows = !!shadowGen;

  // 3D Kerbs, safety barriers and center dashed line
  const segLen = LENGTH / TRACK.segments;
  for (let i = 0; i < TRACK.segments; i++) {
    const sMid = (i + 0.5) * segLen;
    const p = point(sMid);

    for (const side of [-1, 1]) {
      const curbDist = side * 10.6;
      const wallDist = side * 11.6;
      const curbPos = point(sMid, curbDist);
      const wallPos = point(sMid, wallDist);

      const pNextCurb = point((i + 1) * segLen, curbDist);
      const pCurrCurb = point(i * segLen, curbDist);
      const curbLength = Math.hypot(
        pNextCurb.x - pCurrCurb.x,
        pNextCurb.z - pCurrCurb.z,
      );

      const pNextWall = point((i + 1) * segLen, wallDist);
      const pCurrWall = point(i * segLen, wallDist);
      const wallLength = Math.hypot(
        pNextWall.x - pCurrWall.x,
        pNextWall.z - pCurrWall.z,
      );

      // Red/white apex rumble strips
      box(
        "curb",
        0.9,
        0.18,
        curbLength * 0.999,
        curbPos.x,
        0.09,
        curbPos.z,
        i % 2 ? cream : red,
        p.yaw,
      );

      // Barriers
      box(
        "barrier",
        0.9,
        1.3,
        wallLength * 0.999,
        wallPos.x,
        0.65,
        wallPos.z,
        i % 6 < 3 ? cream : dark,
        p.yaw,
      );
    }

    if (i % 2 === 0) {
      box(
        "center stripe",
        0.2,
        0.03,
        segLen * 0.6,
        p.x,
        0.1,
        p.z,
        cream,
        p.yaw,
      );
    }
  }

  // Checkered start / finish line
  for (let i = 0; i < 14; i++) {
    const offset = -9.75 + i * 1.5;
    const p = point(0, offset);
    for (let j = 0; j < 2; j++) {
      box(
        "finish checker",
        1.5,
        0.04,
        1.4,
        p.x,
        0.12,
        p.z + j * 1.4,
        (i + j) % 2 ? dark : cream,
      );
    }
  }

  // Starting grid boxes and burnout tire marks for 6 cars
  for (let slot = 0; slot < 6; slot++) {
    const slotS = -8 - Math.floor(slot / 2) * 7;
    const slotOffset = slot % 2 ? 3 : -3;
    const p = point(slotS, slotOffset);
    box("grid box", 2.2, 0.03, 3.8, p.x, 0.1, p.z, cream, p.yaw);
    box("grid fill", 1.9, 0.04, 3.5, p.x, 0.105, p.z, road, p.yaw);

    // Dark burnout tire marks behind each starting slot
    for (const side of [-0.68, 0.68]) {
      const pBurn = point(slotS - 2.8, slotOffset + side);
      box(
        "burnout mark",
        0.34,
        0.02,
        3.4,
        pBurn.x,
        0.09,
        pBurn.z,
        dark,
        pBurn.yaw,
      );
    }
  }

  function sign(text, x, y, z, width = 16, height = 4, yaw = 0, fontSize = 90) {
    const tex = new DynamicTexture("sign", { width: 512, height: 128 }, scene);
    tex.drawText(
      text,
      null,
      85,
      `bold ${fontSize}px sans-serif`,
      "#d6fc71",
      "#12221b",
      true,
    );
    const mat = material("sign material", "#ffffff");
    mat.diffuseTexture = tex;
    mat.emissiveColor = new Color3(0.3, 0.35, 0.25);
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

  // Start / finish gantry arch
  const startP = point(0);
  box("gantry left", 0.9, 9, 0.9, startP.x - 13.5, 4.5, startP.z, metal);
  box("gantry right", 0.9, 9, 0.9, startP.x + 13.5, 4.5, startP.z, metal);
  const arch = box("start arch", 28, 2.4, 1.2, startP.x, 9, startP.z, lime);
  if (shadowGen) shadowGen.addShadowCaster(arch);

  sign("APEX GRAND PRIX", startP.x, 9, startP.z - 0.7, 24, 2.2, 0, 80);

  // 5 Synchronized 3D Start Gantry Lights (Facing drivers on the grid)
  const gantryBulbs = [];
  const gantryOffMat = material("gantryOff", "#1a0404", 0.1);
  const gantryRedMat = material("gantryRed", "#ff2222", 0.9, "#ff1818");
  const gantryGreenMat = material("gantryGreen", "#22ff44", 0.9, "#16ff38");
  for (let i = 0; i < 5; i++) {
    const lx = startP.x + (i - 2) * 2.2;
    box("gantry housing " + i, 1.3, 1.8, 0.45, lx, 7.3, startP.z - 0.65, dark);
    const bulb = MeshBuilder.CreateCylinder(
      "gantry bulb " + i,
      { diameter: 0.76, height: 0.14, tessellation: 16 },
      scene,
    );
    bulb.rotation.x = Math.PI / 2;
    bulb.position.set(lx, 7.3, startP.z - 0.88);
    bulb.material = gantryOffMat;
    gantryBulbs.push(bulb);
  }

  // Checkpoint gates visual markers
  const gateMeshes = gates.map((p, i) => {
    const root = new TransformNode("checkpoint " + i, scene);
    for (const offset of [-10, 10]) {
      box("checkpoint post", 0.25, 3.5, 0.25, offset, 1.75, 0, lime, 0, root);
    }
    root.position.set(p.x, 0, p.z);
    root.rotation.y = p.yaw;
    return root;
  });

  // Reusable arrow texture for all directional markers
  const arrowTex = new DynamicTexture(
    "arrowTex",
    { width: 128, height: 128 },
    scene,
  );
  arrowTex.drawText(
    "↑",
    null,
    95,
    "bold 95px sans-serif",
    "#d6fc71",
    "#12251d",
    true,
  );
  const arrowMat = material("arrowMat", "#ffffff");
  arrowMat.diffuseTexture = arrowTex;
  arrowMat.emissiveColor = new Color3(0.3, 0.35, 0.25);

  for (let i = 0; i < 16; i++) {
    const p = point((i * LENGTH) / 16 + 25);
    const arrow = MeshBuilder.CreatePlane(
      "arrow",
      { width: 2.4, height: 3.6, sideOrientation: 2 },
      scene,
    );
    arrow.position.set(p.x, 0.16, p.z);
    arrow.rotation.y = p.yaw;
    arrow.rotation.x = Math.PI / 2;
    arrow.material = arrowMat;
  }

  // Distance marker boards approaching Turn 1
  for (const [dist, label] of [
    [150, "150"],
    [100, "100"],
    [50, "50"],
  ]) {
    const p = point(200 - dist, 13);
    sign(label, p.x, 2, p.z, 3.5, 2.2, p.yaw + Math.PI / 2, 80);
    box("board post", 0.2, 2, 0.2, p.x, 1, p.z, metal);
  }

  // Distance marker boards approaching South Sweeper / Carousel
  for (const [dist, label] of [
    [150, "150"],
    [100, "100"],
    [50, "50"],
  ]) {
    const p = point(1080 - dist, 13);
    sign(label, p.x, 2, p.z, 3.5, 2.2, p.yaw + Math.PI / 2, 80);
    box("board post south", 0.2, 2, 0.2, p.x, 1, p.z, metal);
  }

  // Base palm tree prototype for GPU instancing
  const baseTrunk = MeshBuilder.CreateCylinder(
    "baseTrunk",
    {
      height: 7.5,
      diameterTop: 0.35,
      diameterBottom: 0.65,
      tessellation: 7,
    },
    scene,
  );
  baseTrunk.position.y = -100;
  baseTrunk.material = bark;
  baseTrunk.isVisible = false;

  const baseFronds = [];
  for (let a = 0; a < 5; a++) {
    const frond = MeshBuilder.CreateSphere(
      "baseFrond",
      { diameter: 1, segments: 4 },
      scene,
    );
    frond.scaling.set(1.4, 0.35, 5.0);
    frond.rotation.y = (a * Math.PI * 2) / 5;
    frond.position.y = -100;
    frond.material = leaf;
    frond.isVisible = false;
    baseFronds.push(frond);
  }

  function palm(x, z, scale = 1) {
    const trunkInst = baseTrunk.createInstance("palm_" + x + "_" + z);
    trunkInst.position.set(x, 3.75 * scale, z);
    trunkInst.scaling.set(scale, scale, scale);
    if (shadowGen) shadowGen.addShadowCaster(trunkInst);

    for (let i = 0; i < baseFronds.length; i++) {
      const frondInst = baseFronds[i].createInstance(
        "frond_" + x + "_" + z + "_" + i,
      );
      frondInst.position.set(
        x + Math.sin(baseFronds[i].rotation.y) * 1.8 * scale,
        7.5 * scale,
        z + Math.cos(baseFronds[i].rotation.y) * 1.8 * scale,
      );
      frondInst.rotation.y = baseFronds[i].rotation.y;
      frondInst.scaling.set(scale, scale, scale);
    }
  }

  // Naturally placed palm trees along circuit vistas
  for (let i = 0; i < 35; i++) {
    const p = point((i * LENGTH) / 35, 22 + (i % 3) * 7);
    palm(p.x, p.z, 0.95 + (i % 4) * 0.15);
  }
  for (let i = 0; i < 10; i++) {
    palm(20 + i * 18, -80 + (i % 3) * 35, 1.1 + (i % 2) * 0.2);
    palm(-50 + i * 14, -180 + (i % 2) * 30, 1.2);
  }

  // Modern Pit Lane / Paddock complex along the main straight
  box("pit building", 14, 8, 120, 142, 4, 20, cream);
  box("pit roof", 16, 0.8, 124, 142, 8.4, 20, red);
  box("pit glass", 0.1, 3.2, 100, 134.9, 5.5, 20, glass);
  sign("PADDOCK CLUB", 134.8, 9.8, 20, 26, 3, Math.PI / 2, 70);

  // Spectator Grandstands
  for (let i = 0; i < 5; i++) {
    box(
      "grandstand",
      12,
      1.5 + i * 1.2,
      50,
      95,
      (1.5 + i * 1.2) / 2,
      -70,
      i % 2 ? cream : dark,
    );
  }

  // Batch immobile scenery by material: a circuit needs few draw calls, not one per curb.
  const batches = new Map();
  for (const mesh of [...scene.meshes]) {
    if (
      mesh.parent ||
      mesh.isAnInstance ||
      mesh.instances?.length ||
      !mesh.isVisible ||
      !mesh.material ||
      gantryBulbs.includes(mesh)
    )
      continue;
    const list = batches.get(mesh.material) || [];
    list.push(mesh);
    batches.set(mesh.material, list);
  }
  for (const [mat, meshes] of batches) {
    if (meshes.length < 2) continue;
    const merged = Mesh.MergeMeshes(
      meshes,
      true,
      true,
      undefined,
      false,
      false,
    );
    if (merged) {
      merged.material = mat;
      merged.receiveShadows = true;
      merged.freezeWorldMatrix();
    }
  }
  if (shadowGen) {
    const map = shadowGen.getShadowMap();
    map.renderList = map.renderList.filter((mesh) => !mesh.isDisposed());
  }
  const cars = new Map();

  // High-performance soft tire smoke pool
  const smokeMaterial = material("tire haze", "#d0d4cc", 0);
  smokeMaterial.alpha = 0.24;
  const smoke = Array.from({ length: 40 }, () => {
    const mesh = MeshBuilder.CreateSphere(
      "tire smoke",
      { diameter: 1, segments: 4 },
      scene,
    );
    mesh.material = smokeMaterial;
    mesh.setEnabled(false);
    return { mesh, life: 0 };
  });
  let smokeCursor = 0,
    smokeClock = 0;

  // Dynamic metallic collision/kerb spark particle pool
  const sparkMaterial = material("spark", "#ffc83b", 0.9, "#ff8800");
  const sparks = Array.from({ length: 48 }, () => {
    const mesh = MeshBuilder.CreateBox("spark", { size: 0.08 }, scene);
    mesh.material = sparkMaterial;
    mesh.setEnabled(false);
    return { mesh, life: 0, vx: 0, vy: 0, vz: 0 };
  });
  let sparkCursor = 0;

  function emitSparks(x, y, z, count = 8, scale = 1) {
    for (let i = 0; i < count; i++) {
      const s = sparks[sparkCursor++ % sparks.length];
      s.life = 0.28 + Math.random() * 0.32;
      s.mesh.position.set(
        x + (Math.random() - 0.5) * 0.4,
        y + Math.random() * 0.25,
        z + (Math.random() - 0.5) * 0.4,
      );
      s.vx = (Math.random() - 0.5) * 12 * scale;
      s.vy = (1.8 + Math.random() * 5.2) * scale;
      s.vz = (Math.random() - 0.5) * 12 * scale;
      s.mesh.setEnabled(true);
    }
  }

  // Common high-performance materials for vehicles
  const headlightGlow = material("headlightGlow", "#ffffff", 0.95, "#e6ffa8");
  const taillightGlow = material("taillightGlow", "#ff2222", 0.8, "#ff0505");
  const cockpitInterior = material("cockpitInterior", "#0e1418", 0.1);
  const brakeDiscCold = material("brakeDiscCold", "#2b2f33", 0.45);
  const brakeDiscHot = material("brakeDiscHot", "#ff4500", 0.95, "#ff3300");
  const tireStripe = material("tireStripe", "#e6382a", 0.2, "#881510");
  const visorMat = material("visorGlass", "#0f171c", 0.95);

  function car(player) {
    const root = new TransformNode(player.id, scene),
      chassis = new TransformNode(player.id + "_chassis", scene);
    chassis.parent = root;

    const paint = finish(player.id, player.color, 0.42, 0.22);
    const helmetPaint = finish("helmet_" + player.id, player.color, 0.55, 0.22);

    // Soft contact shadow disc grounded directly beneath car
    const shadowDisc = MeshBuilder.CreateDisc(
      "contactShadow_" + player.id,
      { radius: 1.58, tessellation: 18 },
      scene,
    );
    shadowDisc.rotation.x = Math.PI / 2;
    shadowDisc.position.set(0, -0.465, 0);
    shadowDisc.scaling.set(0.72, 1.35, 1);
    shadowDisc.parent = root;
    const shadowMat = material("contactShadowMat_" + player.id, "#080c0d", 0);
    shadowMat.alpha = 0.52;
    shadowDisc.material = shadowMat;

    // High-contrast racing livery stripe and race number plate
    const isLightColor = ["#ffffff", "#d6fc71", "#e6ffa8"].includes(
      player.color.toLowerCase(),
    );
    const liveryStripeMat = finish(
      "stripe_" + player.id,
      isLightColor ? "#141c22" : "#ffffff",
      0.8,
      0.2,
    );
    box(
      "livery stripe nose",
      0.22,
      0.02,
      1.3,
      0,
      0.42,
      1.15,
      liveryStripeMat,
      0,
      chassis,
    );
    box(
      "livery stripe spine",
      0.2,
      0.02,
      1.1,
      0,
      0.72,
      -0.72,
      liveryStripeMat,
      0,
      chassis,
    );

    const numPlateTex = new DynamicTexture(
      "numTex_" + player.id,
      { width: 128, height: 128 },
      scene,
    );
    const numVal =
      ((parseInt(player.id.replace(/\D/g, ""), 10) || 1) % 89) + 11;
    numPlateTex.drawText(
      String(numVal),
      null,
      88,
      "bold 78px sans-serif",
      "#ffffff",
      player.color,
      true,
    );
    const numMat = material("numMat_" + player.id, "#ffffff");
    numMat.diffuseTexture = numPlateTex;
    numMat.emissiveColor = new Color3(0.4, 0.4, 0.4);
    const nosePlate = MeshBuilder.CreatePlane(
      "nosePlate_" + player.id,
      { width: 0.38, height: 0.38 },
      scene,
    );
    nosePlate.position.set(0, 0.39, 1.35);
    nosePlate.rotation.x = Math.PI / 2 - 0.25;
    nosePlate.material = numMat;
    nosePlate.parent = chassis;

    // Forward headlight projection beams
    const beamMat = material(
      "headlightBeamMat_" + player.id,
      "#ffffff",
      0,
      "#e8ffb0",
    );
    beamMat.alpha = 0.12;
    for (const x of [-0.72, 0.72]) {
      const beam = MeshBuilder.CreateCylinder(
        "beam_" + x,
        {
          height: 6.2,
          diameterTop: 0.28,
          diameterBottom: 2.2,
          tessellation: 12,
        },
        scene,
      );
      beam.rotation.x = Math.PI / 2 + 0.03;
      beam.position.set(x, 0.25, 4.0);
      beam.material = beamMat;
      beam.setEnabled(false);
      beam.parent = chassis;
    }

    // Lofted body shells: tapered nose, shoulder lines and rear haunches.
    function shell(name, sections, m) {
      const rings = sections.map(([z, w, bottom, top]) => [
        new Vector3(-w * 0.8, bottom, z),
        new Vector3(-w, top - 0.12, z),
        new Vector3(-w * 0.72, top, z),
        new Vector3(w * 0.72, top, z),
        new Vector3(w, top - 0.12, z),
        new Vector3(w * 0.8, bottom, z),
      ]);
      const mesh = MeshBuilder.CreateRibbon(
        name,
        { pathArray: rings, closePath: true, sideOrientation: 2 },
        scene,
      );
      mesh.parent = chassis;
      mesh.material = m;
      return mesh;
    }

    // 1. Aerodynamic sculpted monocoque chassis
    const body = shell(
      "monocoque",
      [
        [-2.12, 0.88, 0.03, 0.42],
        [-1.45, 1.04, 0.04, 0.63],
        [-0.55, 1.01, 0.04, 0.65],
        [0.48, 0.97, 0.04, 0.53],
        [1.52, 0.93, 0.04, 0.39],
        [2.08, 0.75, 0.09, 0.27],
      ],
      paint,
    );
    if (shadowGen) shadowGen.addShadowCaster(body);

    // 2. Front Wing Assembly (multi-tier aerodynamic wing with endplates & canards)
    box("front splitter", 2.36, 0.065, 0.56, 0, 0.05, 2.0, carbon, 0, chassis);
    box("front wing flap", 2.22, 0.038, 0.34, 0, 0.14, 1.94, paint, 0, chassis);
    for (const x of [-1.18, 1.18]) {
      box(
        "front endplate",
        0.05,
        0.26,
        0.62,
        x,
        0.15,
        1.98,
        carbon,
        0,
        chassis,
      );
      box(
        "front canard",
        0.22,
        0.025,
        0.18,
        x - Math.sign(x) * 0.09,
        0.23,
        1.92,
        carbon,
        0,
        chassis,
      );
    }
    box("nose camera pod", 0.12, 0.09, 0.22, 0, 0.39, 1.62, dark, 0, chassis);

    // 3. Cockpit, Driver & F1 Safety Halo
    box(
      "cockpit tub",
      0.84,
      0.18,
      1.05,
      0,
      0.46,
      0.05,
      cockpitInterior,
      0,
      chassis,
    );
    shell(
      "windscreen visor",
      [
        [-1.02, 0.65, 0.52, 0.79],
        [-0.62, 0.65, 0.55, 1.05],
        [0.18, 0.62, 0.51, 1.02],
        [0.85, 0.64, 0.44, 0.51],
      ],
      glass,
    );

    // F1 Safety Halo
    box("halo pillar", 0.055, 0.38, 0.07, 0, 0.72, 0.48, carbon, 0, chassis);
    box("halo arch", 0.78, 0.065, 0.74, 0, 0.91, 0.14, carbon, 0, chassis);

    // 3D Driver Helmet inside cockpit
    const helmet = MeshBuilder.CreateSphere(
      "helmet",
      { diameter: 0.36, segments: 10 },
      scene,
    );
    helmet.position.set(0, 0.71, 0.08);
    helmet.parent = chassis;
    helmet.material = helmetPaint;

    const helmetVisor = MeshBuilder.CreateBox(
      "helmet visor",
      { width: 0.26, height: 0.1, depth: 0.16 },
      scene,
    );
    helmetVisor.position.set(0, 0.72, 0.21);
    helmetVisor.parent = chassis;
    helmetVisor.material = visorMat;

    // Overhead engine airbox intake scoop & spine shark fin
    box("airbox scoop", 0.36, 0.22, 0.62, 0, 0.94, -0.16, paint, 0, chassis);
    box("shark fin", 0.045, 0.46, 1.45, 0, 0.81, -0.84, carbon, 0, chassis);

    // 4. Sidepods, Cooling Inlets & Aero Skirts
    for (const x of [-0.76, 0.76]) {
      box("sidepod body", 0.44, 0.35, 1.4, x, 0.26, 0.12, paint, 0, chassis);
      box(
        "radiator duct",
        0.36,
        0.26,
        0.08,
        x,
        0.28,
        0.82,
        cockpitInterior,
        0,
        chassis,
      );
      box("side skirt", 0.08, 0.08, 2.3, x * 1.38, 0.05, 0, carbon, 0, chassis);
      box(
        "mirror stem",
        0.035,
        0.16,
        0.035,
        x * 0.92,
        0.68,
        0.32,
        carbon,
        0,
        chassis,
      );
      box(
        "mirror body",
        0.18,
        0.09,
        0.15,
        x * 1.06,
        0.75,
        0.32,
        paint,
        0,
        chassis,
      );
      box(
        "engine louver",
        0.34,
        0.02,
        0.48,
        x,
        0.62,
        -0.92,
        carbon,
        0,
        chassis,
      );
      box(
        "headlight",
        0.38,
        0.055,
        0.09,
        x,
        0.35,
        1.96,
        headlightGlow,
        0,
        chassis,
      );
    }

    // 5. Rear Wing, Diffuser & Dual Exhausts
    box("rear wing main", 2.36, 0.08, 0.52, 0, 1.05, -1.86, carbon, 0, chassis);
    box("rear wing flap", 2.24, 0.045, 0.28, 0, 1.15, -1.82, paint, 0, chassis);
    box("drs actuator", 0.12, 0.09, 0.18, 0, 1.12, -1.82, chrome, 0, chassis);
    for (const x of [-1.18, 1.18]) {
      box(
        "rear endplate",
        0.05,
        0.52,
        0.62,
        x,
        1.02,
        -1.86,
        carbon,
        0,
        chassis,
      );
    }
    for (const x of [-0.42, 0.42]) {
      box(
        "swan neck pylon",
        0.05,
        0.52,
        0.16,
        x,
        0.81,
        -1.82,
        chrome,
        0,
        chassis,
      );
    }

    // Underbody diffuser & strakes
    box("rear diffuser", 1.96, 0.11, 0.62, 0, 0.05, -1.98, carbon, 0, chassis);
    for (const x of [-0.58, -0.2, 0.2, 0.58]) {
      box(
        "diffuser strake",
        0.035,
        0.15,
        0.52,
        x,
        0.08,
        -1.98,
        carbon,
        0,
        chassis,
      );
    }

    // Dual central exhausts
    for (const x of [-0.14, 0.14]) {
      box("exhaust pipe", 0.11, 0.11, 0.22, x, 0.38, -2.05, metal, 0, chassis);
    }

    // Flashing rear FIA rain / brake light
    const brakeLights = [
      box(
        "fia rain light",
        0.24,
        0.12,
        0.05,
        0,
        0.24,
        -2.08,
        taillightGlow,
        0,
        chassis,
      ),
    ];
    for (const x of [-0.68, 0.68]) {
      brakeLights.push(
        box(
          "rear brake led",
          0.42,
          0.06,
          0.05,
          x,
          0.41,
          -2.06,
          taillightGlow,
          0,
          chassis,
        ),
      );
    }

    // 6. Forged Alloy Wheels with glowing carbon-ceramic brake discs
    const wheels = [];
    const brakeDiscs = [];

    for (const x of [-1.05, 1.05]) {
      for (const z of [-1.2, 1.2]) {
        const pivot = new TransformNode("wheel pivot", scene);
        pivot.parent = root;
        pivot.position.set(x, -0.05, z);

        const axle = new TransformNode("spinning axle", scene);
        axle.parent = pivot;

        // Tire tread
        const wheel = MeshBuilder.CreateCylinder(
          "wheel",
          { diameter: 0.76, height: 0.38, tessellation: 16 },
          scene,
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.parent = axle;
        wheel.material = dark;

        // Pirelli-style sidewall compound stripe
        const stripe = MeshBuilder.CreateTorus(
          "sidewall stripe",
          { diameter: 0.64, thickness: 0.03, tessellation: 18 },
          scene,
        );
        stripe.rotation.z = Math.PI / 2;
        stripe.position.x = Math.sign(x) * 0.19;
        stripe.parent = axle;
        stripe.material = tireStripe;

        // Forged alloy spokes
        for (let spoke = 0; spoke < 5; spoke++) {
          const spokeMesh = box(
            "alloy spoke",
            0.032,
            0.52,
            0.042,
            Math.sign(x) * 0.18,
            0,
            0,
            chrome,
            0,
            axle,
          );
          spokeMesh.rotation.x = (spoke * Math.PI) / 5;
        }

        // Center wheel hub
        const hub = MeshBuilder.CreateCylinder(
          "hub",
          { diameter: 0.18, height: 0.05, tessellation: 12 },
          scene,
        );
        hub.rotation.z = Math.PI / 2;
        hub.position.x = Math.sign(x) * 0.21;
        hub.parent = axle;
        hub.material = chrome;

        // Carbon-ceramic brake disc (glows red hot under heavy braking)
        const disc = MeshBuilder.CreateCylinder(
          "brake disc",
          { diameter: 0.54, height: 0.035, tessellation: 16 },
          scene,
        );
        disc.rotation.z = Math.PI / 2;
        disc.position.x = Math.sign(x) * 0.11;
        disc.parent = axle;
        disc.material = brakeDiscCold;
        brakeDiscs.push(disc);

        // Racing red Brembo caliper
        box(
          "caliper",
          0.065,
          0.18,
          0.13,
          Math.sign(x) * 0.11,
          0,
          0.18,
          red,
          0,
          pivot,
        );

        wheels.push({ pivot, wheel: axle, front: z > 0 });
      }
    }

    // Batch rigid pieces while keeping wheel axles, suspension and lights animated.
    for (const parent of [chassis, ...wheels.map((w) => w.wheel)]) {
      const groups = new Map();
      for (const mesh of parent.getChildMeshes(true)) {
        if (
          !mesh.isEnabled() ||
          brakeLights.includes(mesh) ||
          brakeDiscs.includes(mesh)
        )
          continue;
        const group = groups.get(mesh.material) || [];
        group.push(mesh);
        groups.set(mesh.material, group);
      }
      for (const meshes of groups.values()) {
        if (meshes.length < 2) continue;
        const castsShadow = meshes.some((m) =>
          shadowGen?.getShadowMap()?.renderList.includes(m),
        );
        const merged = Mesh.MergeMeshes(meshes, true, true);
        if (merged) {
          merged.setParent(parent);
          if (castsShadow) shadowGen.addShadowCaster(merged);
        }
      }
    }
    if (shadowGen)
      shadowGen.getShadowMap().renderList = shadowGen
        .getShadowMap()
        .renderList.filter((m) => !m.isDisposed());

    // 7. Driver Billboard Label
    const label = document.createElement("div");
    label.className = "driver-label";
    label.innerHTML = `<span class="driver-tag-pip"></span><span class="driver-tag-pos"></span><span class="driver-tag-name"></span>`;
    const posEl = label.querySelector(".driver-tag-pos");
    const nameEl = label.querySelector(".driver-tag-name");
    nameEl.textContent = player.name;
    label.style.setProperty("--driver-color", player.color);
    document.body.append(label);

    const result = {
      root,
      chassis,
      wheels,
      label,
      posEl,
      nameEl,
      lastPos: 0,
      lastName: player.name,
      brakeLights,
      brakeDiscs,
      brakeHeat: 0,
      target: null,
      samples: [],
      dispose: () => {
        if (audioSystem) audioSystem.removeRemoteCar(player.id);
        root.dispose();
        paint.dispose();
        helmetPaint.dispose();
        liveryStripeMat.dispose();
        numMat.dispose();
        numPlateTex.dispose();
        shadowMat.dispose();
        beamMat.dispose();
        label.remove();
      },
    };
    cars.set(player.id, result);
    return result;
  }

  let serverOffset = 0,
    inputHistory = [],
    predictionRtt = 0,
    currentPhase = "",
    localInput = {},
    targets = [],
    me = null,
    racing = false,
    camShake = 0,
    localSteerAngle = 0,
    last = performance.now();

  function update(state, id) {
    targets = state.cars;
    me = id;
    racing = ["countdown", "racing", "results"].includes(state.phase);

    for (const p of state.players) if (!cars.has(p.id)) car(p);
    for (const [cId, c] of cars) {
      if (!state.players.some((p) => p.id === cId)) {
        c.dispose();
        cars.delete(cId);
      }
    }

    for (const t of targets) {
      const c = cars.get(t.id);
      if (!c) continue;
      const phaseReset =
        currentPhase !== state.phase &&
        (state.phase === "countdown" || state.phase === "lobby");
      const distJump =
        c.samples.length > 0 &&
        Math.hypot(c.samples.at(-1).x - t.x, c.samples.at(-1).z - t.z) > 18;
      if (!c.target || c.target.respawn !== t.respawn || phaseReset || distJump) {
        c.samples = [];
        c.root.position.set(t.x, t.y, t.z);
        c.root.rotation.y = t.yaw;
        c.fadeAt = performance.now();
        c.predBlend = 0;
        c.recovery = null;
        c.reconcile = null;
        c.prediction = null;
      }
      const at =
        performance.now() +
        ((state.serverNow || Date.now()) - (Date.now() + serverOffset));
      if (t.id === id) {
        const motion = { ...t };
        const horizon = Math.max(
          0,
          Math.min(0.12, (Date.now() + serverOffset - state.serverNow) / 1000),
        );
        for (let elapsed = 0; elapsed < horizon; elapsed += 1 / 60) {
          const sampleAt = performance.now() - horizon * 1000 + elapsed * 1000;
          const acknowledged = inputHistory.find((p) => p.seq === t.ack)?.input;
          const command = inputHistory.findLast(
            (p) => p.seq > t.ack && p.at <= sampleAt,
          )?.input ||
            acknowledged || {
              up: t.throttle,
              down: t.braking,
              left: t.steer < -0.1,
              right: t.steer > 0.1,
              drift: t.drift,
            };
          predict(motion, command, Math.min(1 / 60, horizon - elapsed));
        }
        if (c.prediction && c.predBlend > 0.5) {
          const age = Math.min(
            0.05,
            Math.max(0, (performance.now() - c.predictedAt) / 1000),
          );
          const x =
            c.prediction.x +
            c.prediction.vx * age +
            (c.reconcile?.x || 0) -
            motion.x;
          const z =
            c.prediction.z +
            c.prediction.vz * age +
            (c.reconcile?.z || 0) -
            motion.z;
          c.reconcile = Math.hypot(x, z) < 3 ? { x, z } : null;
        }
        c.prediction = motion;
        c.predictedAt = performance.now();
      }
      if (c.samples.length && at - c.samples.at(-1).at > 250)
        c.recovery = { x: c.root.position.x - t.x, z: c.root.position.z - t.z };
      const lastAt = c.samples.length ? c.samples.at(-1).at : -Infinity;
      const safeAt = Math.max(lastAt + 1, at);
      c.samples.push({ ...t, at: safeAt });
      if (c.samples.length > 12) c.samples.shift();
      c.target = t;
    }
    currentPhase = state.phase;

    // Synchronized 3D Start Gantry Lights
    if (state.phase === "countdown") {
      const elapsed = Date.now() + serverOffset - state.startAt;
      let litCount = 1;
      if (elapsed >= -600) litCount = 5;
      else if (elapsed >= -1200) litCount = 4;
      else if (elapsed >= -1800) litCount = 3;
      else if (elapsed >= -2400) litCount = 2;
      gantryBulbs.forEach((bulb, i) => {
        bulb.material = i < litCount ? gantryRedMat : gantryOffMat;
      });
    } else if (
      state.phase === "racing" &&
      Date.now() + serverOffset - state.startAt < 1200
    ) {
      gantryBulbs.forEach((bulb) => (bulb.material = gantryGreenMat));
    } else {
      gantryBulbs.forEach((bulb) => (bulb.material = gantryOffMat));
    }

    const mine = targets.find((c) => c.id === me);
    gateMeshes.forEach((g, i) =>
      g.setEnabled(!!mine && i === (mine.passed + 1) % 24),
    );

    // Dynamic rank tags on floating driver billboards
    const sorted = [...targets].sort((a, b) =>
      a.finished !== null && b.finished !== null
        ? a.finished - b.finished
        : a.finished !== null
          ? -1
          : b.finished !== null
            ? 1
            : b.progress - a.progress,
    );
    for (let i = 0; i < sorted.length; i++) {
      const carTarget = sorted[i];
      const c = cars.get(carTarget.id);
      const p = state.players.find((pl) => pl.id === carTarget.id);
      if (c && p) {
        if (c.lastPos !== i + 1) {
          c.posEl.textContent = `P${i + 1}`;
          c.lastPos = i + 1;
        }
        if (c.lastName !== p.name) {
          c.nameEl.textContent = p.name;
          c.lastName = p.name;
        }
      }
    }
  }

  const scratchAnchor = new Vector3();
  const identityMatrix = Matrix.Identity();

  engine.runRenderLoop(() => {
    try {
      const now = performance.now(),
        dt = Math.min(Math.max(0.001, (now - last) / 1000), 0.05);
      last = now;
      smokeClock += dt;

    // Dissipate tire smoke particles
    for (const puff of smoke) {
      if (puff.life > 0) {
        puff.life -= dt;
        puff.mesh.position.y += dt * 0.65;
        puff.mesh.scaling.scaleInPlace(1 + dt * 0.55);
        puff.mesh.visibility = Math.max(0, puff.life / 1.2);
        if (puff.life <= 0) puff.mesh.setEnabled(false);
      }
    }

    // Animate and bounce spark particles
    for (const spk of sparks) {
      if (spk.life > 0) {
        spk.life -= dt;
        spk.vy -= 22 * dt; // Gravity
        spk.mesh.position.x += spk.vx * dt;
        spk.mesh.position.y += spk.vy * dt;
        spk.mesh.position.z += spk.vz * dt;
        if (spk.mesh.position.y < 0.08) {
          spk.mesh.position.y = 0.08;
          spk.vy = -spk.vy * 0.38; // Bounce off track
        }
        spk.mesh.visibility = Math.max(0, spk.life / 0.5);
        if (spk.life <= 0) spk.mesh.setEnabled(false);
      }
    }

    // Vehicle updates & visual dynamics
    for (const c of cars.values()) {
      const t = c.target;
      if (!t || !c.samples || c.samples.length === 0) continue;
      const isMine = c.root.name === me;
      const alpha = 1 - Math.exp(-22 * dt);

      // Interpolation timeline
      const renderAt =
        now - Math.max(55, Math.min(180, predictionRtt / 2 + 35));
      let left = c.samples[0],
        right = c.samples.at(-1);
      for (let i = 1; i < c.samples.length; i++) {
        if (c.samples[i].at >= renderAt) {
          left = c.samples[i - 1];
          right = c.samples[i];
          break;
        }
      }
      const spanMs = Math.max(1, right.at - left.at);
      const amount = Math.max(0, Math.min(1, (renderAt - left.at) / spanMs));
      const dtSec = spanMs / 1000;

      // Hermite cubic spline velocity-guided smoothing
      const tNorm = amount;
      const t2 = tNorm * tNorm;
      const t3 = t2 * tNorm;

      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + tNorm;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;

      const vx0 = (left.vx ?? 0) * dtSec;
      const vz0 = (left.vz ?? 0) * dtSec;
      const vx1 = (right.vx ?? 0) * dtSec;
      const vz1 = (right.vz ?? 0) * dtSec;

      let targetPosX, targetPosZ;
      if (
        !(left.impact > 0.03 || right.impact > 0.03 || t.impact > 0.03) &&
        (Math.hypot(vx0, vz0) > 0.01 || Math.hypot(vx1, vz1) > 0.01)
      ) {
        targetPosX = h00 * left.x + h10 * vx0 + h01 * right.x + h11 * vx1;
        targetPosZ = h00 * left.z + h10 * vz0 + h01 * right.z + h11 * vz1;
        // Clamp Hermite overshoot to sample bounds + 1.2m
        const minX = Math.min(left.x, right.x) - 1.2,
          maxX = Math.max(left.x, right.x) + 1.2;
        const minZ = Math.min(left.z, right.z) - 1.2,
          maxZ = Math.max(left.z, right.z) + 1.2;
        targetPosX = Math.max(minX, Math.min(maxX, targetPosX));
        targetPosZ = Math.max(minZ, Math.min(maxZ, targetPosZ));
      } else {
        targetPosX = left.x + (right.x - left.x) * tNorm;
        targetPosZ = left.z + (right.z - left.z) * tNorm;
      }
      const targetPosY = left.y + (right.y - left.y) * tNorm;

      // Linear angular interpolation preserves a constant turning rate across packets.
      const yawDiff = Math.atan2(
        Math.sin(right.yaw - left.yaw),
        Math.cos(right.yaw - left.yaw),
      );
      const smoothYawT = tNorm;
      const targetYaw = left.yaw + yawDiff * smoothYawT;

      const sinceLatest = Math.max(
        0,
        Math.min(0.08, (renderAt - right.at) / 1000),
      );
      const nearContact = targets.some(
        (other) =>
          other.id !== t.id && Math.hypot(other.x - t.x, other.z - t.z) < 13,
      );
      if (sinceLatest > 0 && !nearContact && !(t.impact > 0.03)) {
        const ahead = {
          x: targetPosX + (right.vx || 0) * sinceLatest,
          z: targetPosZ + (right.vz || 0) * sinceLatest,
        };
        if (nearest(ahead.x, ahead.z).distance < TRACK.width / 2 - 2) {
          targetPosX = ahead.x;
          targetPosZ = ahead.z;
        }
      }
      const hasImpact = (t.impact || 0) > 0.03 || (left.impact || 0) > 0.03 || (right.impact || 0) > 0.03;
      const canPredict =
        isMine &&
        currentPhase === "racing" &&
        t.finished === null &&
        !localInput.reset &&
        !nearContact &&
        !hasImpact &&
        now - c.samples.at(-1).at < 180 &&
        nearest(t.x, t.z).distance < TRACK.width / 2 - 3;
      if (hasImpact) c.predBlend = 0;
      c.predBlend =
        (c.predBlend || 0) +
        ((canPredict ? 1 : 0) - (c.predBlend || 0)) * (1 - Math.exp(-18 * dt));
      if (canPredict && c.prediction) {
        const predictionDt = Math.min(
          0.05,
          Math.max(0, (now - c.predictedAt) / 1000),
        );
        for (let step = 0; step < predictionDt; step += 1 / 60)
          predict(
            c.prediction,
            localInput,
            Math.min(1 / 60, predictionDt - step),
          );
        if (
          nearest(c.prediction.x, c.prediction.z).distance >
          TRACK.width / 2 - 2
        ) {
          c.prediction = { ...t };
          c.predBlend = 0;
        }
      }
      c.predictedAt = now;
      if (c.reconcile) {
        c.reconcile.x *= Math.exp(-14 * dt);
        c.reconcile.z *= Math.exp(-14 * dt);
        targetPosX += c.reconcile.x * c.predBlend;
        targetPosZ += c.reconcile.z * c.predBlend;
      }
      let displayYaw = targetYaw;
      if (isMine && c.prediction) {
        targetPosX += (c.prediction.x - targetPosX) * c.predBlend;
        targetPosZ += (c.prediction.z - targetPosZ) * c.predBlend;
        displayYaw +=
          Math.atan2(
            Math.sin(c.prediction.yaw - targetYaw),
            Math.cos(c.prediction.yaw - targetYaw),
          ) * c.predBlend;
      }
      if (c.recovery) {
        c.recovery.x *= Math.exp(-12 * dt);
        c.recovery.z *= Math.exp(-12 * dt);
        targetPosX += c.recovery.x;
        targetPosZ += c.recovery.z;
      }
      c.root.position.set(targetPosX, targetPosY, targetPosZ);
      c.root.rotation.y = displayYaw;

      // Update 3D spatialized opponent engine audio
      if (
        audioSystem &&
        !isMine &&
        currentPhase === "racing" &&
        t.finished === null
      ) {
        try {
          audioSystem.updateRemoteCar(
            c.root.name,
            c.root.position,
            camera.position,
            t.speed || 0,
            !!t.throttle,
          );
        } catch {}
      } else if (!isMine) audioSystem?.removeRemoteCar(c.root.name);

      // Active brake lights and glowing carbon discs
      c.brakeLights.forEach((light) => light.setEnabled(!!t.braking));
      if (t.braking && t.speed > 10) {
        c.brakeHeat = Math.min(1, c.brakeHeat + dt * 3.2);
      } else {
        c.brakeHeat = Math.max(0, c.brakeHeat - dt * 1.8);
      }
      const discMat = c.brakeHeat > 0.35 ? brakeDiscHot : brakeDiscCold;
      c.brakeDiscs.forEach((d) => (d.material = discMat));

      // Responsive steering: zero latency visual turn-in
      const rawSteerInput =
        (localInput.left ? -1 : 0) + (localInput.right ? 1 : 0);
      if (isMine) {
        localSteerAngle +=
          (rawSteerInput - localSteerAngle) * (1 - Math.exp(-32 * dt));
      }
      const visualSteer = isMine ? localSteerAngle : t.steer;

      // Tire smoke on heavy drift or braking
      if (t.drift && t.speed > 8 && smokeClock > 0.035) {
        const puff = smoke[smokeCursor++ % smoke.length];
        puff.life = 1.1;
        puff.mesh.setEnabled(true);
        puff.mesh.position.copyFrom(c.root.position);
        puff.mesh.position.x -= Math.sin(c.root.rotation.y) * 1.7;
        puff.mesh.position.z -= Math.cos(c.root.rotation.y) * 1.7;
        puff.mesh.position.y = 0.28;
        puff.mesh.scaling.setAll(0.65);
        smokeClock = 0;
      }

      // Spark bursts on physical impact
      if (t.impact > (c.lastImpact || 0) + 0.06) {
        emitSparks(
          c.root.position.x,
          c.root.position.y + 0.25,
          c.root.position.z,
          Math.floor(t.impact * 12),
          1.2,
        );
      }

      c.lastImpact = t.impact || 0;
      // Dynamic suspension pitch (squat on gas, dive on brake) and roll into turns
      const targetPitch = (t.throttle ? 0.022 : 0) - (t.braking ? 0.038 : 0);
      const targetRoll = -visualSteer * Math.min(1, t.speed / 24) * 0.075;
      c.chassis.rotation.x += (targetPitch - c.chassis.rotation.x) * alpha;
      c.chassis.rotation.z += (targetRoll - c.chassis.rotation.z) * alpha;

      // Wheel spinning & Ackermann steering geometry
      for (const w of c.wheels) {
        w.wheel.rotation.x += (t.speed * dt) / 0.38;
        const steerTarget = w.front ? visualSteer * 0.34 : 0;
        w.pivot.rotation.y += (steerTarget - w.pivot.rotation.y) * alpha;
      }
    }

    // Resolve tiny interpolation penetrations and emit contact sparks
    const visible = [...cars.values()];
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < visible.length; i++) {
        for (let j = i + 1; j < visible.length; j++) {
          const a = visible[i].root,
            b = visible[j].root,
            hit = overlap(
              { x: a.position.x, z: a.position.z, yaw: a.rotation.y },
              { x: b.position.x, z: b.position.z, yaw: b.rotation.y },
            );
          if (hit) {
            const correction = (hit.depth + 0.002) * 0.5;
            a.position.x -= hit.x * correction;
            a.position.z -= hit.z * correction;
            b.position.x += hit.x * correction;
            b.position.z += hit.z * correction;
            if (pass === 0 && Math.random() < 0.25) {
              emitSparks(
                (a.position.x + b.position.x) * 0.5,
                0.3,
                (a.position.z + b.position.z) * 0.5,
                6,
                0.8,
              );
            }
          }
        }
      }
    }

    // Dynamic Chase Camera with look-ahead, speed FOV & collision shake
    const mine = cars.get(me);
    if (racing && mine && mine.target) {
      const p = mine.root.position,
        yaw = mine.root.rotation.y,
        speed = Number.isFinite(mine.target.speed) ? Math.max(0, mine.target.speed) : 0;

      // Screen shake impulse on impact
      const safeImpact = Number.isFinite(mine.target.impact) ? mine.target.impact : 0;
      if (safeImpact > (mine.cameraImpact || 0) + 0.06)
        camShake = Math.min(0.12, safeImpact * 0.08);
      mine.cameraImpact = safeImpact;
      camShake *= Math.exp(-9 * dt);
      if (!Number.isFinite(camShake)) camShake = 0;

      // Smooth chase camera distance and height
      const camDist = 10.6 + Math.min(1.8, speed * 0.035);
      const camHeight = 4.2 + Math.min(0.6, speed * 0.012);

      const px = Number.isFinite(p.x) ? p.x : 120;
      const py = Number.isFinite(p.y) ? p.y : 0.55;
      const pz = Number.isFinite(p.z) ? p.z : 0;
      const safeYaw = Number.isFinite(yaw) ? yaw : 0;

      const desired = new Vector3(
        px - Math.sin(safeYaw) * camDist + (Math.random() - 0.5) * camShake,
        py + camHeight + (Math.random() - 0.5) * camShake,
        pz - Math.cos(safeYaw) * camDist + (Math.random() - 0.5) * camShake,
      );

      camera.position = Vector3.Lerp(
        camera.position,
        desired,
        1 - Math.exp(-8 * dt),
      );

      // Validate camera.position sanity
      if (
        !Number.isFinite(camera.position.x) ||
        !Number.isFinite(camera.position.y) ||
        !Number.isFinite(camera.position.z)
      ) {
        camera.position.copyFrom(desired);
      }

      // Look-ahead target anticipates corners
      const lookDist = 7.5 + Math.min(5.5, speed * 0.12);
      const lookTarget = new Vector3(
        px + Math.sin(safeYaw) * lookDist,
        py + 1.25,
        pz + Math.cos(safeYaw) * lookDist,
      );
      if (Vector3.DistanceSquared(camera.position, lookTarget) > 0.01) {
        camera.setTarget(lookTarget);
      }

      // Speed FOV expansion (intense tunnel vision at top speed, clamped safely)
      const targetFov = 0.82 + Math.min(0.14, (speed / 50) * 0.14);
      camera.fov += (targetFov - camera.fov) * (1 - Math.exp(-6 * dt));
      camera.fov = Math.max(0.70, Math.min(0.98, Number.isFinite(camera.fov) ? camera.fov : 0.82));
    } else {
      // Cinematic orbit in lobby / results
      const t = now * 0.00015;
      camera.fov = 0.82;
      camera.position.set(120 + Math.sin(t) * 75, 55, Math.cos(t) * 75);
      camera.setTarget(new Vector3(120, 2, 0));
    }

    try {
      const fwd = camera.getTarget().subtract(camera.position);
      const fwdLen = fwd.length();
      if (fwdLen > 0.001) {
        fwd.scaleInPlace(1 / fwdLen);
        audioSystem?.listener(camera.position, fwd);
      }
    } catch {}
    scene.render();

    // Floating broadcast driver tags: positioned safely above car (+2.65m)
    const occupied = [];
    const viewport = camera.viewport.toGlobal(
      engine.getRenderWidth(),
      engine.getRenderHeight(),
    );
    const camTarget = camera.getTarget();
    const camForwardX = camTarget.x - camera.position.x;
    const camForwardZ = camTarget.z - camera.position.z;
    const camForwardLen = Math.hypot(camForwardX, camForwardZ) || 1;
    const normForwardX = camForwardX / camForwardLen;
    const normForwardZ = camForwardZ / camForwardLen;
    const transformMatrix = scene.getTransformMatrix();

    for (const c of [...cars.values()].sort(
      (a, b) =>
        Vector3.DistanceSquared(a.root.position, camera.position) -
        Vector3.DistanceSquared(b.root.position, camera.position),
    )) {
      const isMine = c.root.name === me;
      if (!racing || currentPhase === "results" || isMine) {
        c.label.hidden = true;
        continue;
      }
      const toCarX = c.root.position.x - camera.position.x;
      const toCarZ = c.root.position.z - camera.position.z;
      const dotForward = toCarX * normForwardX + toCarZ * normForwardZ;
      if (dotForward < 1.0) {
        c.label.hidden = true;
        continue;
      }

      scratchAnchor.set(c.root.position.x, c.root.position.y + 2.65, c.root.position.z);
      const projected = Vector3.Project(
        scratchAnchor,
        identityMatrix,
        transformMatrix,
        viewport,
      );
      const distance = Vector3.Distance(scratchAnchor, camera.position);
      const x = (projected.x / engine.getRenderWidth()) * innerWidth,
        y = (projected.y / engine.getRenderHeight()) * innerHeight;
      const hidden =
        projected.z < 0 ||
        projected.z > 1 ||
        distance < 4.5 ||
        distance > 150 ||
        x < 80 ||
        x > innerWidth - 80 ||
        y < 120 ||
        y > innerHeight - 80 ||
        occupied.some((p) => Math.abs(p.x - x) < 140 && Math.abs(p.y - y) < 32);
      c.label.hidden = hidden;
      if (!hidden) {
        occupied.push({ x, y });
        const scale = Math.max(0.72, Math.min(1.05, 26 / distance));
        c.label.style.transform = `translate(-50%,-100%) translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${scale.toFixed(2)})`;
        c.label.style.opacity = String(Math.min(1, (150 - distance) / 25));
      }
    }
  } catch (err) {
    console.warn("Render loop error handled safely:", err);
  }
});

  window.addEventListener("resize", () => engine.resize());

  return {
    update,
    input: (keys, history = []) => {
      localInput = { ...keys };
      inputHistory = history;
    },
    network: (offset, rtt) => {
      serverOffset = offset;
      predictionRtt = rtt;
    },
    quality: (level) => {
      engine.setHardwareScalingLevel([2, 1.5, 1][level]);
      if (shadowGen) {
        if (level === 0) {
          scene.shadowsEnabled = false;
        } else if (level === 1) {
          scene.shadowsEnabled = true;
          shadowGen.usePoissonSampling = false;
        } else {
          scene.shadowsEnabled = true;
          shadowGen.usePoissonSampling = true;
        }
      }
    },
    scene,
  };
}
