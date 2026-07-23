import { motion } from 'framer-motion';
import { useAudio } from '@/audio/AudioProvider';
import { Volume2, VolumeX } from 'lucide-react';

export default function MuteButton() {
  const { muted, toggleMuted, started } = useAudio();
  if (!started) return null;
  return (
    <motion.button
      onClick={toggleMuted}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] w-11 h-11 rounded-full glass-strong flex items-center justify-center text-white"
      aria-label={muted ? 'Unmute music' : 'Mute music'}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </motion.button>
  );
}
