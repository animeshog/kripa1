import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/audio/AudioProvider';
import confetti from 'canvas-confetti';

/** Easter eggs: L-key hearts, moon 5-clicks cat, long-press heart. */
export default function EasterEggs() {
  const { playSparkle, playChime } = useAudio();
  const [heartRain, setHeartRain] = useState(0);
  const [cat, setCat] = useState(false);
  const [secret, setSecret] = useState(false);
  const [love, setLove] = useState(false);
  const moonClicks = useRef(0);
  const pressTimer = useRef<number | null>(null);

  // L key → heart rain
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'l' && !e.repeat) {
        setHeartRain((n) => n + 1);
        playSparkle();
        confetti({ particleCount: 40, spread: 360, startVelocity: 25, scalar: 1.6, shapes: ['circle'], colors: ['#f9a8d4', '#fb7185', '#a78bfa'], origin: { y: 0 } });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playSparkle]);

  // Moon 5-clicks → cat
  const onMoonClick = () => {
    moonClicks.current += 1;
    playSparkle();
    if (moonClicks.current >= 5) {
      moonClicks.current = 0;
      setCat(true);
      setSecret(true);
      playChime();
      setTimeout(() => setCat(false), 4000);
    }
  };

  // Long-press heart → I love you
  const startPress = () => {
    pressTimer.current = window.setTimeout(() => {
      setLove(true);
      playChime();
      confetti({ particleCount: 50, spread: 360, startVelocity: 20, scalar: 1.5, colors: ['#f9a8d4', '#fb7185'], origin: { y: 0.6 } });
      setTimeout(() => setLove(false), 3500);
    }, 3000);
  };
  const endPress = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  return (
    <>
      {/* Hidden moon trigger (top-right) */}
      <button
        onClick={onMoonClick}
        aria-label="moon"
        className="fixed top-5 right-5 z-[60] w-10 h-10 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300/70 shadow-lg pointer-events-auto"
        style={{ boxShadow: '0 0 20px rgba(252,211,77,0.5)' }}
      />

      {/* Hidden long-press heart (bottom-left) */}
      <button
        onPointerDown={startPress}
        onPointerUp={endPress}
        onPointerLeave={endPress}
        aria-label="hold heart"
        className="fixed bottom-5 left-5 z-[60] text-2xl pointer-events-auto opacity-30 hover:opacity-100 transition-opacity"
      >
        💗
      </button>

      {/* Heart rain */}
      <AnimatePresence>
        {heartRain > 0 && (
          <motion.div key={heartRain} className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -40, x: Math.random() * window.innerWidth, opacity: 0, rotate: 0 }}
                animate={{ y: window.innerHeight + 60, opacity: [0, 1, 1, 0], rotate: 360 }}
                transition={{ duration: 3 + Math.random() * 2, ease: 'easeIn', delay: Math.random() }}
                className="absolute text-2xl"
              >
                {['💗', '💕', '❤️', '💖'][i % 4]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cat */}
      <AnimatePresence>
        {cat && (
          <motion.div
            initial={{ y: 100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-1/2 z-[80] text-center"
          >
            <div className="text-7xl">🐱</div>
            <p className="font-hand text-2xl text-white/90 mt-2">psst… you found the moon cat.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret message */}
      <AnimatePresence>
        {secret && !cat && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] font-hand text-xl text-white/60"
          >
            (try clicking the moon again…)
          </motion.p>
        )}
      </AnimatePresence>

      {/* I love you */}
      <AnimatePresence>
        {love && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none"
          >
            <p className="font-display italic text-5xl sm:text-7xl text-white text-glow" style={{ textShadow: '0 0 40px rgba(249,168,212,0.8)' }}>
              I love you ❤️
            </p>
            <p className="font-hand text-xl text-white/70 mt-4">(the real one)</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
