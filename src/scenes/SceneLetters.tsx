import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneShell } from '@/components/ui';
import { useAudio } from '@/audio/AudioProvider';
import { X } from 'lucide-react';

type Letter = { title: string; color: string; body: string };

const LETTERS: Letter[] = [
  { title: 'Read when you\'re sad', color: '#7dd3fc', body: "Hey. If you're reading this, the world got a little heavy. That's okay. You don't have to carry it all at once. Put it down for a minute. Breathe. You've survived every hard day so far — that's a 100% track record. I'm so proud of you just for being here. And remember — jab tak aap ho, main hamesha hoon." },
  { title: 'Read when you\'re stressed', color: '#a78bfa', body: "Close your eyes. Drop your shoulders. Unclench your jaw. The list will still be there in five minutes. You are not a machine — you're a person, and you're allowed to pause. One thing at a time. The world can wait. I promise. Isse zyada bolunga toh class ke liye late ho jayenge — so just breathe for now." },
  { title: 'Read when you smile', color: '#fcd34d', body: "There it is. That smile. The one I'd cross oceans to see. Whatever made it appear today — hold onto it. You look absolutely radiant when you're happy. Thank you for letting the light win, even just for a moment. This is the you I'm proud of." },
  { title: 'Read when you miss me', color: '#f9a8d4', body: "I'm right here. Even when you can't see me, even when it's quiet — I'm thinking about you. You're never as far as you feel. Close your eyes and you'll find me in the space between your heartbeats. Baaki baatein call me — ek aur cheez: I'll see you very soon in real life too. 🫂" },
];

export default function SceneLetters() {
  const [open, setOpen] = useState<Letter | null>(null);
  const [opening, setOpening] = useState(false);
  const { playWhoosh, playChime } = useAudio();

  const openLetter = (l: Letter) => {
    playWhoosh();
    setOpening(true);
    setTimeout(() => { setOpen(l); setOpening(false); playChime(); }, 600);
  };

  return (
    <SceneShell className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
        className="font-display text-4xl sm:text-5xl text-white/95 text-glow mb-4"
      >
        Letters for whenever you need them
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
        className="text-white/65 mb-14 max-w-md mx-auto"
      >
        Pick one. It unfolds only for you.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {LETTERS.map((l, i) => (
          <motion.button
            key={l.title}
            onClick={() => openLetter(l)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7 }}
            whileHover={{ y: -8, rotate: i % 2 ? 2 : -2 }}
            whileTap={{ scale: 0.97 }}
            className="group relative h-44 rounded-2xl p-6 text-left glass overflow-hidden"
          >
            <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 50% 0%, ${l.color}, transparent 70%)` }} />
            {/* envelope flap */}
            <div className="absolute top-0 inset-x-0 h-1/2 origin-top"
              style={{ background: `linear-gradient(135deg, ${l.color}55, transparent)` }}
            />
            <div className="relative flex flex-col h-full justify-end">
              <p className="font-hand text-2xl text-white/95">{l.title}</p>
              <p className="text-xs text-white/50 mt-1">tap to open ✉</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Unfolding animation */}
      <AnimatePresence>
        {opening && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-72 h-48 rounded-lg bg-cream-50 shadow-2xl"
              style={{ transformOrigin: 'top' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            onClick={() => setOpen(null)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
            <motion.div
              initial={{ rotateX: -80, opacity: 0, y: 40 }}
              animate={{ rotateX: 0, opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-lg w-full rounded-2xl p-10 shadow-2xl"
              style={{ background: 'linear-gradient(180deg, #fdf6e3, #f7ecd4)', color: '#3a2e1f', transformOrigin: 'top' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setOpen(null)} className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"><X size={20} /></button>
              {/* lined paper */}
              <div className="absolute inset-x-8 top-20 bottom-10 opacity-20"
                style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #8b6f47 32px)' }}
              />
              <p className="font-hand text-3xl mb-5" style={{ color: open.color }}>{open.title}</p>
              <p className="font-hand text-xl leading-relaxed relative">{open.body}</p>
              <p className="font-hand text-lg mt-6 text-right opacity-70">— always, me</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}
