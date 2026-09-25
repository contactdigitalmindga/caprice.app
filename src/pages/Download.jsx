import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download as DownloadIcon, Share2, Smartphone } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { isIOS, isAndroid } from '@/components/download/device';

export default function Download() {
  const [config, setConfig] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState('');
  useEffect(() => { base44.entities.AppDistribution.list('-updated_date', 1).then(rows => setConfig(rows[0] || null)).catch(() => setError('Informations de téléchargement indisponibles.')).finally(() => setLoading(false)); }, []);
  const ios = isIOS(), android = isAndroid();
  return <main className="min-h-screen bg-[#f7f2e9] text-[#211a15] px-5 py-12 font-body"><div className="max-w-md mx-auto">
    <Link to="/" className="text-sm underline underline-offset-4">← Retour à CAPRICE</Link>
    <div className="mt-12 text-center"><div className="mx-auto w-20 h-20 rounded-3xl bg-[#211a15] text-[#e4c98a] grid place-items-center font-heading font-bold text-5xl">C</div><p className="mt-5 tracking-[.3em] text-sm">CAPRICE</p>
    <h1 className="font-heading text-3xl mt-6">{ios ? 'Installer sur iPhone / iPad' : android ? 'Application Android' : 'Télécharger CAPRICE'}</h1></div>
    {ios ? <section className="mt-9 rounded-3xl bg-white p-6 shadow-sm"><h2 className="font-heading text-xl">Installer l’application sur iPhone</h2><p className="mt-2 text-sm text-[#655b52]">Installation via Safari, sans fichier IPA.</p><ol className="mt-6 space-y-4 list-decimal pl-5 leading-relaxed"><li>Ouvrez cette page dans Safari.</li><li>Appuyez sur le bouton Partager <Share2 size={18} className="inline-block" aria-label="Partager" />.</li><li>Sélectionnez « Ajouter à l’écran d’accueil ».</li><li>Appuyez sur « Ajouter ».</li></ol></section> : android ? <section className="mt-9 rounded-3xl bg-white p-6 text-center shadow-sm"><Smartphone className="mx-auto text-[#9d7844]" size={34}/><h2 className="font-heading text-xl mt-4">Télécharger l’application Android</h2>{loading ? <p className="mt-5">Chargement…</p> : config?.apk_url ? <><a href="/functions/downloadApk" className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#211a15] text-white p-4 font-semibold"><DownloadIcon size={20}/> Télécharger l’APK</a><p className="mt-4 text-sm">Version : {config.version || '1.0.0'}{config.size_mb ? ` · Taille : ${config.size_mb} MB` : ''}</p></> : <p className="mt-5 text-[#655b52]">L’APK sera disponible prochainement.</p>}</section> : <section className="mt-9 rounded-3xl bg-white p-6 text-center shadow-sm"><Smartphone className="mx-auto text-[#9d7844]" size={34}/><p className="mt-4">Cette application est conçue pour les smartphones.</p><Link to="/" className="mt-5 inline-block underline underline-offset-4">Accéder à la version web</Link></section>}
    {error && <p role="alert" className="mt-4 text-center text-red-700">{error}</p>}
    <p className="text-center text-sm text-[#655b52] mt-8">Cette application est distribuée directement par CAPRICE.</p>
  </div></main>;
}