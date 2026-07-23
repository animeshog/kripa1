import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type Weather = 'sunrise' | 'sunny' | 'rain' | 'night';

type AudioState = {
  started: boolean;
  muted: boolean;
  volume: number;
  weather: Weather;
  begin: () => void;
  setMuted: (m: boolean) => void;
  toggleMuted: () => void;
  setWeather: (w: Weather) => void;
  playChime: () => void;
  playSparkle: () => void;
  playPop: () => void;
  playWhoosh: () => void;
};

const Ctx = createContext<AudioState | null>(null);
const backgroundMusicUrl = new URL('./Perfect - Ed Sheeran   1 Minute Arrangement - Jason Suwito.mp3', import.meta.url).href;

export function useAudio() {
  const c = useContext(Ctx);
  if (!c) throw new Error('AudioProvider missing');
  return c;
}

// ─── Note frequencies ──────────────────────────────────────────────
const N = {
  C2: 65.41, D2: 73.42, E2: 82.41, G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00,
  B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
  A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
  G5: 783.99, A5: 880.00,
};
const Fs = { Fs3: 185.00, Fs4: 369.99, Fs5: 698.46 };
const Csm = { Cs4: 277.18, Cs5: 554.37 };

// ─── Bright, upbeat structure ─────────────────────────────────────
// Key of G major. Tempo ~84 BPM. 4/4 time.
// Chord progression: G — D — Em — C  (I–V–vi–IV, with a brighter lift)
// Each chord = 2 bars = 8 beats. Total loop = 32 beats.

type MelodyNote = { f: number; beat: number; dur: number; vel?: number };
type ChordSection = { bass: number; pad: number[]; arp: number[]; melody: MelodyNote[] };

const PROGRESSION: ChordSection[] = [
  { // G major — bars 1–2
    bass: N.G2,
    pad: [N.G3, N.B3, N.D4],
    arp: [N.G3, N.B3, N.D4, N.G4, N.B4, N.D5, N.B4, N.G4],
    melody: [
      { f: N.D4, beat: 0, dur: 1 }, { f: N.G4, beat: 1, dur: 1 },
      { f: N.B4, beat: 2, dur: 1 }, { f: N.D5, beat: 3, dur: 1 },
      { f: N.B4, beat: 4, dur: 1 }, { f: N.A4, beat: 5, dur: 1 },
      { f: N.G4, beat: 6, dur: 2 },
    ],
  },
  { // D major — bars 3–4
    bass: N.D2,
    pad: [N.D3, Fs.Fs3, N.A3],
    arp: [N.D3, Fs.Fs3, N.A3, N.D4, N.Fs4, N.A4, N.Fs4, N.D4],
    melody: [
      { f: N.A4, beat: 0, dur: 1 }, { f: N.D5, beat: 1, dur: 1 },
      { f: N.E5, beat: 2, dur: 1 }, { f: N.F5, beat: 3, dur: 1 },
      { f: N.E5, beat: 4, dur: 1 }, { f: N.D5, beat: 5, dur: 1 },
      { f: N.A4, beat: 6, dur: 2 },
    ],
  },
  { // E minor — bars 5–6
    bass: N.E2,
    pad: [N.E3, N.G3, N.B3],
    arp: [N.E3, N.G3, N.B3, N.E4, N.G4, N.B4, N.G4, N.E4],
    melody: [
      { f: N.G4, beat: 0, dur: 1 }, { f: N.B4, beat: 1, dur: 1 },
      { f: N.E5, beat: 2, dur: 1 }, { f: N.G5, beat: 3, dur: 1 },
      { f: N.E5, beat: 4, dur: 1 }, { f: N.D5, beat: 5, dur: 1 },
      { f: N.B4, beat: 6, dur: 2 },
    ],
  },
  { // C major — bars 7–8
    bass: N.C2,
    pad: [N.C3, N.E3, N.G3],
    arp: [N.C3, N.E3, N.G3, N.C4, N.E4, N.G4, N.E4, N.C4],
    melody: [
      { f: N.E4, beat: 0, dur: 1 }, { f: N.G4, beat: 1, dur: 1 },
      { f: N.C5, beat: 2, dur: 1 }, { f: N.E5, beat: 3, dur: 1 },
      { f: N.D5, beat: 4, dur: 1 }, { f: N.C5, beat: 5, dur: 1 },
      { f: N.G4, beat: 6, dur: 2 },
    ],
  },
];

const BEAT = 60 / 84; // seconds per beat at 84 BPM
const LOOP_BEATS = 32;

