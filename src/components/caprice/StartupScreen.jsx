import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useCaprice } from '@/components/caprice/AppContext';
import '@/components/caprice/startup-screen.css';
const logo = 'https://media.base44.com/images/public/6a980008224694e817562d88/f994c43ed_download.webp';
export default function StartupScreen() {
  const { imageProgress, startupError, prepareApp } = useCaprice();
  const reducedMotion = useReducedMotion();
  const progress = Math.min(100, Math.max(0, Number(imageProgress) || 0));
  return <main className="caprice-startup" aria-busy={!startupError}>
    <motion.div className="caprice-startup-content" initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}>
      <motion.img className="caprice-startup-logo" src={logo} alt="CAPRICE" width="1024" height="1024" fetchPriority="high" initial={{ scale: reducedMotion ? 1 : 0.96 }} animate={{ scale: 1 }} transition={{ duration: reducedMotion ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }} />
      {startupError ? <div className="caprice-startup-feedback"><p role="alert">{startupError}</p><button onClick={prepareApp}>Réessayer</button></div> : <div className="caprice-startup-feedback">
        <div className="caprice-startup-track" role="progressbar" aria-label="Chargement de votre expérience" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: progress / 100 }} transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <p role="status">Votre expérience en cours de téléchargement</p>
      </div>}
    </motion.div>
  </main>;
}