import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneShell } from '@/components/ui';
import { useAudio } from '@/audio/AudioProvider';
import confetti from 'canvas-confetti';

const LINES = [
  'You say your heart is made of rock...',
  'emotionless.',
  'Aap mujhe nadaan ya naasamajh samajh lena...',
  'but if your heart\'s made of the strongest matter on Earth,',
  'then I\'ll be the warmth that melts it.',
  'That\'s all from me — see you soon after class...',
  'and see you very soon in real life too. 🫂',
  'Ily (which one that you decide)',
];

export default function SceneFinal() {
  const [step, setStep] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const { playChime, playSparkle, toggleMuted, muted } = useAudio();
  const fired = useRef(false);

  useEffect(() => {
    if (step >= LINES.length) { setShowButton(true); return; }
    const id = setTimeout(() => setStep((s) => s + 1), step === 0 ? 1400 : 2400);
    return () => clearTimeout(id);
  }, [step]);

  const celebrateNow = () => {
    if (fired.current) return;
    fired.current = true;
    setCelebrate(true);
    playChime(); playSparkle();
    const end = Date.now() + 3500;
    const colors = ['#f9a8d4', '#a78bfa', '#fcd34d', '#7dd3fc', '#fb7185'];
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    const heart = confetti.create(undefined, { resize: true, useWorker: true });
    heart({ particleCount: 30, spread: 360, startVelocity: 30, scalar: 1.4, shapes: ['circle'], colors: ['#f9a8d4', '#fb7185'], origin: { y: 0.5 } });
    setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.4 }, colors }), 600);
    setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.3 }, colors }), 1200);
  };

  return (
    <SceneShell className="text-center">
      {/* beating heart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="mb-12"
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1, 1.06, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl sm:text-7xl"
          style={{ filter: 'drop-shadow(0 0 30px rgba(249,168,212,0.7))' }}
        >
          ❤️
        </motion.div>
      </motion.div>

      <div className="space-y-4 max-w-2xl mx-auto min-h-[320px]">
        {LINES.slice(0, step).map((l, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className={`font-display leading-relaxed text-glow ${
              l.includes('Ily') ? 'text-3xl sm:text-4xl text-rose-200 italic'
              : l.includes('warmth') ? 'text-3xl sm:text-4xl text-amber-200 italic'
              : i % 2 === 0 ? 'text-2xl sm:text-3xl text-white/95'
              : 'text-2xl sm:text-3xl text-rose-200 italic'
            }`}
          >
            {l}
          </motion.p>
        ))}
      </div>

      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 flex flex-col items-center gap-6"
          >
            <motion.button
              onClick={celebrateNow}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
              animate={{ boxShadow: ['0 0 30px rgba(249,168,212,0.4)', '0 0 70px rgba(252,211,77,0.6)', '0 0 30px rgba(249,168,212,0.4)'] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="px-10 py-5 rounded-full glass-strong text-white font-display text-xl soft-bounce"
            >
              Press only when you smile 😊
            </motion.button>

            {celebrate && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="font-hand text-3xl text-white/90"
              >
                There it is. That smile. Worth everything. 🤍
              </motion.p>
            )}

            <button onClick={toggleMuted} className="text-white/50 text-sm hover:text-white/80">
              {muted ? '🔇 sound is off' : '🔊 sound is on'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}
