import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SceneShell } from '@/components/ui';
import { useAudio } from '@/audio/AudioProvider';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function SceneVinyl() {
  const { muted, toggleMuted, started, begin } = useAudio();
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);
  const last = useRef(performance.now());

  useEffect(() => {
    const loop = (now: number) => {
      const dt = (now - last.current) / 1000; last.current = now;
      if (started && !muted) setProgress((p) => (p + dt * 0.012) % 1);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [started, muted]);

  return (
    <SceneShell className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
        className="font-display text-4xl sm:text-5xl text-white/95 text-glow mb-12"
      >
        A little song, just for this moment
      </motion.h2>

      <div className="flex flex-col items-center gap-10">
        {/* Vinyl */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72">
          <motion.div
            animate={{ rotate: started && !muted ? 360 : 0 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, #1a1a1a 0 30%, #2a2a2a 30% 32%, #111 32% 40%, #222 40% 42%, #111 42% 50%, #222 50% 52%, #111 52% 60%, #222 60% 62%, #111 62% 100%)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* label */}
            <div className="absolute inset-0 m-auto w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f9a8d4, #a78bfa)' }}
            >
              <span className="font-hand text-white text-base text-center leading-tight px-2">for you,<br/>babe ♡</span>
            </div>
            {/* center hole */}
            <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black" />
          </motion.div>
          {/* tonearm */}
          <div className="absolute -right-2 top-2 w-2 h-40 origin-top rotate-[24deg] bg-gradient-to-b from-stone-300 to-stone-500 rounded-full" />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => { if (!started) begin(); else toggleMuted(); }}
            className="w-14 h-14 rounded-full glass-strong flex items-center justify-center text-white glow-soft"
            aria-label={started && !muted ? 'Pause music' : 'Play music'}
          >
            {started && !muted ? <Pause size={22} /> : <Play size={22} className="ml-1" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={toggleMuted}
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-white"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </motion.button>
        </div>

        {/* Progress */}
        <div className="w-full max-w-md">
          <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: 'linear-gradient(90deg, #fcd34d, #f9a8d4, #a78bfa)' }} />
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-2 font-hand text-base">
            <span>ambient piano</span>
            <span>∞ loop</span>
          </div>
        </div>
      </div>
    </SceneShell>
  );
}
