import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AudioProvider } from '@/audio/AudioProvider';
import Background from '@/components/Background';
import CursorGlow from '@/components/CursorGlow';
import MuteButton from '@/components/MuteButton';
import EasterEggs from '@/components/EasterEggs';
import SceneIntro from '@/scenes/SceneIntro';
import SceneSunrise from '@/scenes/SceneSunrise';
import SceneGarden from '@/scenes/SceneGarden';
import SceneStarJar from '@/scenes/SceneStarJar';
import SceneLetters from '@/scenes/SceneLetters';
import SceneVinyl from '@/scenes/SceneVinyl';
import SceneWeather from '@/scenes/SceneWeather';
import SceneEmergency from '@/scenes/SceneEmergency';
import SceneGame from '@/scenes/SceneGame';
import SceneFinal from '@/scenes/SceneFinal';

export default function App() {
  const [begun, setBegun] = useState(false);

  return (
    <AudioProvider>
      <Background />
      <CursorGlow />

      <AnimatePresence>
        {!begun && (
          <motion.div key="intro" exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 1.2, ease: 'easeInOut' }}>
            <SceneIntro onBegin={() => setBegun(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {begun && (
          <motion.main
            key="story"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}
          >
            <SceneSunrise />
            <SceneGarden />
            <SceneStarJar />
            <SceneLetters />
            <SceneVinyl />
            <SceneWeather />
            <SceneEmergency />
            <SceneGame />
            <SceneFinal />
            <footer className="py-10 text-center text-white/40 text-sm font-hand text-lg">
              made with a lot of love, just for you, babe ♡
            </footer>
          </motion.main>
        )}
      </AnimatePresence>

      <MuteButton />
      <EasterEggs />
    </AudioProvider>
  );
}
