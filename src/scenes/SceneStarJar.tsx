import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneShell } from '@/components/ui';
import { useAudio } from '@/audio/AudioProvider';
import { X } from 'lucide-react';

type Star = { x: number; y: number; msg: string; kind: 'prayer' | 'promise' | 'hope' };

const STARS: Star[] = [
  { x: 30, y: 25, msg: "I hope you always have mental peace.", kind: 'prayer' },
  { x: 72, y: 30, msg: "I hope your mom's health improves soon.", kind: 'prayer' },
  { x: 22, y: 45, msg: "I hope your cousin heals faster.", kind: 'prayer' },
  { x: 48, y: 38, msg: "I hope you succeed — and always smile.", kind: 'hope' },
  { x: 68, y: 50, msg: "Jab tak aap ho, main hamesha hoon. Agar aap na raho, fir bhi main hamesha hoon.", kind: 'promise' },
  { x: 35, y: 62, msg: "You know how to respect people, boundaries, and cherish the people around you. Keep doing like this — I'm with you.", kind: 'promise' },
  { x: 58, y: 68, msg: "Your love for the kids in your NGO — that's the kind of light the world needs. Never lose it.", kind: 'hope' },
];

const KIND_COLOR: Record<Star['kind'], string> = {
  prayer: '#7dd3fc', promise: '#fcd34d', hope: '#f9a8d4',
};
const KIND_LABEL: Record<Star['kind'], string> = {
  prayer: 'A prayer for you', promise: 'A promise', hope: 'A hope',
};

export default function SceneStarJar() {
  const [open, setOpen] = useState<Star | null>(null);
  const { playSparkle } = useAudio();

  return (
    <SceneShell className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="font-display text-4xl sm:text-5xl text-white/95 text-glow mb-4"
      >
        My prayers, caught in stars
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
        className="text-white/65 mb-12 max-w-md mx-auto"
      >
        Each one is a little light I'm sending your way. Tap to let it glow.
      </motion.p>

      {/* Glass jar */}
      <div className="relative w-72 h-96 sm:w-80 sm:h-[26rem] mx-auto">
        {/* jar lid */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-52 h-6 rounded-t-xl bg-gradient-to-b from-white/30 to-white/10 border border-white/20" />
        {/* jar body */}
        <div className="absolute inset-0 mt-3 rounded-[2.5rem] glass overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-lavender-300/10 to-sky-300/10" />
          {/* shine */}
          <div className="absolute top-4 left-6 w-8 h-24 rounded-full bg-white/30 blur-md" />
          {STARS.map((s, i) => (
            <motion.button
              key={i}
              onClick={() => { setOpen(s); playSparkle(); }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, type: 'spring', bounce: 0.6 }}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.85 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              aria-label="A glowing star"
            >
              <span className="block w-3 h-3 rounded-full" style={{ background: KIND_COLOR[s.kind], boxShadow: `0 0 14px 4px ${KIND_COLOR[s.kind]}` }} />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            onClick={() => setOpen(null)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.7, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.7 }}
              className="glass-strong rounded-4xl px-8 py-10 max-w-md text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setOpen(null)} className="absolute top-4 right-4 text-white/60 hover:text-white"><X size={20} /></button>
              <div className="mb-5 flex justify-center">
                <motion.span
                  className="block w-5 h-5 rounded-full"
                  style={{ background: KIND_COLOR[open.kind], boxShadow: `0 0 30px 8px ${KIND_COLOR[open.kind]}` }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: KIND_COLOR[open.kind] }}>{KIND_LABEL[open.kind]}</p>
              <p className="font-display italic text-2xl sm:text-3xl text-white leading-relaxed">{open.msg}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}
