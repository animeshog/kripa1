import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/audio/AudioProvider';
import { GlowButton } from '@/components/ui';

const L1 = 'Good Morning Babe ☀️';
const L2 = 'I made a tiny little universe...';
const L3 = 'just for you.';

function useTypewriter(text: string, speed = 55, start = true) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!start) return;
    let i = 0;
    setOut(''); setDone(false);
    const id = setInterval(() => {
      i++; setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return { out, done };
}

export default function SceneIntro({ onBegin }: { onBegin: () => void }) {
  const { begin } = useAudio();
  const [phase, setPhase] = useState(0);
  const t1 = useTypewriter(L1, 70, phase >= 0);
  const t2 = useTypewriter(L2, 55, phase >= 1);
  const t3 = useTypewriter(L3, 55, phase >= 2);
  const started = useRef(false);

  useEffect(() => {
    if (t1.done && phase === 0) { const id = setTimeout(() => setPhase(1), 700); return () => clearTimeout(id); }
  }, [t1.done, phase]);
  useEffect(() => {
    if (t2.done && phase === 1) { const id = setTimeout(() => setPhase(2), 500); return () => clearTimeout(id); }
  }, [t2.done, phase]);
  useEffect(() => {
    if (t3.done && phase === 2) { const id = setTimeout(() => setPhase(3), 700); return () => clearTimeout(id); }
  }, [t3.done, phase]);

  const handle = () => {
    if (started.current) return;
    started.current = true;
    begin();
    onBegin();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6">
      <div className="space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-medium text-white text-glow"
        >
          <span className={t1.done ? '' : 'caret'}>{t1.out}</span>
        </motion.h1>

        <AnimatePresence>
          {phase >= 1 && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-2xl sm:text-3xl md:text-4xl text-white/85 text-glow-soft"
            >
              <span className={t2.done ? '' : 'caret'}>{t2.out}</span>
            </motion.p>
          )}
          {phase >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display italic text-2xl sm:text-3xl md:text-4xl text-rose-200 text-glow-soft"
            >
              <span className={t3.done ? '' : 'caret'}>{t3.out}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14"
          >
            <GlowButton glow="warm" onClick={handle} className="text-lg tracking-wide">
              <span className="text-xl">▶</span> Begin
            </GlowButton>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-5 text-sm text-white/55 font-hand text-lg"
            >
              (turn your sound on 🎧)
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
