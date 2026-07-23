import { motion } from 'framer-motion';
import { SceneShell, RevealText } from '@/components/ui';

export default function SceneSunrise() {
  return (
    <SceneShell className="text-center">
      <div className="max-w-2xl mx-auto">
        {/* Animated sun rising behind hills */}
        <div className="relative h-56 sm:h-72 mb-12 mx-auto max-w-xl">
          <div className="absolute inset-x-0 bottom-0 h-24 rounded-[100%] bg-gradient-to-t from-rose-300/30 to-transparent blur-2xl" />
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.4, ease: 'easeOut' }}
            className="absolute left-1/2 -translate-x-1/2 bottom-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full"
            style={{ background: 'radial-gradient(circle, #fff6d8, #fcd34d 40%, #fb923c 75%, rgba(251,146,60,0))', boxShadow: '0 0 80px 30px rgba(252,211,77,0.45)' }}
          />
          {/* hills */}
          <svg viewBox="0 0 400 120" className="absolute bottom-0 w-full h-20" preserveAspectRatio="none">
            <path d="M0,80 Q60,40 120,70 T240,60 T400,75 L400,120 L0,120 Z" fill="rgba(91,42,110,0.55)" />
            <path d="M0,95 Q80,60 160,85 T320,80 T400,90 L400,120 L0,120 Z" fill="rgba(26,17,64,0.7)" />
          </svg>
          {/* birds */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ x: -60, opacity: 0 }}
              whileInView={{ x: 420, opacity: [0, 1, 1, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 9, delay: i * 1.4, ease: 'linear' }}
              className="absolute top-6 text-white/70"
              style={{ top: `${10 + i * 12}%` }}
            >
              <svg width="22" height="10" viewBox="0 0 22 10"><path d="M1,8 Q6,1 11,5 Q16,1 21,8" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
            </motion.div>
          ))}
        </div>

        <RevealText
          className="space-y-5 font-display text-2xl sm:text-3xl md:text-4xl text-white/90 leading-relaxed text-glow-soft"
          stagger={0.9}
          lines={[
            'I know it\'s a weird style of good morning...',
            'but you were upset last night and I couldn\'t make you feel better,',
            <>
              so I was kinda sad... <span className="italic text-rose-200">so this one is for you.</span>
            </>,
          ]}
        />
      </div>
    </SceneShell>
  );
}
