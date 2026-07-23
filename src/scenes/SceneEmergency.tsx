import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneShell } from '@/components/ui';
import { useAudio } from '@/audio/AudioProvider';
import { Heart } from 'lucide-react';

type Prize =
  | { type: 'cat'; emoji: string; text: string }
  | { type: 'dog'; emoji: string; text: string }
  | { type: 'compliment'; text: string }
  | { type: 'joke'; text: string }
  | { type: 'hug'; text: string };

const PRIZES: Prize[] = [
  { type: 'cat', emoji: '🐱', text: "A tiny cat appeared. It believes in you. (It also wants snacks.)" },
  { type: 'dog', emoji: '🐶', text: "A very good boy has arrived. He brought you unconditional love and one (1) slobbery kiss." },
  { type: 'compliment', text: "You have a way of making people feel safe. That's a rare kind of magic." },
  { type: 'compliment', text: "Your love for those kids in the NGO? That's the kind of light the world needs." },
  { type: 'compliment', text: "You know how to respect people and their boundaries. That's rarer than you think." },
  { type: 'joke', text: "Why did the cookie go to the doctor? …because it was feeling a little crumb-y. 🍪" },
  { type: 'joke', text: "I told the moon about you. Now it keeps showing up every night just to watch. 🌙" },
  { type: 'hug', text: "Sending you the warmest, longest virtual hug. Stay there as long as you need. 🤗" },
];

export default function SceneEmergency() {
  const [prize, setPrize] = useState<Prize | null>(null);
  const [hearts, setHearts] = useState<number[]>([]);
  const { playPop, playChime, playSparkle } = useAudio();

  const fire = () => {
    const p = PRIZES[Math.floor(Math.random() * PRIZES.length)];
    setPrize(p);
    playPop(); playChime(); playSparkle();
    const hs = Array.from({ length: 12 }, (_, i) => Date.now() + i);
    setHearts(hs);
    setTimeout(() => setHearts([]), 2600);
  };

  return (
    <SceneShell className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
        className="font-display text-4xl sm:text-5xl text-white/95 text-glow mb-4"
      >
        Emergency Happiness Button
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
        className="text-white/65 mb-14 max-w-md mx-auto"
      >
        Feeling a little down? Press it. Something small and good will appear.
      </motion.p>

      <div className="relative flex flex-col items-center">
        {/* floating hearts */}
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.div
              key={h}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], y: -260, scale: 1, x: (Math.random() - 0.5) * 120 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.4, ease: 'easeOut' }}
              className="absolute -top-6 text-3xl pointer-events-none"
            >
              💗
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          onClick={fire}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={{ boxShadow: ['0 0 30px rgba(249,168,212,0.5)', '0 0 60px rgba(252,211,77,0.6)', '0 0 30px rgba(249,168,212,0.5)'] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full glass-strong flex flex-col items-center justify-center gap-2"
        >
          <Heart size={40} className="text-rose-400 heartbeat" fill="currentColor" />
          <span className="font-display text-xl text-white">Press me</span>
          <span className="text-xs text-white/60">for a little joy</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {prize && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-10 glass-strong rounded-3xl px-8 py-6 max-w-md"
          >
            {'emoji' in prize && <div className="text-5xl mb-3">{prize.emoji}</div>}
            <p className="font-display italic text-xl sm:text-2xl text-white leading-relaxed">{prize.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}
