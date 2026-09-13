// Professional Web Audio API Procedural F1 Racing Audio Synthesizer
// Pure procedural synthesis - zero external audio assets required

export class EngineAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.effects = null;

    // Combustion engine nodes
    this.subOsc = null;
    this.midOsc = null;
    this.highOsc = null;
    this.raspOsc = null;
    this.turboOsc = null;
    this.engineGain = null;
    this.turboGain = null;
    this.screamerFilter = null;
    this.intakeFilter = null;
    this.exhaustShaper = null;

    // Wind & Tire noise
    this.windGain = null;
    this.windFilter = null;
    this.skidGain = null;
    this.skidFilter = null;

    // Kerb vibration
    this.kerbOsc = null;
    this.kerbGain = null;

    // State simulation
    this.rpm = 950;
    this.idleRpm = 1100;
    this.maxRpm = 13500;
    this.gear = 1;
    this.boost = 0;
    this.previous = performance.now();
    this.shiftUntil = 0;
    this.shiftType = "";
    this.enabled = false;
    this.lastImpact = 0;
    this.lastPop = 0;
    this.lastThrottle = false;
    this.remoteCars = new Map();
  }

  async init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      this.enabled = true;
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error("Web Audio unavailable");
    const ctx = new AC();
    this.ctx = ctx;

    // Master bus with multiband limiting
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -12;
    limiter.knee.value = 8;
    limiter.ratio.value = 10;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.12;
    limiter.connect(ctx.destination);

    this.master = ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(limiter);

    this.effects = ctx.createGain();
    this.effects.gain.value = 0.5;
    this.effects.connect(limiter);

    // Engine exhaust distortion wave shaper for aggressive F1 rasp
    this.exhaustShaper = ctx.createWaveShaper();
    const curve = new Float32Array(512);
    for (let i = 0; i < 512; i++) {
      const x = (i * 2) / 512 - 1;
      curve[i] = Math.tanh(2.4 * x);
    }
    this.exhaustShaper.curve = curve;

    // Screamer resonance filter (F1 tuned exhaust header acoustic formant)
    this.screamerFilter = ctx.createBiquadFilter();
    this.screamerFilter.type = "bandpass";
    this.screamerFilter.frequency.value = 1800;
    this.screamerFilter.Q.value = 2.4;

    // Intake throat lowpass filter
    this.intakeFilter = ctx.createBiquadFilter();
    this.intakeFilter.type = "lowpass";
    this.intakeFilter.frequency.value = 1200;
    this.intakeFilter.Q.value = 2.0;

    this.engineGain = ctx.createGain();
    this.engineGain.gain.value = 0.4;

    // Route engine oscillators:
    // Sub/mid/high -> Intake Filter -> Shaper -> Screamer Filter & Master
    this.intakeFilter.connect(this.exhaustShaper);
    this.exhaustShaper.connect(this.screamerFilter);
    this.screamerFilter.connect(this.engineGain);
    this.exhaustShaper.connect(this.engineGain);
    this.engineGain.connect(this.master);

    // 1. Sub-bass fundamental (chassis shudder)
    this.subOsc = ctx.createOscillator();
    this.subOsc.type = "sawtooth";
    this.subGain = ctx.createGain();
    this.subGain.gain.value = 0.32;
    this.subOsc.connect(this.subGain);
    this.subGain.connect(this.intakeFilter);

    // 2. Mid harmonic combustion growl (2nd & 3rd harmonics)
    this.midOsc = ctx.createOscillator();
    this.midOsc.type = "sawtooth";
    this.midGain = ctx.createGain();
    this.midGain.gain.value = 0.45;
    this.midOsc.connect(this.midGain);
    this.midGain.connect(this.intakeFilter);

    // 3. High-RPM screamer harmonic (high pulse wave)
    this.highOsc = ctx.createOscillator();
    this.highOsc.type = "triangle";
    this.highGain = ctx.createGain();
    this.highGain.gain.value = 0.35;
    this.highOsc.connect(this.highGain);
    this.highGain.connect(this.intakeFilter);

    // 4. Combustion cylinder rasp (sharp sawtooth 4th harmonic)
    this.raspOsc = ctx.createOscillator();
    this.raspOsc.type = "sawtooth";
    this.raspGain = ctx.createGain();
    this.raspGain.gain.value = 0.28;
    this.raspOsc.connect(this.raspGain);
    this.raspGain.connect(this.intakeFilter);

    // 5. Turbocharger spool whistle
    this.turboOsc = ctx.createOscillator();
    this.turboOsc.type = "sine";
    this.turboGain = ctx.createGain();
    this.turboGain.gain.value = 0.0;
    this.turboFilter = ctx.createBiquadFilter();
    this.turboFilter.type = "bandpass";
    this.turboFilter.frequency.value = 3200;
    this.turboFilter.Q.value = 4.0;
    this.turboOsc.connect(this.turboFilter);
    this.turboFilter.connect(this.turboGain);
    this.turboGain.connect(this.master);

    // 6. Wind noise generator (high speed rush)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    this.windFilter = ctx.createBiquadFilter();
    this.windFilter.type = "bandpass";
    this.windFilter.frequency.value = 800;
    this.windFilter.Q.value = 1.2;

    this.windGain = ctx.createGain();
    this.windGain.gain.value = 0;

    noiseSource.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.master);

    // 7. Tire skid / drift noise
    const skidSource = ctx.createBufferSource();
    skidSource.buffer = noiseBuffer;
    skidSource.loop = true;

    this.skidFilter = ctx.createBiquadFilter();
    this.skidFilter.type = "bandpass";
    this.skidFilter.frequency.value = 1350;
    this.skidFilter.Q.value = 3.2;

    this.skidGain = ctx.createGain();
    this.skidGain.gain.value = 0;

    skidSource.connect(this.skidFilter);
    this.skidFilter.connect(this.skidGain);
    this.skidGain.connect(this.master);

    // 8. Kerb rumble oscillator
    this.kerbOsc = ctx.createOscillator();
    this.kerbOsc.type = "sine";
    this.kerbOsc.frequency.value = 46;
    this.kerbGain = ctx.createGain();
    this.kerbGain.gain.value = 0;
    this.kerbOsc.connect(this.kerbGain);
    this.kerbGain.connect(this.master);

    // Start running oscillators
    const now = ctx.currentTime;
    this.subOsc.start(now);
    this.midOsc.start(now);
    this.highOsc.start(now);
    this.raspOsc.start(now);
    this.turboOsc.start(now);
    noiseSource.start(now);
    skidSource.start(now);
    this.kerbOsc.start(now);

    this.enabled = true;
    if (ctx.state === "suspended") await ctx.resume();
  }

  update(speed, throttle, brake, drift, racing, finished, onKerb = false) {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.previous) / 1000);
    this.previous = now;

    // F1 sequential 6-speed gearbox simulation
    const gearThresholds = [12, 21, 30, 39, 47];
    let gear = this.gear;

    const safeSpeed = Number.isFinite(speed) ? speed : 0;
    if (safeSpeed > (gearThresholds[gear - 1] ?? Infinity) && gear < 6) {
      // Upshift: ignition cut and exhaust crackle
      gear++;
      this.gear = gear;
      this.shiftUntil = now + 65;
      this.shiftType = "up";
      this.exhaustPop(0.7);
    } else if (gear > 1 && safeSpeed < gearThresholds[gear - 2] - 3.5) {
      // Downshift: rev-match throttle blip
      gear--;
      this.gear = gear;
      this.shiftUntil = now + 80;
      this.shiftType = "down";
      this.exhaustPop(0.4);
    }

    if (!racing) gear = 1;
    this.gear = gear;

    // Calculate realistic F1 RPM curve
    const gearRatios = [1.0, 0.72, 0.54, 0.42, 0.34, 0.28];
    const ratio = gearRatios[gear - 1] ?? 0.5;

    let targetRpm = this.idleRpm;
    if (racing && !finished) {
      const driveSpeedRpm = Math.abs(safeSpeed) * 800 * ratio;
      const throttleRpm = throttle ? 1000 : 0;
      const brakeDrop = brake ? 600 : 0;
      targetRpm = Math.min(
        this.maxRpm,
        Math.max(
          this.idleRpm,
          this.idleRpm + driveSpeedRpm + throttleRpm - brakeDrop,
        ),
      );

      // Downshift blip
      if (now < this.shiftUntil && this.shiftType === "down") {
        targetRpm = Math.min(this.maxRpm, targetRpm + 1600);
      }
    }

    // Smooth RPM response
    const rpmAttack = throttle ? 18 : 12;
    this.rpm += (targetRpm - this.rpm) * (1 - Math.exp(-dt * rpmAttack));
    if (!Number.isFinite(this.rpm)) this.rpm = this.idleRpm;

    // Turbo wastegate flutter on off-throttle lift at high boost
    if (this.lastThrottle && !throttle && this.boost > 0.28) {
      this.wastegateFlutter(this.boost);
    }
    this.lastThrottle = throttle;

    // Turbo boost pressure simulation
    const targetBoost = throttle && racing && Math.abs(safeSpeed) > 5 ? 1.0 : 0.0;
    this.boost +=
      (targetBoost - this.boost) * (1 - Math.exp(-dt * (throttle ? 4 : 8)));
    if (!Number.isFinite(this.boost)) this.boost = 0;

    if (!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(racing && !finished ? 0.4 : 0.14, t, 0.06);
    this.effects.gain.setTargetAtTime(0.25, t, 0.03);
    const isShifting = now < this.shiftUntil && this.shiftType === "up";

    // High-RPM rev limiter bouncing at redline
    let limiterCut = 1.0;
    if (this.rpm > 13150 && throttle) {
      limiterCut = Math.sin(now * 0.08) > 0.1 ? 1.0 : 0.06;
      if (limiterCut < 0.5 && Math.random() < 0.25) {
        this.exhaustPop(0.35);
      }
    }

    // F1 engine acoustics: fundamental cylinder firing frequency
    // (V6 at 12,000 RPM fires 600 times per second)
    const baseFreq = Math.max(38, (this.rpm / 60) * 1.5);
    const cut = (isShifting ? 0.15 : 1.0) * limiterCut;

    // Frequency modulation for organic combustion feel
    const jitter = Math.sin(now * 0.08) * 1.5;
    this.subOsc.frequency.setTargetAtTime(baseFreq * 0.5, t, 0.02);
    this.midOsc.frequency.setTargetAtTime(baseFreq + jitter, t, 0.02);
    this.highOsc.frequency.setTargetAtTime(
      baseFreq * 2 + jitter * 1.8,
      t,
      0.02,
    );
    this.raspOsc.frequency.setTargetAtTime(baseFreq * 3, t, 0.02);

    // Turbo whistle tracks boost pressure and RPM
    const turboFreq = 2200 + this.boost * 2400 + (this.rpm / this.maxRpm) * 800;
    this.turboOsc.frequency.setTargetAtTime(turboFreq, t, 0.03);
    this.turboGain.gain.setTargetAtTime(
      racing ? this.boost * 0.14 : 0,
      t,
      0.05,
    );

    // Formant acoustic filters
    const filterCutoff = Math.min(
      7500,
      Math.max(
        450,
        700 + (this.rpm / this.maxRpm) * 5800 * (throttle ? 1.35 : 0.65),
      ),
    );
    this.intakeFilter.frequency.setTargetAtTime(filterCutoff, t, 0.03);
    this.screamerFilter.frequency.setTargetAtTime(
      1400 + (this.rpm / this.maxRpm) * 2200,
      t,
      0.04,
    );

    // Engine volume
    const baseGain = racing && !finished ? (throttle ? 0.62 : 0.38) : 0.22;
    this.engineGain.gain.setTargetAtTime(baseGain * cut, t, 0.03);

    // Aerodynamic high-speed wind roar
    const windIntensity = Math.min(1, Math.max(0, (speed - 15) / 35));
    this.windGain.gain.setTargetAtTime(windIntensity * 0.28, t, 0.06);
    this.windFilter.frequency.setTargetAtTime(
      500 + windIntensity * 1600,
      t,
      0.06,
    );

    // Tire squeal (drift or heavy braking)
    const isDrifting = drift && speed > 8;
    const isLockingBrakes = brake && speed > 16;
    const skidIntensity = isDrifting ? 0.38 : isLockingBrakes ? 0.26 : 0;
    this.skidGain.gain.setTargetAtTime(skidIntensity, t, 0.04);
    this.skidFilter.frequency.setTargetAtTime(
      isDrifting ? 1450 : 1850,
      t,
      0.04,
    );

    // Apex kerb rumble
    const kerbIntensity = onKerb && speed > 6 ? Math.min(0.4, speed / 60) : 0;
    this.kerbGain.gain.setTargetAtTime(kerbIntensity, t, 0.03);
  }

  exhaustPop(intensity = 0.6) {
    if (!this.ctx || !this.effects || !this.enabled) return;
    const now = performance.now();
    if (now - this.lastPop < 90) return;
    this.lastPop = now;

    const t = this.ctx.currentTime;
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();

    popOsc.type = "triangle";
    popOsc.frequency.setValueAtTime(140 + Math.random() * 40, t);
    popOsc.frequency.exponentialRampToValueAtTime(30, t + 0.07);

    popGain.gain.setValueAtTime(intensity * 0.5, t);
    popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    popOsc.connect(popGain);
    popGain.connect(this.effects);

    popOsc.start(t);
    popOsc.stop(t + 0.07);
    popOsc.onended = () => {
      popOsc.disconnect();
      popGain.disconnect();
    };
  }

  wastegateFlutter(boost = 0.5) {
    if (!this.ctx || !this.effects || !this.enabled) return;
    const t = this.ctx.currentTime;
    const bursts = 4;
    for (let i = 0; i < bursts; i++) {
      const delay = i * 0.055;
      const decay = Math.pow(0.55, i);
      const flutterOsc = this.ctx.createOscillator();
      const flutterFilter = this.ctx.createBiquadFilter();
      const flutterGain = this.ctx.createGain();

      flutterOsc.type = "sawtooth";
      flutterOsc.frequency.setValueAtTime(950 - i * 85, t + delay);
      flutterOsc.frequency.exponentialRampToValueAtTime(320, t + delay + 0.045);

      flutterFilter.type = "bandpass";
      flutterFilter.frequency.setValueAtTime(1600 - i * 140, t + delay);
      flutterFilter.Q.value = 5.0;

      flutterGain.gain.setValueAtTime(boost * 0.22 * decay, t + delay);
      flutterGain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.045);

      flutterOsc.connect(flutterFilter);
      flutterFilter.connect(flutterGain);
      flutterGain.connect(this.effects);

      flutterOsc.start(t + delay);
      flutterOsc.stop(t + delay + 0.045);
      flutterOsc.onended = () => {
        flutterOsc.disconnect();
        flutterFilter.disconnect();
        flutterGain.disconnect();
      };
    }
  }

  countdownLight(step) {
    if (!this.ctx || !this.effects || !this.enabled) return;
    const t = this.ctx.currentTime;
    if (step >= 1 && step <= 5) {
      // 5 Red Lights arming tones
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(460, t + 0.12);
      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(this.effects);
      osc.start(t);
      osc.stop(t + 0.12);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    } else if (step === 0) {
      // LIGHTS OUT / GO!
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = "sine";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(920, t);
      osc2.frequency.setValueAtTime(1150, t);
      gain.gain.setValueAtTime(0.65, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.effects);
      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.38);
      osc2.stop(t + 0.38);
      osc2.onended = () => {
        osc1.disconnect();
        osc2.disconnect();
        gain.disconnect();
      };
    }
  }

  beep(frequency = 600, duration = 0.12, volume = 1) {
    if (!this.ctx || !this.effects || !this.enabled) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime;
    o.type = "sine";
    o.frequency.setValueAtTime(frequency, t);
    o.frequency.exponentialRampToValueAtTime(
      Math.max(40, frequency * 0.65),
      t + duration,
    );
    g.gain.setValueAtTime(volume * 0.45, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.connect(g);
    g.connect(this.effects);
    o.start(t);
    o.stop(t + duration);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  }

  impact(amount) {
    if (amount > 0.12 && performance.now() - this.lastImpact > 180) {
      this.lastImpact = performance.now();
      const t = this.ctx?.currentTime;
      if (!t || !this.enabled) return;

      // Heavy body/barrier thud
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(80 + amount * 60, t);
      o.frequency.exponentialRampToValueAtTime(25, t + 0.16);
      g.gain.setValueAtTime(Math.min(0.8, amount * 0.7), t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      o.connect(g);
      g.connect(this.effects);
      o.start(t);
      o.stop(t + 0.16);
      o.onended = () => {
        o.disconnect();
        g.disconnect();
      };
    }
  }

  celebrate() {
    if (!this.ctx || !this.effects || !this.enabled) return;
    // Grand Prix podium fanfare
    const chords = [
      [523.25, 659.25, 783.99], // C
      [587.33, 739.99, 880.0], // D
      [659.25, 830.61, 987.77], // E
      [1046.5, 1318.5, 1567.98], // C octave
    ];
    chords.forEach((chord, step) => {
      setTimeout(() => {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        chord.forEach((freq) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.type = "triangle";
          o.frequency.setValueAtTime(freq, t);
          g.gain.setValueAtTime(0.35, t);
          g.gain.exponentialRampToValueAtTime(
            0.001,
            t + (step === 3 ? 0.8 : 0.28),
          );
          o.connect(g);
          g.connect(this.effects);
          o.start(t);
          o.stop(t + (step === 3 ? 0.8 : 0.28));
          o.onended = () => {
            o.disconnect();
            g.disconnect();
          };
        });
      }, step * 200);
    });
  }

  updateRemoteCar(id, carPos, camPos, speed, throttle) {
    if (!this.ctx || !this.enabled) return;
    if (
      !carPos ||
      !camPos ||
      !Number.isFinite(carPos.x) ||
      !Number.isFinite(carPos.y) ||
      !Number.isFinite(carPos.z) ||
      !Number.isFinite(camPos.x) ||
      !Number.isFinite(camPos.y) ||
      !Number.isFinite(camPos.z)
    )
      return;
    const t = this.ctx.currentTime;
    if (Math.hypot(carPos.x - camPos.x, carPos.z - camPos.z) > 90) {
      this.removeRemoteCar(id);
      return;
    }
    let node = this.remoteCars.get(id);
    if (!node) {
      try {
        const panner = this.ctx.createPanner();
        panner.panningModel = "HRTF";
        panner.distanceModel = "exponential";
        panner.refDistance = 4;
        panner.maxDistance = 90;
        panner.rolloffFactor = 1.1;

        const osc = this.ctx.createOscillator();
        osc.type = "sawtooth";

        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 850;
        filter.Q.value = 2.2;

        const gain = this.ctx.createGain();
        gain.gain.value = 0;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(panner);
        panner.connect(this.master);

        osc.start(t);
        node = { panner, osc, filter, gain };
        this.remoteCars.set(id, node);
      } catch {
        return;
      }
    }

    try {
      if (node.panner.positionX) {
        node.panner.positionX.setTargetAtTime(carPos.x, t, 0.04);
        node.panner.positionY.setTargetAtTime(carPos.y, t, 0.04);
        node.panner.positionZ.setTargetAtTime(-carPos.z, t, 0.04);
      } else if (node.panner.setPosition) {
        node.panner.setPosition(carPos.x, carPos.y, -carPos.z);
      }

      const safeSpeed = Number.isFinite(speed) ? Math.max(0, speed) : 0;
      const freq = Math.max(50, 48 + safeSpeed * 4.6);
      node.osc.frequency.setTargetAtTime(freq, t, 0.04);
      node.filter.frequency.setTargetAtTime(
        Math.min(2800, 600 + safeSpeed * 35),
        t,
        0.04,
      );
      const targetVol = Math.min(
        0.32,
        (safeSpeed / 45) * 0.32 * (throttle ? 1.0 : 0.6),
      );
      node.gain.gain.setTargetAtTime(targetVol, t, 0.04);
    } catch {}
  }

  removeRemoteCar(id) {
    const node = this.remoteCars.get(id);
    if (!node) return;
    try {
      node.osc.stop();
      node.osc.disconnect();
      node.filter.disconnect();
      node.gain.disconnect();
      node.panner.disconnect();
    } catch {}
    this.remoteCars.delete(id);
  }

  listener(position, forward) {
    if (!this.ctx || !this.enabled) return;
    if (
      !position ||
      !forward ||
      !Number.isFinite(position.x) ||
      !Number.isFinite(position.y) ||
      !Number.isFinite(position.z) ||
      !Number.isFinite(forward.x) ||
      !Number.isFinite(forward.y) ||
      !Number.isFinite(forward.z)
    )
      return;
    const forwardLen = Math.hypot(forward.x, forward.y, forward.z);
    if (forwardLen < 0.001) return;
    const l = this.ctx.listener,
      t = this.ctx.currentTime;
    try {
      if (l.forwardX) {
        const params = {
          positionX: position.x,
          positionY: position.y,
          positionZ: -position.z,
          forwardX: forward.x,
          forwardY: forward.y,
          forwardZ: -forward.z,
          upX: 0,
          upY: 1,
          upZ: 0,
        };
        for (const [key, value] of Object.entries(params)) {
          if (l[key]?.setTargetAtTime && Number.isFinite(value)) {
            l[key].setTargetAtTime(value, t, 0.03);
          }
        }
      } else if (l.setPosition) {
        l.setPosition(position.x, position.y, -position.z);
        l.setOrientation(forward.x, forward.y, -forward.z, 0, 1, 0);
      }
    } catch {}
  }
  silence() {
    if (this.master && this.ctx)
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
    for (const id of [...this.remoteCars.keys()]) this.removeRemoteCar(id);
  }
  mute() {
    this.enabled = false;
    if (this.effects && this.ctx)
      this.effects.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
    }
    for (const id of this.remoteCars.keys()) {
      this.removeRemoteCar(id);
    }
  }
}
