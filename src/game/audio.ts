/**
 * Web Audio API Synthesizer for Cube Code
 * Procedural tactile chimes, sweeps, and feedback sounds with zero external assets.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Check saved mute preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cube_code_muted');
      this.muted = saved === 'true';
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cube_code_muted', String(muted));
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /**
   * Tactile slide click/whoosh
   */
  public playSlide() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;

      // Frequency glide 280Hz -> 420Hz
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // AudioContext policy safe catch
    }
  }

  /**
   * Reverse slide / Undo sound
   */
  public playUndo() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const now = this.ctx.currentTime;

      // Frequency descend 440Hz -> 220Hz
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  /**
   * Hint sparkle sound
   */
  public playHint() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const start = now + idx * 0.04;
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.13);
      });
    } catch {}
  }

  /**
   * Victory harmonic fanfare
   */
  public playVictory() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const chords = [
        { freqs: [440, 554.37, 659.25], delay: 0 },       // A major
        { freqs: [493.88, 622.25, 739.99], delay: 0.12 }, // B major
        { freqs: [587.33, 739.99, 880], delay: 0.25 },    // D major
        { freqs: [659.25, 830.61, 987.77, 1318.5], delay: 0.4 }, // E chord
      ];

      const now = this.ctx.currentTime;

      chords.forEach((chord) => {
        const time = now + chord.delay;
        chord.freqs.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = 'triangle';
          osc.frequency.value = freq;

          gain.gain.setValueAtTime(0.07, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(time);
          osc.stop(time + 0.38);
        });
      });
    } catch {}
  }

  /**
   * Simple UI click
   */
  public playClick() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;

      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }
}

export const sound = new SoundController();
