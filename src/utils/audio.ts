// Web Audio API Synthesizer for educational game SFX without external audio asset dependencies

class SoundEffects {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio fallback silent
    }
  }

  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch {
      // ignore
    }
  }

  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.setValueAtTime(180, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }

  public playFlip() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {
      // ignore
    }
  }

  public playFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Chord progression fanfare (C major -> G major -> C high)
      const chordNotes = [
        { freq: 523.25, time: 0.0, dur: 0.15 }, // C5
        { freq: 659.25, time: 0.15, dur: 0.15 }, // E5
        { freq: 783.99, time: 0.30, dur: 0.2 }, // G5
        { freq: 659.25, time: 0.50, dur: 0.15 }, // E5
        { freq: 1046.50, time: 0.65, dur: 0.6 }, // C6
      ];

      chordNotes.forEach(({ freq, time, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur);
      });
    } catch {
      // ignore
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * 지글거리는 소리 (볶기 - 팬에 기름 두르고 볶는 소리)
   * High-frequency crackle and oil sizzling synthesized via filtered noise & micro-pops
   */
  public playSizzle(duration: number = 1.3) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = Math.floor(sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate sizzling white/crackling noise
      for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        // Periodic random hot oil crackle bursts
        if (Math.random() < 0.012) {
          white += (Math.random() * 2 - 1) * 2.2;
        }
        data[i] = white;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to isolate crispy oil sizzle frequencies (2500Hz - 4500Hz)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      // Highpass filter to eliminate muddy low frequencies
      const hpFilter = this.ctx.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.setValueAtTime(1600, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.08);
      gain.gain.setValueAtTime(0.20, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(hpFilter);
      hpFilter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch {
      // fallback
    }
  }

  /**
   * 보글보글 끓는 소리 (끓이기 - 육수 및 국물 끓는 소리)
   * Water simmering noise floor + series of rising frequency bubble pops
   */
  public playBoil(duration: number = 1.4) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Simmering liquid bed
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = Math.floor(sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const lpFilter = this.ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(420, now);
      lpFilter.Q.setValueAtTime(2.2, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.1, now + 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(lpFilter);
      lpFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);

      // 2. Sequential bubble pops (characteristic "bloop-bloop" sound of boiling stew)
      const bubbleCount = 12;
      for (let i = 0; i < bubbleCount; i++) {
        const bubbleTime = now + (i / bubbleCount) * (duration - 0.25) + (Math.random() * 0.09);
        const osc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();

        // Water droplet / bubble upward chirp
        const baseFreq = 240 + Math.random() * 280;
        const peakFreq = baseFreq + 260 + Math.random() * 320;
        const popDuration = 0.045 + Math.random() * 0.035;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, bubbleTime);
        osc.frequency.exponentialRampToValueAtTime(peakFreq, bubbleTime + popDuration);

        bGain.gain.setValueAtTime(0.001, bubbleTime);
        bGain.gain.linearRampToValueAtTime(0.14 + Math.random() * 0.08, bubbleTime + 0.01);
        bGain.gain.exponentialRampToValueAtTime(0.001, bubbleTime + popDuration);

        osc.connect(bGain);
        bGain.connect(this.ctx.destination);

        osc.start(bubbleTime);
        osc.stop(bubbleTime + popDuration + 0.01);
      }
    } catch {
      // fallback
    }
  }

  /**
   * Helper method to play appropriate cooking sound based on Korean/English cooking method name
   */
  public playCookingSound(method: string) {
    if (method.includes('볶') || method.toLowerCase().includes('stir') || method.toLowerCase().includes('sizzle')) {
      this.playSizzle();
    } else if (method.includes('끓') || method.toLowerCase().includes('boil') || method.toLowerCase().includes('bubble')) {
      this.playBoil();
    } else {
      this.playClick();
    }
  }
}

export const sfx = new SoundEffects();
