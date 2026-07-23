import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneShell } from '@/components/ui';
import { useAudio } from '@/audio/AudioProvider';

const TOTAL = 12;

type H = { id: number; x: number; y: number; vy: number; caught: boolean };

export default function SceneGame() {
  const [started, setStarted] = useState(false);
  const [hearts, setHearts] = useState<H[]>([]);
  const [caught, setCaught] = useState(0);
  const [done, setDone] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const idRef = useRef(0);
  const { playPop, playChime, playSparkle } = useAudio();

  const spawn = () => {
    setHearts((hs) => {
      if (hs.filter((h) => !h.caught).length >= 6) return hs;
      const id = ++idRef.current;
      return [...hs, { id, x: Math.random() * 90 + 2, y: 105, vy: 0.4 + Math.random() * 0.5, caught: false }];
    });
  };

  useEffect(() => {
    if (!started) return;
    const spawnId = setInterval(spawn, 900);
    const loop = () => {
      setHearts((hs) =>
        hs
          .map((h) => (h.caught ? h : { ...h, y: h.y - h.vy }))
          .filter((h) => h.y > -10 || h.caught)
      );
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { clearInterval(spawnId); cancelAnimationFrame(raf.current); };
  }, [started]);

  const catchHeart = (id: number) => {
    setHearts((hs) => hs.map((h) => (h.id === id ? { ...h, caught: true } : h)));
    setCaught((c) => {
      const n = c + 1;
      playPop(); playSparkle();
      if (n >= TOTAL) { setDone(true); playChime(); }
      return n;
    });
  };

  return (
    <SceneShell className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
        className="font-display text-4xl sm:text-5xl text-white/95 text-glow mb-4"
      >
        Catch the floating hearts
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
        className="text-white/65 mb-6 max-w-md mx-auto"
      >
        Tap each heart as it floats up. Catch all {TOTAL} for a little surprise.
      </motion.p>

      <div className="mb-6 text-white/80 font-hand text-2xl">
        {caught} / {TOTAL} 💗
      </div>

      <div ref={areaRef} className="relative w-full max-w-2xl h-80 rounded-4xl glass overflow-hidden mx-auto">
        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <button onClick={() => setStarted(true)} className="px-8 py-3 rounded-full glass-strong text-white font-medium soft-bounce glow-soft">Start</button>
          </div>
        )}

        <AnimatePresence>
          {hearts.map((h) => (
            !h.caught && (
              <motion.button
                key={h.id}
                onClick={() => catchHeart(h.id)}
                className="absolute text-3xl select-none"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.7 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                💗
              </motion.button>
            )
          ))}
        </AnimatePresence>

        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30 backdrop-blur-sm"
          >
            <p className="font-display text-4xl text-white text-glow">Mission Complete ❤️</p>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={{ duration: 0.8, type: 'spring' }}
              className="text-7xl"
            >
              🤗
            </motion.div>
            <p className="font-hand text-2xl text-white/90">A great big virtual hug — just for you.</p>
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
}
