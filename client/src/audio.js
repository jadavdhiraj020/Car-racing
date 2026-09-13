// Pure Web Audio API Procedural Engine Synthesizer
// Completely self-contained - zero external assets or worklet files needed

export class EngineAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.subOsc = null;
    this.coreOsc = null;
    this.roarOsc = null;
    this.filter = null;
    this.skidGain = null;
    this.skidFilter = null;
    this.skidSource = null;
    this.rpm = 950;
    this.gear = 1;
    this.previous = performance.now();
    this.shiftUntil = 0;
    this.enabled = false;
    this.lastImpact = 0;
  }

  async init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      this.enabled = true;
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;

    // Master limiter / compressor
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -10;
    limiter.knee.value = 12;
    limiter.ratio.value = 8;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.15;
    limiter.connect(ctx.destination);

    // Master volume gain
    this.master = ctx.createGain();
    this.master.gain.value = 0.45;
    this.master.connect(limiter);

    // Effects gain (beeps, collisions)
    this.effects = ctx.createGain();
    this.effects.gain.value = 0.4;
    this.effects.connect(limiter);

    // Resonant intake/exhaust low-pass filter
    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 650;
    this.filter.Q.value = 3.5;

    // Distortion waveshaper for raw exhaust grit
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = ((3 + 20) * x * 20 * (Math.PI / 180)) / (Math.PI + 20 * Math.abs(x));
    }
    shaper.curve = curve;
    this.filter.connect(shaper);
    shaper.connect(this.master);

    // 1. Sub-bass fundamental rumble
    this.subOsc = ctx.createOscillator();
    this.subOsc.type = "sawtooth";
    this.subGain = ctx.createGain();
    this.subGain.gain.value = 0.35;
    this.subOsc.connect(this.subGain);
    this.subGain.connect(this.filter);

    // 2. Combustion core harmonic
    this.coreOsc = ctx.createOscillator();
    this.coreOsc.type = "triangle";
    this.coreGain = ctx.createGain();
    this.coreGain.gain.value = 0.4;
    this.coreOsc.connect(this.coreGain);
    this.coreGain.connect(this.filter);

    // 3. High-rev exhaust rasp
    this.roarOsc = ctx.createOscillator();
    this.roarOsc.type = "sawtooth";
    this.roarGain = ctx.createGain();
    this.roarGain.gain.value = 0.22;
    this.roarOsc.connect(this.roarGain);
    this.roarGain.connect(this.filter);

    const now = ctx.currentTime;
    this.subOsc.start(now);
    this.coreOsc.start(now);
    this.roarOsc.start(now);

    // Procedural Tire Screech Noise Loop
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    this.skidSource = ctx.createBufferSource();
    this.skidSource.buffer = noiseBuffer;
    this.skidSource.loop = true;

    this.skidFilter = ctx.createBiquadFilter();
    this.skidFilter.type = "bandpass";
    this.skidFilter.frequency.value = 1100;
    this.skidFilter.Q.value = 2.8;

    this.skidGain = ctx.createGain();
    this.skidGain.gain.value = 0;

    this.skidSource.connect(this.skidFilter);
    this.skidFilter.connect(this.skidGain);
    this.skidGain.connect(limiter);
    this.skidSource.start(now);

    this.enabled = true;
    if (ctx.state === "suspended") await ctx.resume();
  }

  update(speed, throttle, brake, drift, racing, finished) {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.previous) / 1000);
    this.previous = now;

    // Progressive gearbox simulation (1 to 6 gears)
    const gearThresholds = [10, 18, 27, 36, 45];
    let gear = this.gear;
    if (speed > (gearThresholds[gear - 1] ?? Infinity) && gear < 6) gear++;
    if (gear > 1 && speed < gearThresholds[gear - 2] - 3) gear--;
    if (!racing) gear = 1;
    if (gear !== this.gear) {
      this.shiftUntil = now + 90;
      this.gear = gear;
      this.beep(gear > 1 ? 120 : 180, 0.05, 0.3);
    }

    const ratios = [1, 0.65, 0.48, 0.37, 0.3, 0.25];
    const ratio = ratios[gear - 1];
    const targetRpm = Math.min(
      9500,
      Math.max(900, 900 + speed * 160 * ratio + (throttle ? 1800 : 0) - (brake ? 400 : 0))
    );
    this.rpm += (targetRpm - this.rpm) * (1 - Math.exp(-dt * 14));

    if (!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime;
    const isShifting = now < this.shiftUntil;

    // Pitch calculations
    const baseFreq = Math.max(30, 32 + (this.rpm / 9500) * 145);
    const cut = isShifting ? 0.25 : 1;

    this.subOsc.frequency.setTargetAtTime(baseFreq, t, 0.03);
    this.coreOsc.frequency.setTargetAtTime(baseFreq * 2, t, 0.03);
    this.roarOsc.frequency.setTargetAtTime(baseFreq * 3, t, 0.03);

    // Throttle modulation on filter and gain
    const targetFilter = Math.min(5200, Math.max(350, 450 + (this.rpm / 9500) * 3600 * (throttle ? 1.3 : 0.65)));
    this.filter.frequency.setTargetAtTime(targetFilter, t, 0.04);

    const masterTarget = racing && !finished ? (throttle ? 0.52 * cut : 0.32 * cut) : 0.18;
    this.master.gain.setTargetAtTime(masterTarget, t, 0.05);

    // Tire skid sound
    const isSkidding = (drift && speed > 7) || (brake && speed > 18);
    const targetSkid = isSkidding ? (drift ? 0.35 : 0.22) : 0;
    this.skidGain.gain.setTargetAtTime(targetSkid, t, 0.04);
  }

  beep(frequency = 600, duration = 0.12, volume = 1) {
    if (!this.ctx || !this.effects || !this.enabled) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime;
    o.type = "sine";
    o.frequency.setValueAtTime(frequency, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * 0.65), t + duration);
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
    if (amount > 0.15 && performance.now() - this.lastImpact > 220) {
      this.lastImpact = performance.now();
      this.beep(70 + amount * 60, 0.14, amount);
    }
  }

  celebrate() {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => this.beep([523, 659, 784, 1047][i], 0.35, 0.8), i * 150);
    }
  }

  mute() {
    this.enabled = false;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
    }
  }
}
