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
import { TRACK, LENGTH, point, gates } from "../../shared/track.js";

import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial";
import {RawCubeTexture} from "@babylonjs/core/Materials/Textures/rawCubeTexture";
import {overlap} from "../../shared/contact.js";
export function createScene(canvas) {
  const engine = new Engine(canvas, true, {
    stencil: false,
    preserveDrawingBuffer: true,
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
  const faces=Array.from({length:6},(_,face)=>{
    const data=new Uint8Array(64*64*4);
    for(let y=0;y<64;y++)for(let x=0;x<64;x++){
      const sky=face===2?1:face===3?0:1-y/63;
      const highlight=Math.exp(-((x-40)**2/75+(y-20)**2/12))*.7;
      const i=(y*64+x)*4;
      data[i]=Math.min(255,45+sky*115+highlight*100);data[i+1]=Math.min(255,60+sky*130+highlight*100);data[i+2]=Math.min(255,62+sky*150+highlight*100);data[i+3]=255;
    }return data;
  });
  const environment=new RawCubeTexture(scene,faces,64,5,0,true,false,3);
  environment.coordinatesMode=3;
  function finish(name,color,metallic=.6,roughness=.22){
    const m=new PBRMaterial(name,scene);m.albedoColor=Color3.FromHexString(color);m.metallic=metallic;m.roughness=roughness;m.reflectionTexture=environment;m.environmentIntensity=.75;m.clearCoat.isEnabled=true;m.clearCoat.intensity=1;m.clearCoat.roughness=.12;return m;
  }
  const chrome=finish("forged alloys","#b7c4c8",.85,.18);
  const carbon=finish("carbon aero","#111a20",.25,.4);
  // Material definitions
  const grass = material("fairway grass", "#3c6b4e", 0.05),
    sand = material("coastal sand", "#c8b082", 0.08),
    road = material("track asphalt", "#283133", 0.22),
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
      const curbLength = Math.hypot(pNextCurb.x - pCurrCurb.x, pNextCurb.z - pCurrCurb.z);

      const pNextWall = point((i + 1) * segLen, wallDist);
      const pCurrWall = point(i * segLen, wallDist);
      const wallLength = Math.hypot(pNextWall.x - pCurrWall.x, pNextWall.z - pCurrWall.z);

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
      box("center stripe", 0.2, 0.03, segLen * 0.6, p.x, 0.1, p.z, cream, p.yaw);
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

  // Starting grid boxes for 6 cars
  for (let slot = 0; slot < 6; slot++) {
    const slotS = -8 - Math.floor(slot / 2) * 7;
    const slotOffset = slot % 2 ? 3 : -3;
    const p = point(slotS, slotOffset);
    box("grid box", 2.2, 0.03, 3.8, p.x, 0.1, p.z, cream, p.yaw);
    box("grid fill", 1.9, 0.04, 3.5, p.x, 0.105, p.z, road, p.yaw);
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
  const arrowTex = new DynamicTexture("arrowTex", { width: 128, height: 128 }, scene);
  arrowTex.drawText("↑", null, 95, "bold 95px sans-serif", "#d6fc71", "#12251d", true);
  const arrowMat = material("arrowMat", "#ffffff");
  arrowMat.diffuseTexture = arrowTex;
  arrowMat.emissiveColor = new Color3(0.3, 0.35, 0.25);

  for (let i = 0; i < 16; i++) {
    const p = point((i * LENGTH) / 16 + 25);
    const arrow = MeshBuilder.CreatePlane("arrow", { width: 2.4, height: 3.6, sideOrientation: 2 }, scene);
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

  // Base palm tree prototype for GPU instancing
  const baseTrunk = MeshBuilder.CreateCylinder("baseTrunk", {
    height: 7.5,
    diameterTop: 0.35,
    diameterBottom: 0.65,
    tessellation: 7,
  }, scene);
  baseTrunk.position.y = -100;
  baseTrunk.material = bark;
  baseTrunk.isVisible = false;

  const baseFronds = [];
  for (let a = 0; a < 5; a++) {
    const frond = MeshBuilder.CreateSphere("baseFrond", { diameter: 1, segments: 4 }, scene);
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
      const frondInst = baseFronds[i].createInstance("frond_" + x + "_" + z + "_" + i);
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

  const cars = new Map();
  const smokeMaterial=material("tire haze","#c5c9be",0);smokeMaterial.alpha=.22;
  const smoke=Array.from({length:36},()=>{const mesh=MeshBuilder.CreateSphere("tire smoke",{diameter:1,segments:4},scene);mesh.material=smokeMaterial;mesh.setEnabled(false);return {mesh,life:0};});
  let smokeCursor=0,smokeClock=0;

  function car(player) {
    const root = new TransformNode(player.id, scene),
      chassis = new TransformNode(player.id + "_chassis", scene);
    chassis.parent = root;

    const paint = finish(player.id, player.color);

    // Lofted body shells: tapered nose, shoulder lines and rear haunches.
    function shell(name,sections,m){
      const rings=sections.map(([z,w,bottom,top])=>[
        new Vector3(-w*.8,bottom,z),new Vector3(-w,top-.12,z),new Vector3(-w*.72,top,z),
        new Vector3(w*.72,top,z),new Vector3(w,top-.12,z),new Vector3(w*.8,bottom,z)
      ]);
      const mesh=MeshBuilder.CreateRibbon(name,{pathArray:rings,closePath:true,sideOrientation:2},scene);mesh.parent=chassis;mesh.material=m;return mesh;
    }
    const body=shell("sculpted monocoque",[[-2.02,.88,.03,.42],[-1.4,1.03,.04,.64],[-.55,1,.04,.65],[.5,.96,.04,.53],[1.55,.95,.04,.40],[2.05,.77,.10,.28]],paint);
    shell("wraparound windshield",[[-1.05,.66,.52,.80],[-.65,.66,.55,1.10],[.15,.62,.51,1.06],[.85,.65,.45,.52]],glass);
    shell("canopy roof",[[-.72,.64,1.06,1.12],[.12,.61,1.04,1.1]],paint);
    box("racing stripe",.22,.012,1.1,0,.54,1.0,cream,0,chassis);
    box("front splitter",2.25,.09,.52,0,.04,1.94,carbon,0,chassis);
    box("rear diffuser",1.95,.12,.5,0,.02,-1.98,carbon,0,chassis);
    box("rear wing",2.35,.09,.48,0,.98,-1.82,carbon,0,chassis);
    for(const x of [-1.16,1.16])box("wing endplate",.055,.30,.56,x,.98,-1.82,paint,0,chassis);
    for(const x of [-.70,.70]){
      box("wing pylon",.06,.42,.13,x,.72,-1.82,chrome,0,chassis);
      box("LED headlight",.45,.045,.09,x,.36,2.0,cream,0,chassis);
      box("rear LED",.48,.05,.08,x,.40,-2.03,red,0,chassis);
      box("front intake",.42,.16,.07,x,.19,2.05,carbon,0,chassis);
      box("mirror",.20,.11,.24,x*1.49,.79,.20,paint,0,chassis);
      box("side skirt",.08,.14,2.25,x*1.48,.08,0,carbon,0,chassis);
      for(let i=0;i<4;i++)box("engine louvers",.36,.022,.045,x,.67,-.82-i*.12,carbon,0,chassis);
    }
    const brakeLights=[];
    for(const x of [-.68,.68])brakeLights.push(box("brake glow",.45,.06,.02,x,.40,-2.075,lime,0,chassis));
    if (shadowGen) shadowGen.addShadowCaster(body);

    const wheels = [];
    for (const x of [-1.05, 1.05]) {
      for (const z of [-1.2, 1.2]) {
        const pivot = new TransformNode("wheel pivot", scene);
        pivot.parent = root;
        pivot.position.set(x, -0.05, z);

        const axle = new TransformNode("spinning axle", scene);
        axle.parent = pivot;

        const wheel = MeshBuilder.CreateCylinder(
          "wheel",
          { diameter: 0.76, height: 0.38, tessellation: 14 },
          scene,
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.parent = axle;
        wheel.material = dark;

        for(let spoke=0;spoke<5;spoke++){
          const mesh=box("alloy spoke",.035,.52,.045,Math.sign(x)*.2,0,0,chrome,0,axle);mesh.rotation.x=spoke*Math.PI/5;
        }
        const hub=MeshBuilder.CreateCylinder("hub",{diameter:.18,height:.045,tessellation:12},scene);hub.rotation.z=Math.PI/2;hub.position.x=Math.sign(x)*.225;hub.parent=axle;hub.material=chrome;
        box("brake caliper",.06,.18,.12,Math.sign(x)*.18,0,.18,red,0,pivot);

        wheels.push({ pivot, wheel: axle, front: z > 0 });
      }
    }

    const label=document.createElement("div");label.className="driver-label";label.textContent=player.name;label.style.setProperty("--driver-color",player.color);document.body.append(label);

    const result = {
      root,
      chassis,
      wheels,
      label,brakeLights,
      target: null,
      samples: [],
      dispose: () => {
        root.dispose();
        paint.dispose();
        label.remove();
      },
    };
    cars.set(player.id, result);
    return result;
  }

  let currentPhase="", localInput={},
    targets = [],
    me = null,
    racing = false,
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
      const c=cars.get(t.id);if(!c)continue;
      if(!c.target || c.target.respawn!==t.respawn || currentPhase!==state.phase && state.phase==='countdown'){
        c.samples=[];c.root.position.set(t.x,t.y,t.z);c.root.rotation.y=t.yaw;
        c.fadeAt=performance.now();
      }
      c.samples.push({...t,at:performance.now()});if(c.samples.length>12)c.samples.shift();c.target=t;
    }
    currentPhase=state.phase;

    const mine = targets.find((c) => c.id === me);
    gateMeshes.forEach((g, i) =>
      g.setEnabled(!!mine && i === (mine.passed + 1) % 24),
    );
  }

  engine.runRenderLoop(() => {
    const now = performance.now(),
      dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    smokeClock+=dt;
    for(const puff of smoke)if(puff.life>0){puff.life-=dt;puff.mesh.position.y+=dt*.65;puff.mesh.scaling.scaleInPlace(1+dt*.55);puff.mesh.visibility=Math.max(0,puff.life/1.2);if(puff.life<=0)puff.mesh.setEnabled(false);}

    for (const c of cars.values()) {
      const t = c.target;
      if (!t) continue;
      const alpha=1-Math.exp(-18*dt);
      const renderAt=now-40;
      let left=c.samples[0],right=c.samples.at(-1);
      for(let i=1;i<c.samples.length;i++)if(c.samples[i].at>=renderAt){left=c.samples[i-1];right=c.samples[i];break;}
      const amount=Math.max(0,Math.min(1,(renderAt-left.at)/Math.max(1,right.at-left.at)));
      c.root.position.set(left.x+(right.x-left.x)*amount,left.y+(right.y-left.y)*amount,left.z+(right.z-left.z)*amount);
      c.root.rotation.y=left.yaw+Math.atan2(Math.sin(right.yaw-left.yaw),Math.cos(right.yaw-left.yaw))*amount;
      // No unbounded extrapolation: contacts stay on a common interpolation timeline.
      c.brakeLights.forEach(light=>light.setEnabled(!!t.braking));
      const visualSteer=c.root.name===me?((localInput.left?-1:0)+(localInput.right?1:0)):t.steer;
      if(t.drift&&t.speed>10&&smokeClock>.035){
        const puff=smoke[smokeCursor++%smoke.length];puff.life=1.2;puff.mesh.setEnabled(true);puff.mesh.position.copyFrom(c.root.position);puff.mesh.position.x-=Math.sin(c.root.rotation.y)*1.7;puff.mesh.position.z-=Math.cos(c.root.rotation.y)*1.7;puff.mesh.position.y=.28;puff.mesh.scaling.setAll(.6);smokeClock=0;
      }
      // Dynamic suspension roll based on turning Gs
      const targetRoll = -t.steer * Math.min(1, t.speed / 28) * 0.07;
      c.chassis.rotation.z += (targetRoll - c.chassis.rotation.z) * alpha;

      for (const w of c.wheels) {
        w.wheel.rotation.x += (t.speed * dt) / 0.38;
        w.pivot.rotation.y += ((w.front ? visualSteer * .32 : 0)-w.pivot.rotation.y)*alpha;
      }
    }

    // Resolve tiny interpolation penetrations without altering server race state.
    const visible=[...cars.values()];
    for(let pass=0;pass<3;pass++)for(let i=0;i<visible.length;i++)for(let j=i+1;j<visible.length;j++){
      const a=visible[i].root,b=visible[j].root,hit=overlap({x:a.position.x,z:a.position.z,yaw:a.rotation.y},{x:b.position.x,z:b.position.z,yaw:b.rotation.y});
      if(hit){const correction=Math.min(hit.depth+.002,.35)*.5;a.position.x-=hit.x*correction;a.position.z-=hit.z*correction;b.position.x+=hit.x*correction;b.position.z+=hit.z*correction;}
    }
    const mine = cars.get(me);
    if (racing && mine && mine.target) {
      const p = mine.root.position,
        yaw = mine.root.rotation.y,
        speed = mine.target.speed;

      // Smooth chase camera
      const camDist = 10.8 + Math.min(1.6, speed * 0.03);
      const camHeight = 4.3 + Math.min(0.5, speed * 0.01);

      const desired = new Vector3(
        p.x - Math.sin(yaw) * camDist,
        p.y + camHeight,
        p.z - Math.cos(yaw) * camDist,
      );

      camera.position = Vector3.Lerp(
        camera.position,
        desired,
        1 - Math.exp(-7 * dt),
      );

      // Look-ahead target
      const lookDist = 7 + Math.min(5, speed * 0.1);
      const lookTarget = new Vector3(
        p.x + Math.sin(yaw) * lookDist,
        p.y + 1.2,
        p.z + Math.cos(yaw) * lookDist,
      );
      camera.setTarget(lookTarget);

      // Speed FOV expansion
      const targetFov = 0.82 + Math.min(0.12, (speed / 50) * 0.12);
      camera.fov += (targetFov - camera.fov) * (1 - Math.exp(-5 * dt));
    } else {
      // Cinematic orbit in lobby / results
      const t = now * 0.00015;
      camera.fov = 0.82;
      camera.position.set(120 + Math.sin(t) * 75, 55, Math.cos(t) * 75);
      camera.setTarget(new Vector3(120, 2, 0));
    }

    scene.render();
    // Constant-size labels are projected after camera updates, then culled near the lens/HUD.
    const occupied=[];
    const viewport=camera.viewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight());
    for(const c of [...cars.values()].sort((a,b)=>Vector3.DistanceSquared(a.root.position,camera.position)-Vector3.DistanceSquared(b.root.position,camera.position))){
      const anchor=c.root.position.add(new Vector3(0,2.15,0));
      const projected=Vector3.Project(anchor,Matrix.Identity(),scene.getTransformMatrix(),viewport);
      const distance=Vector3.Distance(anchor,camera.position);
      const x=projected.x/engine.getRenderWidth()*innerWidth,y=projected.y/engine.getRenderHeight()*innerHeight;
      const isMine=c.root.name===me;
      const hidden=!racing||currentPhase==='results'||isMine||projected.z<0||projected.z>1||distance<6||distance>160||x<90||x>innerWidth-90||y<180||y>innerHeight-100||occupied.some(p=>Math.abs(p.x-x)<150&&Math.abs(p.y-y)<36);
      c.label.hidden=hidden;
      if(!hidden){occupied.push({x,y});c.label.style.transform='translate(-50%,-100%) translate('+x+'px,'+y+'px)';c.label.style.opacity=String(Math.min(1,(160-distance)/30));}
    }
  });

  window.addEventListener("resize", () => engine.resize());

  return {
    update,
    input: keys=>{localInput={...keys};},
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
