import { motion } from 'framer-motion';
import { SceneShell } from '@/components/ui';
import { useAudio } from '@/audio/AudioProvider';
import { Sun, CloudRain, Moon, Sunrise } from 'lucide-react';

const WEATHERS = [
  { key: 'sunrise', label: 'Sunrise', icon: Sunrise, color: '#fb923c' },
  { key: 'sunny', label: 'Sunny', icon: Sun, color: '#fcd34d' },
  { key: 'rain', label: 'Rain', icon: CloudRain, color: '#7dd3fc' },
  { key: 'night', label: 'Night', icon: Moon, color: '#a78bfa' },
] as const;

export default function SceneWeather() {
  const { weather, setWeather, playWhoosh } = useAudio();

  return (
    <SceneShell className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
        className="font-display text-4xl sm:text-5xl text-white/95 text-glow mb-4"
      >
        Change the weather of this little world
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
        className="text-white/65 mb-14 max-w-md mx-auto"
      >
        Whatever feels right for you right now. The whole sky listens.
      </motion.p>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {WEATHERS.map((w) => {
          const Icon = w.icon;
          const active = weather === w.key;
          return (
            <motion.button
              key={w.key}
              onClick={() => { setWeather(w.key); playWhoosh(); }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.94 }}
              className={`relative flex flex-col items-center gap-3 px-6 py-6 rounded-3xl w-28 sm:w-32 transition-colors ${active ? 'glass-strong glow-soft' : 'glass'}`}
            >
              <motion.span
                animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 2, repeat: active ? Infinity : 0 }}
                style={{ color: w.color }}
              >
                <Icon size={32} />
              </motion.span>
              <span className={`text-sm font-medium ${active ? 'text-white' : 'text-white/70'}`}>{w.label}</span>
              {active && (
                <motion.div layoutId="weather-active" className="absolute -bottom-1 w-8 h-1 rounded-full" style={{ background: w.color }} />
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }}
        className="mt-12 font-hand text-2xl text-white/60"
      >
        ☀ Sunny · 🌧 Rain · 🌌 Night — your sky, your choice.
      </motion.p>
    </SceneShell>
  );
}
