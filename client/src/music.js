// Original 64 BPM ambient score. No samples, recordings or commercial melodies.
export class AmbientMusic {
  constructor(ctx, output, track = (n) => n) {
    this.ctx = ctx;
    this.output = output;
    this.track = track;
    this.voices = new Set();
    this.running = false;
    this.beat = 0;
    this.next = 0;
    this.timer = null;
  }
  start() {
    if (this.running) return;
    this.running = true;
    this.next = this.ctx.currentTime + 0.08;
    this.timer = setInterval(() => this.schedule(), 100);
    this.schedule();
  }
  schedule() {
    if (!this.running || this.ctx.state !== "running") return;
    const now = this.ctx.currentTime;
    if (this.next < now - 0.2) this.next = now + 0.08; // never replay a stalled tab's backlog
    while (this.next < now + 0.25) {
      const bar = Math.floor(this.beat / 8),
        step = this.beat % 8;
      const root = [50, 48, 53, 46][bar % 4],
        scale = [0, 1, 5, 7, 10];
      if (step === 0) {
        this.note(root - 12, this.next, 7.2, "pad", 0.09);
        this.note(root + 7, this.next, 6.8, "pad", 0.045);
      }
      if ([0, 3, 5].includes(step))
        this.note(
          root + 12 + scale[(bar * 3 + step) % 5],
          this.next,
          2.1,
          "pluck",
          0.1,
        );
      if (step === 2 && bar % 2 === 0)
        this.note(
          root + 24 + scale[(bar + 2) % 5],
          this.next,
          3.5,
          "flute",
          0.055,
        );
      if (step === 6)
        this.note(
          root + 12 + scale[(bar + 1) % 5],
          this.next,
          2.8,
          "piano",
          0.055,
        );
      if (step === 1 || step === 5)
        this.note(38, this.next, 0.22, "brush", 0.028);
      this.beat++;
      this.next += 60 / 64;
    }
  }
  note(midi, start, duration, kind, volume) {
    if (this.voices.size >= 24) return;
    const ctx = this.ctx,
      osc = this.track(ctx.createOscillator()),
      gain = this.track(ctx.createGain()),
      filter = this.track(ctx.createBiquadFilter());
    osc.type = kind === "pluck" || kind === "piano" ? "triangle" : "sine";
    osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    filter.type = "lowpass";
    filter.frequency.value =
      kind === "pluck" ? 2700 : kind === "piano" ? 1600 : 900;
    const attack = kind === "pad" ? 1.3 : kind === "flute" ? 0.28 : 0.012;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    gain.gain.linearRampToValueAtTime(0, start + duration + 0.06);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.output);
    const voice = { osc, gain, filter };
    this.voices.add(voice);
    osc.addEventListener("ended", () => {
      osc.disconnect();
      filter.disconnect();
      gain.disconnect();
      this.voices.delete(voice);
    });
    osc.start(start);
    osc.stop(start + duration + 0.07);
  }
  stop() {
    this.running = false;
    clearInterval(this.timer);
    this.timer = null;
    for (const v of this.voices) {
      const t = this.ctx.currentTime;
      v.gain.gain.cancelScheduledValues(t);
      v.gain.gain.setTargetAtTime(0, t, 0.02);
      try {
        v.osc.stop(t + 0.15);
      } catch {}
    }
  }
  dispose() {
    this.stop();
  }
}
