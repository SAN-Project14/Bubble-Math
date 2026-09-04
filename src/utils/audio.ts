/**
 * Web Audio API procedural sound synthesizer and music generator.
 * Completely self-contained: no external audio assets needed, 100% reliable offline.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  
  private isMusicEnabled = true;
  private isSfxEnabled = true;
  private musicVolume = 0.78;
  private sfxVolume = 0.7;

  // Background music scheduling
  private currentMusicTrack: 'menu' | 'gameplay' | 'zen' | 'results' | null = null;
  private musicIntervalId: number | null = null;
  private musicStep = 0;

  constructor() {
    // Lazy AudioContext initialization on first user interaction
    const unlockAudio = () => {
      this.initContext();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('pointerdown', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.isMusicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.isSfxEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSettings(music: boolean, sfx: boolean, musicVol = 0.78, sfxVol = 0.7) {
    this.isMusicEnabled = music;
    this.isSfxEnabled = sfx;
    this.musicVolume = musicVol;
    this.sfxVolume = sfxVol;

    if (this.ctx && this.musicGain && this.sfxGain) {
      const t = this.ctx.currentTime;
      this.musicGain.gain.setTargetAtTime(music ? musicVol : 0, t, 0.05);
      this.sfxGain.gain.setTargetAtTime(sfx ? sfxVol : 0, t, 0.05);
    }
  }

  // ================= SFX =================

  public playHover() {
    if (!this.isSfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(620, t + 0.04);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  public playClick() {
    if (!this.isSfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.06);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  public playCorrect(combo = 1) {
    if (!this.isSfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    // Scale root pitch with combo count
    const root = 440 * Math.pow(1.059, Math.min(combo - 1, 8));
    const chord = [root, root * 1.259, root * 1.498, root * 2]; // Major arpeggio + sparkle

    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, t + idx * 0.04 + 0.15);

      gain.gain.setValueAtTime(0.2, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.3);
    });
  }

  public playIncorrect() {
    if (!this.isSfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.25);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(152, t); // Dissonant beating
    osc2.frequency.exponentialRampToValueAtTime(85, t + 0.25);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.28);
    osc2.stop(t + 0.28);
  }

  public playBubblePop() {
    if (!this.isSfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    
    // Bubble pop sound: high chirp sweeping down quickly + resonant thump
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.09);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playBubbleSpawn() {
    if (!this.isSfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(540, t + 0.07);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  public playBubbleShake() {
    if (!this.isSfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(360, t + 0.08);
    osc.frequency.linearRampToValueAtTime(300, t + 0.16);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  public playLifeLost() {
    if (!this.isSfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const notes = [380, 310, 240, 180];

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.08);

      gain.gain.setValueAtTime(0.24, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.16);
    });
  }

  public playCountdown(isGo = false) {
    if (!this.isSfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (isGo) {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(1174, t + 0.25);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.35);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.18);
    }
  }

  public playTargetRefresh() {
    if (!this.isSfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + idx * 0.03);
      gain.gain.setValueAtTime(0.12, t + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.03 + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + idx * 0.03);
      osc.stop(t + idx * 0.03 + 0.2);
    });
  }

  public playGameOver() {
    if (!this.isSfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const chords = [
      [349.23, 440], // F
      [329.63, 392], // E
      [293.66, 349.23], // D
      [261.63, 311.13, 392] // C minor
    ];

    chords.forEach((chord, step) => {
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + step * 0.18);

        gain.gain.setValueAtTime(0.2, t + step * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, t + step * 0.18 + 0.3);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(t + step * 0.18);
        osc.stop(t + step * 0.18 + 0.32);
      });
    });
  }

  public playModeSelect() {
    if (!this.isSfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];

    notes.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + i * 0.04);
      gain.gain.setValueAtTime(0.15, t + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.18);
    });
  }

  // ================= PROCEDURAL BACKGROUND MUSIC =================

  public startMusic(track: 'menu' | 'gameplay' | 'zen' | 'results') {
    if (this.currentMusicTrack === track) return;
    this.stopMusic();
    this.currentMusicTrack = track;
    this.musicStep = 0;

    this.initContext();
    if (!this.ctx) return;

    // Tempo in BPM
    let bpm = 118;
    if (track === 'zen') bpm = 68;
    if (track === 'gameplay') bpm = 132;
    if (track === 'results') bpm = 124;

    const stepDuration = (60 / bpm) / 2; // 8th note steps

    this.musicIntervalId = window.setInterval(() => {
      this.tickMusic(track);
      this.musicStep = (this.musicStep + 1) % 32;
    }, stepDuration * 1000);
  }

  public stopMusic() {
    if (this.musicIntervalId !== null) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    this.currentMusicTrack = null;
  }

  private tickMusic(track: 'menu' | 'gameplay' | 'zen' | 'results') {
    if (!this.isMusicEnabled || !this.ctx || !this.musicGain) return;
    const t = this.ctx.currentTime;

    if (track === 'zen') {
      // Calming Ethereal Chimes
      // Pentatonic scale: D4, E4, F#4, A4, B4, D5
      const zenNotes = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33];
      if (this.musicStep % 4 === 0) {
        const note = zenNotes[(this.musicStep / 4) % zenNotes.length];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, t);
        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 1.3);
      }
      return;
    }

    if (track === 'menu') {
      // Playful bouncy groove in C Major
      // Bass line on 0, 4, 8, 12, 16...
      const bassRoots = [130.81, 146.83, 164.81, 174.61]; // C3, D3, E3, F3
      if (this.musicStep % 4 === 0) {
        const root = bassRoots[Math.floor(this.musicStep / 8) % bassRoots.length];
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(root, t);
        bGain.gain.setValueAtTime(0.18, t);
        bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        bOsc.connect(bGain);
        bGain.connect(this.musicGain);
        bOsc.start(t);
        bOsc.stop(t + 0.25);
      }

      // Arpeggiated melody sparkles
      const mel = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 587.33, 523.25];
      if (this.musicStep % 2 === 0) {
        const note = mel[(this.musicStep / 2) % mel.length];
        const mOsc = this.ctx.createOscillator();
        const mGain = this.ctx.createGain();
        mOsc.type = 'sine';
        mOsc.frequency.setValueAtTime(note, t);
        mGain.gain.setValueAtTime(0.08, t);
        mGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        mOsc.connect(mGain);
        mGain.connect(this.musicGain);
        mOsc.start(t);
        mOsc.stop(t + 0.14);
      }
      return;
    }

    if (track === 'gameplay') {
      // Upbeat driving arcade bass & rhythm
      const gameBass = [110, 110, 130.81, 146.83, 110, 164.81, 146.83, 123.47]; // A2 scale
      const stepIdx = this.musicStep % 8;
      
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = 'sawtooth';
      // Low pass filter to make bass warm
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, t);

      bOsc.frequency.setValueAtTime(gameBass[stepIdx], t);
      bGain.gain.setValueAtTime(0.16, t);
      bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      bOsc.connect(filter);
      filter.connect(bGain);
      bGain.connect(this.musicGain);
      bOsc.start(t);
      bOsc.stop(t + 0.16);

      // Hi-hat tick
      if (this.musicStep % 2 === 1) {
        const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.03, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(7000, t);

        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.035, t);
        nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(nGain);
        nGain.connect(this.musicGain);

        whiteNoise.start(t);
        whiteNoise.stop(t + 0.035);
      }
      return;
    }

    if (track === 'results') {
      // Cheerful fanfare chords
      const fanfareSteps = [0, 4, 8, 12];
      if (fanfareSteps.includes(this.musicStep % 16)) {
        const chords = [
          [261.63, 329.63, 392], // C
          [293.66, 369.99, 440], // D
          [329.63, 392, 493.88], // Em
          [349.23, 440, 523.25]  // F
        ];
        const chord = chords[Math.floor(this.musicStep / 4) % chords.length];
        chord.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

          osc.connect(gain);
          gain.connect(this.musicGain!);
          osc.start(t);
          osc.stop(t + 0.38);
        });
      }
    }
  }
}

export const soundEngine = new SoundEngine();
