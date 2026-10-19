// Browser-native Web Audio: no audio downloads and no external sound library.
// Browsers unlock sound after a real key press / tap. Game remains playable if sound is unavailable.
const SFX = {
  ctx: null,
  muted: false,
  enabled: false,
  lastStep: -1,
  unlock() {
    if (this.muted) return;
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return;
        this.ctx = new Ctor();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      this.enabled = true;
    } catch (e) { this.enabled = false; }
  },
  tone(freq, duration, type = 'sine', volume = .06, delay = 0, endFreq = null) {
    const c = this.ctx;
    if (!this.enabled || !c || this.muted || c.state !== 'running') return;
    const start = c.currentTime + delay;
    const osc = c.createOscillator(), gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (endFreq != null) osc.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq), start + duration);
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), start + Math.min(.018,duration/4));
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(start); osc.stop(start + duration + .015);
  },
  // Gentle, alternating footsteps. Limit rate independently of frame-rate.
  step(sneaking = false) {
    const now = performance.now();
    if (now - this.lastStep < (sneaking ? 400 : 235)) return;
    this.lastStep = now;
    this.tone(sneaking ? 118 : 155, sneaking ? .035 : .055, 'triangle', sneaking ? .011 : .028, 0, 70);
  },
  fridge() {
    this.tone(690,.075,'triangle',.055,0,390);
    this.tone(220,.16,'sine',.028,.09,170);
  },
  meow() {
    this.tone(590,.20,'sawtooth',.065,0,930);
    this.tone(930,.33,'sawtooth',.052,.19,420);
    this.tone(470,.21,'sine',.035,.48,280);
  },
  win() {
    const notes=[523.25,659.25,783.99,1046.5];
    notes.forEach((freq,i)=>this.tone(freq,.23,'sine',.066,i*.17,freq));
  },
  toggle() { this.muted=!this.muted; if(!this.muted) this.unlock(); return this.muted; }
};