// ─── Weather variations ────────────────────────────────────────────
// Adjust melody octave / voicing per weather mood
const WEATHER_SHIFT: Record<Weather, number> = {
  sunrise: 1, sunny: 1, rain: 0, night: -1,
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const sfxRef = useRef<GainNode | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const schedulerRef = useRef<number | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const nextNoteTimeRef = useRef(0);
  const beatRef = useRef(0);
  const weatherRef = useRef<Weather>('sunrise');
  const targetVolRef = useRef(0.0);

  const [started, setStarted] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [volume, setVolume] = useState(0);
  const [weather, setWeatherState] = useState<Weather>('sunrise');

  const makeImpulse = (ac: AudioContext, seconds = 3.0, decay = 2.2) => {
    const rate = ac.sampleRate;
    const len = Math.floor(rate * seconds);
    const impulse = ac.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return impulse;
  };

  const ensureCtx = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ac = new AC();
    const master = ac.createGain();
    master.gain.value = 0;
    master.connect(ac.destination);

    const reverb = ac.createConvolver();
    reverb.buffer = makeImpulse(ac, 3.2, 2.0);
    const reverbGain = ac.createGain();
    reverbGain.gain.value = 0.38;
    reverb.connect(reverbGain).connect(master);

    const musicGain = ac.createGain();
    musicGain.gain.value = 0.55;
    musicGain.connect(master);
    musicGain.connect(reverb);

    const sfx = ac.createGain();
    sfx.gain.value = 0.85;
    sfx.connect(master);
    sfx.connect(reverb);

    ctxRef.current = ac;
    masterRef.current = master;
    musicGainRef.current = musicGain;
    sfxRef.current = sfx;
    reverbRef.current = reverb;
    return ac;
  }, []);

  // Smooth volume ramp on mute toggle
  useEffect(() => {
    const ac = ctxRef.current;
    const master = masterRef.current;
    if (!ac || !master) return;
    const now = ac.currentTime;
    const target = muted ? 0 : targetVolRef.current;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(target, now + 0.5);
    setVolume(target);
  }, [muted]);

  useEffect(() => {
    const audio = bgMusicRef.current;
    if (!audio) return;

    const weatherSettings: Record<Weather, { volume: number; playbackRate: number }> = {
      sunrise: { volume: muted ? 0 : 0.5, playbackRate: 1.0 },
      sunny: { volume: muted ? 0 : 0.48, playbackRate: 1.03 },
      rain: { volume: muted ? 0 : 0.35, playbackRate: 0.92 },
      night: { volume: muted ? 0 : 0.42, playbackRate: 0.96 },
    };

    const settings = weatherSettings[weather];
    audio.volume = settings.volume;
    audio.playbackRate = settings.playbackRate;
  }, [muted, weather]);

  // ── Piano-like note ──────────────────────────────────────────────
  const playPianoNote = (
    ac: AudioContext, freq: number, t: number, dur: number, vel: number,
    dest: GainNode, type: OscillatorType = 'triangle'
  ) => {
    // Two oscillators for richness
    const osc1 = ac.createOscillator();
    const osc2 = ac.createOscillator();
    const g = ac.createGain();
    const filter = ac.createBiquadFilter();

    osc1.type = type;
    osc2.type = 'sine';
    osc1.frequency.value = freq;
    osc2.frequency.value = freq * 2.001; // slight detune octave

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + dur * 0.6);
    filter.Q.value = 0.6;

    const v = vel * 0.5;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + 0.015);
    g.gain.exponentialRampToValueAtTime(v * 0.3, t + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    const g2 = ac.createGain();
    g2.gain.value = 0.3;
    osc2.connect(g2).connect(g);

    osc1.connect(filter).connect(g).connect(dest);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + dur + 0.1);
    osc2.stop(t + dur + 0.1);
  };

  // ── Soft pad chord ───────────────────────────────────────────────
  const playPad = (ac: AudioContext, freqs: number[], t: number, dur: number, dest: GainNode) => {
    freqs.forEach((f) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.04, t + 0.8);
      g.gain.setValueAtTime(0.04, t + dur - 1.0);
      g.gain.linearRampToValueAtTime(0, t + dur);
      osc.connect(filter).connect(g).connect(dest);
      osc.start(t);
      osc.stop(t + dur + 0.1);
    });
  };

  // ── Bass note ────────────────────────────────────────────────────
  const playBass = (ac: AudioContext, freq: number, t: number, dur: number, dest: GainNode) => {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.14, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(filter).connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.1);
  };

  // ── Scheduler ────────────────────────────────────────────────────
  const schedule = useCallback(() => {
    const ac = ctxRef.current!;
    const lookahead = 0.1; // schedule 100ms ahead
    while (nextNoteTimeRef.current < ac.currentTime + lookahead) {
      const beat = beatRef.current;
      const chordIdx = Math.floor((beat % LOOP_BEATS) / 8);
      const chord = PROGRESSION[chordIdx];
      const beatInChord = beat % 8;
      const shift = WEATHER_SHIFT[weatherRef.current];
      const t = nextNoteTimeRef.current;

      // Bass at start of each chord (beat 0 of chord)
      if (beatInChord === 0) {
        playBass(ac, chord.bass, t, BEAT * 8, musicGainRef.current!);
        playPad(ac, chord.pad, t, BEAT * 8, musicGainRef.current!);
      }

      // Arpeggio — one note per beat
      const arpNote = chord.arp[beatInChord];
      if (arpNote) {
        playPianoNote(ac, arpNote * Math.pow(2, shift), t, BEAT * 1.6, 0.12, musicGainRef.current!, 'triangle');
      }

      // Melody
      chord.melody.forEach((m) => {
        if (m.beat === beatInChord) {
          playPianoNote(ac, m.f * Math.pow(2, shift), t, BEAT * m.dur, (m.vel ?? 0.22), musicGainRef.current!, 'triangle');
        }
      });

      beatRef.current = (beat + 1) % LOOP_BEATS;
      nextNoteTimeRef.current += BEAT;
    }
  }, []);

  const startMusic = useCallback(() => {
    const ac = ensureCtx();
    if (ac.state === 'suspended') ac.resume();
    targetVolRef.current = 0.5;
    masterRef.current!.gain.cancelScheduledValues(ac.currentTime);
    masterRef.current!.gain.setValueAtTime(0, ac.currentTime);
    masterRef.current!.gain.linearRampToValueAtTime(0.5, ac.currentTime + 3);

    if (schedulerRef.current) {
      clearInterval(schedulerRef.current);
      schedulerRef.current = null;
    }

    if (!bgMusicRef.current) {
      const audio = new Audio(backgroundMusicUrl);
      audio.loop = true;
      audio.volume = muted ? 0 : 0.5;
      bgMusicRef.current = audio;
    }

    bgMusicRef.current.currentTime = 0;
    bgMusicRef.current.play().catch(() => undefined);
  }, [ensureCtx, muted]);

  const begin = useCallback(() => {
    if (started) return;
    setStarted(true);
    startMusic();
  }, [started, startMusic]);

  const setMuted = useCallback((m: boolean) => setMutedState(m), []);
  const toggleMuted = useCallback(() => setMutedState((m) => !m), []);

  const setWeather = useCallback((w: Weather) => {
    weatherRef.current = w;
    setWeatherState(w);
  }, []);

  // ── SFX ──────────────────────────────────────────────────────────
  const playChime = useCallback(() => {
    const ac = ensureCtx();
    if (ac.state === 'suspended') ac.resume();
    const t = ac.currentTime + 0.01;
    [N.C5, N.E5, N.G5].forEach((f, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t + i * 0.05);
      g.gain.linearRampToValueAtTime(0.12, t + i * 0.05 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.05 + 0.8);
      o.connect(g).connect(sfxRef.current!);
      o.start(t + i * 0.05);
      o.stop(t + i * 0.05 + 0.9);
    });
  }, [ensureCtx]);

  const playSparkle = useCallback(() => {
    const ac = ensureCtx();
    if (ac.state === 'suspended') ac.resume();
    const t = ac.currentTime + 0.005;
    [N.E5, N.G5, N.B4, N.D5].forEach((f, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      const st = t + i * 0.035;
      g.gain.setValueAtTime(0, st);
      g.gain.linearRampToValueAtTime(0.06, st + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, st + 0.35);
      o.connect(g).connect(sfxRef.current!);
      o.start(st);
      o.stop(st + 0.4);
    });
  }, [ensureCtx]);

  const playPop = useCallback(() => {
    const ac = ensureCtx();
    if (ac.state === 'suspended') ac.resume();
    const t = ac.currentTime + 0.005;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(380, t);
    o.frequency.exponentialRampToValueAtTime(760, t + 0.1);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.14, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g).connect(sfxRef.current!);
    o.start(t);
    o.stop(t + 0.3);
  }, [ensureCtx]);

  const playWhoosh = useCallback(() => {
    const ac = ensureCtx();
    if (ac.state === 'suspended') ac.resume();
    const t = ac.currentTime + 0.005;
    const o = ac.createOscillator();
    const g = ac.createGain();
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(1600, t + 0.5);
    filter.Q.value = 1.0;
    o.type = 'sawtooth';
    o.frequency.value = 120;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.08, t + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    o.connect(filter).connect(g).connect(sfxRef.current!);
    o.start(t);
    o.stop(t + 0.7);
  }, [ensureCtx]);

  useEffect(() => {
    return () => {
      if (schedulerRef.current) clearInterval(schedulerRef.current);
      bgMusicRef.current?.pause();
      ctxRef.current?.close();
    };
  }, []);

  return (
    <Ctx.Provider
      value={{
        started, muted, volume, weather,
        begin, setMuted, toggleMuted, setWeather,
        playChime, playSparkle, playPop, playWhoosh,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
