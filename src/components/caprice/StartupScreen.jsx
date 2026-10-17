import React from 'react';
import { useCaprice } from '@/components/caprice/AppContext';
export default function StartupScreen() {
  const { imageProgress, startupError, prepareApp } = useCaprice();
  return <main className="caprice-app startup-screen" aria-busy={!startupError}>
    <small>CAPRICE</small><h1>Votre expérience se prépare</h1>
    {startupError ? <><p role="alert">{startupError}</p><button className="outline" onClick={prepareApp}>Réessayer</button></> : <>
      <p role="status">Préchargement des photographies · {imageProgress} %</p>
      <progress max="100" value={imageProgress} aria-label="Préchargement des photographies" />
    </>}
  </main>;
}