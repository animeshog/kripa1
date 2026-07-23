import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneShell } from '@/components/ui';
import { useAudio } from '@/audio/AudioProvider';
import { X } from 'lucide-react';

type Flower = { x: number; y: number; color: string; center: string; msg: string; delay: number };

const FLOWERS: Flower[] = [
  { x: 15, y: 30, color: '#f9a8d4', center: '#fcd34d', msg: "You came to my life when I needed someone the most.", delay: 0 },
  { x: 38, y: 55, color: '#a78bfa', center: '#fcd34d', msg: "I was in sorrow — so dark that I couldn't find myself.", delay: 0.15 },
  { x: 60, y: 28, color: '#7dd3fc', center: '#fff', msg: "You came to me like a present got sent.", delay: 0.3 },
  { x: 82, y: 50, color: '#fb7185', center: '#fcd34d', msg: "Who knew a scholarship form would turn out like this... I regret 0%.", delay: 0.45 },
  { x: 25, y: 72, color: '#fcd34d', center: '#fb7185', msg: "Thanks for your mind that day on 30th March that made you text me out of nowhere.", delay: 0.6 },
  { x: 70, y: 75, color: '#c4b5fd', center: '#fcd34d', msg: "Why am I so emotionally driven for you? I have no answer — and sometimes being answerless clears a lot of things.", delay: 0.75 },
];

function FlowerSVG({ f, onClick }: { f: Flower; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, delay: f.delay, type: 'spring', bounce: 0.5 }}
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.92 }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${f.x}%`, top: `${f.y}%` }}
      aria-label="A flower with a message"
    >
      <div className="relative sway" style={{ animationDelay: `${f.delay}s` }}>
        {/* stem */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 w-1 h-16 bg-green-400/60 rounded-full" />
        {/* petals */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="relative">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse key={deg} cx="32" cy="18" rx="9" ry="15" fill={f.color} transform={`rotate(${deg} 32 32)`} opacity="0.92" />
          ))}
          <circle cx="32" cy="32" r="9" fill={f.center} />
        </svg>
      </div>
    </motion.button>
  );
}

export default function SceneGarden() {
  const [open, setOpen] = useState<Flower | null>(null);
  const { playChime, playSparkle } = useAudio();

  return (
    <SceneShell className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="font-display text-4xl sm:text-5xl text-white/95 text-glow mb-4"
      >
        How you found me
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
        className="text-white/65 mb-14 max-w-md mx-auto"
      >
        Each flower holds a piece of our story. Tap one to let it speak.
      </motion.p>

      <div className="relative w-full max-w-3xl h-[420px] sm:h-[460px] mx-auto">
        {/* ground */}
        <div className="absolute bottom-0 inset-x-0 h-24 rounded-[100%] bg-green-400/10 blur-2xl" />
        {FLOWERS.map((f) => (
          <FlowerSVG key={f.msg} f={f} onClick={() => { setOpen(f); playChime(); playSparkle(); }} />
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            onClick={() => setOpen(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.7, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.7 }}
              className="glass-strong rounded-4xl px-8 py-10 max-w-md text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setOpen(null)} className="absolute top-4 right-4 text-white/60 hover:text-white"><X size={20} /></button>
              <div className="mb-5 flex justify-center">
                <svg width="56" height="56" viewBox="0 0 64 64">
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <ellipse key={deg} cx="32" cy="18" rx="9" ry="15" fill={open.color} transform={`rotate(${deg} 32 32)`} />
                  ))}
                  <circle cx="32" cy="32" r="9" fill={open.center} />
                </svg>
              </div>
              <p className="font-display italic text-2xl sm:text-3xl text-white leading-relaxed">{open.msg}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}
