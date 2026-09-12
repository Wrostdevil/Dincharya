// Web Audio API Synthesizer for tactile feedback and ambient focus soundscapes
import { AmbientSoundType, SoundOption } from '../types';

export const SOUND_OPTIONS: SoundOption[] = [
  // --- Cortisol Removal & Healing Soundscapes ---
  {
    id: 'cortisol_528',
    name: '528 Hz Cortisol Cleanse',
    category: 'Cortisol Removal',
    subtitle: 'Solfeggio Repair Frequency',
    description: 'Clinically studied 528 Hz harmonic designed to downregulate salivary cortisol, calm autonomic stress, and restore nervous system balance.',
    tag: 'Stress Detox',
  },
  {
    id: 'cortisol_432',
    name: '432 Hz Deep Nervous Reset',
    category: 'Cortisol Removal',
    subtitle: 'Vagus Nerve Resonance',
    description: 'Natural mathematical harmonic tone that slows heart rate, soothes sympathetic fight-or-flight arousal, and dissolves mental tension.',
    tag: 'Nervous Calm',
  },
  {
    id: 'tibetan_bowl',
    name: 'Tibetan Singing Bowls',
    category: 'Cortisol Removal',
    subtitle: 'Acoustic Harmonic Drone',
    description: 'Resonant multi-octave metallic singing bowl waves with slow acoustic phase beating to release stored emotional and physical fatigue.',
    tag: 'Deep Release',
  },

  // --- Binaural Beats ---
  {
    id: 'binaural_alpha',
    name: 'Alpha Flow (10 Hz)',
    category: 'Binaural Beats',
    subtitle: '216Hz / 226Hz Stereo Split',
    description: 'Optimal for deep focus, creative problem solving, and entering effortless flow without caffeine jitters or cognitive strain.',
    tag: 'Flow State',
  },
  {
    id: 'binaural_theta',
    name: 'Theta Calm & Anxiety Release (6 Hz)',
    category: 'Binaural Beats',
    subtitle: '180Hz / 186Hz Stereo Split',
    description: 'Deep meditative brainwave entrainment that reduces cortisol spikes, calms racing thoughts, and encourages intuitive breakthroughs.',
    tag: 'Anxiety Relief',
  },
  {
    id: 'binaural_delta',
    name: 'Delta Cortisol Flush (2.5 Hz)',
    category: 'Binaural Beats',
    subtitle: '136.1Hz Earth "Om" / 138.6Hz',
    description: 'Ultra-low frequency delta wave entrainment triggering parasympathetic neuro-regeneration and rapid cortisol clearance.',
    tag: 'Cortisol Flush',
  },

  // --- Nature & Focus Soundscapes ---
  {
    id: 'rain',
    name: 'Gentle Rainfall',
    category: 'Nature & Focus',
    subtitle: 'Acoustic Soft Rain',
    description: 'Continuous soothing rainfall with brown-noise dampening to drown out disruptive background noises and sustain concentration.',
    tag: 'Classic Focus',
  },
  {
    id: 'thunder',
    name: 'Distant Thunderstorm',
    category: 'Nature & Focus',
    subtitle: 'Rolling Thunder & Rain',
    description: 'Deep low-frequency reverberations and steady precipitation creating a cozy, high-focus sanctuary.',
    tag: 'Deep Work',
  },
  {
    id: 'ocean',
    name: 'Ocean Swells',
    category: 'Nature & Focus',
    subtitle: 'Rhythmic Tide Cycles',
    description: 'Gentle 0.08 Hz rhythmic wave crests and troughs that naturally pace human breathing for autonomic nervous system relaxation.',
    tag: 'Breath Rhythm',
  },
  {
    id: 'zen',
    name: 'Zen Sanctuary Drone',
    category: 'Nature & Focus',
    subtitle: 'Monastery Wind & Chimes',
    description: 'Warm harmonic ambient sound bed with subtle air resonance for contemplative productivity and peaceful clarity.',
    tag: 'Mindfulness',
  },
  {
    id: 'brownnoise',
    name: 'Deep Brown Noise',
    category: 'Nature & Focus',
    subtitle: 'Smooth Low-Pass Blanket',
    description: 'Rich low-rumble noise spectrum highly favored for masking sensory distractions, silencing tinnitus, and steadying ADHD attention.',
    tag: 'ADHD Calm',
  },
  {
    id: 'whitenoise',
    name: 'Crisp White Noise',
    category: 'Nature & Focus',
    subtitle: 'Even-Spectrum Focus Shield',
    description: 'Uniform acoustic sound barrier that masks sudden sharp sounds and conversation in open work environments.',
    tag: 'Sound Mask',
  },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private ambientNodes: Record<string, { gain: GainNode; stop: () => void }> = {};
  private activeSoundId: AmbientSoundType | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopAllAmbient();
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public getActiveAmbient(): AmbientSoundType | null {
    return this.activeSoundId;
  }

  // Tactile mechanical 3D button click
  public playClick(type: 'press' | 'release' | 'knob' = 'press') {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const now = ctx.currentTime;
      if (type === 'press') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      } else if (type === 'release') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.025);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      } else {
        // Rotary dial tactile tick
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.018);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignored
    }
  }

  // Tibetan Bell / Zen Mindful Chime
  public playChime() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Rich Tibetan bell overtone frequencies (528 Hz love / repair tone foundation)
      const freqs = [528, 1056, 1584, 2112];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const initialVol = 0.15 / (idx + 1);
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.0);
      });
    } catch {
      // Ignored
    }
  }

  // --- Ambient sound generator with all options ---
  public startAmbient(type: AmbientSoundType, volume: number = 0.3) {
    if (!this.soundEnabled) return;
    this.stopAllAmbient();

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(Math.max(0.01, volume * 0.25), now);
      masterGain.connect(ctx.destination);

      const cleanupTasks: Array<() => void> = [];

      // ==========================================
      // 1. CORTISOL REMOVAL: 528 Hz Solfeggio
      // ==========================================
      if (type === 'cortisol_528') {
        // Fundamental 528 Hz (the DNA repair / cortisol reduction tone)
        const osc528 = ctx.createOscillator();
        osc528.type = 'sine';
        osc528.frequency.setValueAtTime(528, now);

        // Sub-harmonic 264 Hz for grounding warmth
        const oscSub = ctx.createOscillator();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(264, now);

        // Gentle overtone 1056 Hz
        const oscHigh = ctx.createOscillator();
        oscHigh.type = 'sine';
        oscHigh.frequency.setValueAtTime(1056, now);

        const gain528 = ctx.createGain();
        gain528.gain.setValueAtTime(0.18, now);

        const gainSub = ctx.createGain();
        gainSub.gain.setValueAtTime(0.12, now);

        const gainHigh = ctx.createGain();
        gainHigh.gain.setValueAtTime(0.03, now);

        // Slow breathing tremolo LFO (0.1 Hz ~ 10 seconds breathing loop)
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.1, now);

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.03, now);
        lfo.connect(lfoGain);
        lfoGain.connect(masterGain.gain);

        osc528.connect(gain528);
        oscSub.connect(gainSub);
        oscHigh.connect(gainHigh);

        gain528.connect(masterGain);
        gainSub.connect(masterGain);
        gainHigh.connect(masterGain);

        osc528.start();
        oscSub.start();
        oscHigh.start();
        lfo.start();

        cleanupTasks.push(() => {
          osc528.stop();
          oscSub.stop();
          oscHigh.stop();
          lfo.stop();
          osc528.disconnect();
          oscSub.disconnect();
          oscHigh.disconnect();
          lfo.disconnect();
        });
      }

      // ==========================================
      // 2. CORTISOL REMOVAL: 432 Hz Deep Reset
      // ==========================================
      else if (type === 'cortisol_432') {
        const osc432 = ctx.createOscillator();
        osc432.type = 'sine';
        osc432.frequency.setValueAtTime(432, now);

        const osc216 = ctx.createOscillator();
        osc216.type = 'sine';
        osc216.frequency.setValueAtTime(216, now);

        const gain432 = ctx.createGain();
        gain432.gain.setValueAtTime(0.18, now);

        const gain216 = ctx.createGain();
        gain216.gain.setValueAtTime(0.14, now);

        // Very soft acoustic grounding noise
        const bufSize = ctx.sampleRate * 2;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        let last = 0;
        for (let i = 0; i < bufSize; i++) {
          last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
          data[i] = last * 0.4;
        }
        const bed = ctx.createBufferSource();
        bed.buffer = buf;
        bed.loop = true;

        const bedFilter = ctx.createBiquadFilter();
        bedFilter.type = 'lowpass';
        bedFilter.frequency.setValueAtTime(160, now);

        const bedGain = ctx.createGain();
        bedGain.gain.setValueAtTime(0.04, now);

        bed.connect(bedFilter);
        bedFilter.connect(bedGain);
        bedGain.connect(masterGain);

        osc432.connect(gain432);
        osc216.connect(gain216);
        gain432.connect(masterGain);
        gain216.connect(masterGain);

        osc432.start();
        osc216.start();
        bed.start();

        cleanupTasks.push(() => {
          osc432.stop();
          osc216.stop();
          bed.stop();
          osc432.disconnect();
          osc216.disconnect();
          bed.disconnect();
        });
      }

      // ==========================================
      // 3. CORTISOL REMOVAL: Tibetan Singing Bowls
      // ==========================================
      else if (type === 'tibetan_bowl') {
        // Multi-frequency metallic resonance with slow beating
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(216, now);

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(432, now);

        const oscChorus = ctx.createOscillator();
        oscChorus.type = 'sine';
        oscChorus.frequency.setValueAtTime(433.2, now); // 1.2 Hz hypnotic acoustic chorus beat

        const oscHigh = ctx.createOscillator();
        oscHigh.type = 'sine';
        oscHigh.frequency.setValueAtTime(648, now);

        const g1 = ctx.createGain();
        g1.gain.setValueAtTime(0.14, now);

        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.12, now);

        const gChorus = ctx.createGain();
        gChorus.gain.setValueAtTime(0.12, now);

        const gHigh = ctx.createGain();
        gHigh.gain.setValueAtTime(0.03, now);

        osc1.connect(g1);
        osc2.connect(g2);
        oscChorus.connect(gChorus);
        oscHigh.connect(gHigh);

        g1.connect(masterGain);
        g2.connect(masterGain);
        gChorus.connect(masterGain);
        gHigh.connect(masterGain);

        osc1.start();
        osc2.start();
        oscChorus.start();
        oscHigh.start();

        cleanupTasks.push(() => {
          osc1.stop();
          osc2.stop();
          oscChorus.stop();
          oscHigh.stop();
          osc1.disconnect();
          osc2.disconnect();
          oscChorus.disconnect();
          oscHigh.disconnect();
        });
      }

      // ==========================================
      // 4. BINAURAL BEATS (ALPHA, THETA, DELTA)
      // ==========================================
      else if (
        type === 'binaural' ||
        type === 'binaural_alpha' ||
        type === 'binaural_theta' ||
        type === 'binaural_delta'
      ) {
        const merger = ctx.createChannelMerger(2);

        let freqL = 216;
        let freqR = 226; // Default Alpha 10Hz

        if (type === 'binaural_theta') {
          freqL = 180;
          freqR = 186; // Theta 6Hz
        } else if (type === 'binaural_delta') {
          freqL = 136.1; // Earth Ohm tone
          freqR = 138.6; // Delta 2.5Hz
        }

        const oscL = ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(freqL, now);

        const oscR = ctx.createOscillator();
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(freqR, now);

        // Warm subtle grounding undertone
        const oscSub = ctx.createOscillator();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(freqL / 2, now);
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.08, now);
        oscSub.connect(subGain);
        subGain.connect(masterGain);

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(masterGain);

        oscL.start();
        oscR.start();
        oscSub.start();

        cleanupTasks.push(() => {
          oscL.stop();
          oscR.stop();
          oscSub.stop();
          oscL.disconnect();
          oscR.disconnect();
          oscSub.disconnect();
        });
      }

      // ==========================================
      // 5. OCEAN SWELLS (Periodic Tidal Respiration)
      // ==========================================
      else if (type === 'ocean') {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.4;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);

        // LFO for wave swells (0.08 Hz = ~12.5s tide cycle)
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.08, now);

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(380, now); // Swells up to 700 Hz
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        noise.connect(filter);
        filter.connect(masterGain);

        noise.start();
        lfo.start();

        cleanupTasks.push(() => {
          noise.stop();
          lfo.stop();
          noise.disconnect();
          lfo.disconnect();
        });
      }

      // ==========================================
      // 6. THUNDERSTORM RAIN
      // ==========================================
      else if (type === 'thunder') {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        }

        const rainSource = ctx.createBufferSource();
        rainSource.buffer = buffer;
        rainSource.loop = true;

        const rainFilter = ctx.createBiquadFilter();
        rainFilter.type = 'lowpass';
        rainFilter.frequency.setValueAtTime(750, now);

        rainSource.connect(rainFilter);
        rainFilter.connect(masterGain);
        rainSource.start();

        // Deep sub-bass rumble drone (thunder simulation)
        const rumbleOsc = ctx.createOscillator();
        rumbleOsc.type = 'sine';
        rumbleOsc.frequency.setValueAtTime(54, now);

        const rumbleLfo = ctx.createOscillator();
        rumbleLfo.type = 'triangle';
        rumbleLfo.frequency.setValueAtTime(0.06, now);

        const rumbleGain = ctx.createGain();
        rumbleGain.gain.setValueAtTime(0.06, now);

        rumbleLfo.connect(rumbleGain.gain);
        rumbleOsc.connect(rumbleGain);
        rumbleGain.connect(masterGain);

        rumbleOsc.start();
        rumbleLfo.start();

        cleanupTasks.push(() => {
          rainSource.stop();
          rumbleOsc.stop();
          rumbleLfo.stop();
          rainSource.disconnect();
          rumbleOsc.disconnect();
          rumbleLfo.disconnect();
        });
      }

      // ==========================================
      // 7. RAIN, WHITE NOISE, BROWN NOISE, ZEN
      // ==========================================
      else {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain' || type === 'brownnoise') {
            // Brown noise approximation
            lastOut = (lastOut + 0.02 * white) / 1.02;
            data[i] = lastOut * 3.5;
          } else if (type === 'zen') {
            // Pinkish softened texture
            data[i] = (white + lastOut) * 0.3;
            lastOut = white;
          } else {
            // White noise
            data[i] = white * 0.5;
          }
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        if (type === 'brownnoise') {
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(420, now);
        } else if (type === 'rain') {
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, now);
        } else if (type === 'zen') {
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(650, now);
        } else {
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1200, now);
        }

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();

        // If Zen, add a gentle 528Hz bell drone
        let zenOsc: OscillatorNode | null = null;
        if (type === 'zen') {
          zenOsc = ctx.createOscillator();
          zenOsc.type = 'sine';
          zenOsc.frequency.setValueAtTime(528, now);
          const zenGain = ctx.createGain();
          zenGain.gain.setValueAtTime(0.04, now);
          zenOsc.connect(zenGain);
          zenGain.connect(masterGain);
          zenOsc.start();
        }

        cleanupTasks.push(() => {
          noise.stop();
          noise.disconnect();
          if (zenOsc) {
            zenOsc.stop();
            zenOsc.disconnect();
          }
        });
      }

      this.ambientNodes[type] = {
        gain: masterGain,
        stop: () => {
          cleanupTasks.forEach((fn) => {
            try {
              fn();
            } catch {}
          });
        },
      };

      this.activeSoundId = type;
    } catch {
      // Handled
    }
  }

  public setAmbientVolume(type: string, volume: number) {
    if (this.ambientNodes[type] && this.ctx) {
      this.ambientNodes[type].gain.gain.setValueAtTime(
        volume * 0.25,
        this.ctx.currentTime
      );
    }
  }

  public stopAmbient(type: string) {
    if (this.ambientNodes[type]) {
      this.ambientNodes[type].stop();
      delete this.ambientNodes[type];
    }
    if (this.activeSoundId === type) {
      this.activeSoundId = null;
    }
  }

  public stopAllAmbient() {
    Object.keys(this.ambientNodes).forEach((k) => this.stopAmbient(k));
    this.activeSoundId = null;
  }
}

export const sound = new SoundEngine();
