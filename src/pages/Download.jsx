import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download as DownloadIcon, Smartphone } from 'lucide-react';
import { isIOS, isAndroid } from '@/components/download/device';

const APP_STORE = 'https://apps.apple.com/us/app/caprice-restaurant/id6821667525';
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.base6a980008224694e817562d88.app';

export default function Download() {
  const mobile = isIOS() || isAndroid();
  useEffect(() => {
    if (isIOS()) window.location.replace(APP_STORE);
    else if (isAndroid()) window.location.replace(PLAY_STORE);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      <div className="max-w-md mx-auto px-5 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground underline underline-offset-4">← Retour à CAPRICE</Link>
          <span className="tracking-[.25em] text-xs font-semibold">CAPRICE</span>
        </div>
        <section className="rounded-3xl bg-card text-card-foreground border border-border p-6 mt-8 text-center">
          <h1 className="font-bold text-xl">Téléchargez l’application CAPRICE</h1>
          <p className="text-sm text-muted-foreground mt-3" role="status">
            {mobile ? 'Redirection vers le store de votre téléphone… Si rien ne s’ouvre, utilisez le lien ci-dessous.' : 'Retrouvez CAPRICE sur l’App Store et Google Play.'}
          </p>
          <div className="grid gap-3 mt-6">
            <a href={APP_STORE} className="flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground p-4 font-semibold"><Smartphone size={20} aria-hidden="true" />Télécharger sur l’App Store</a>
            <a href={PLAY_STORE} className="flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground p-4 font-semibold"><DownloadIcon size={20} aria-hidden="true" />Télécharger sur Google Play</a>
          </div>
        </section>
        <p className="text-center text-xs text-muted-foreground mt-8">CAPRICE · Restaurant à Libreville</p>
      </div>
    </main>
  );
}