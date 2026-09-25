import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download as DownloadIcon, ScanLine, FileDown, ShieldCheck, Check, Copy, Link2, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { isIOS, isAndroid } from '@/components/download/device';

const AppleLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);
const AndroidLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.43 11.43 0 00-8.94 0L5.65 5.67c-.18-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85L6.4 9.48A10.81 10.81 0 001 18h22a10.81 10.81 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
  </svg>
);

const IPHONE_TUTORIAL = 'https://media.base44.com/images/public/6a980008224694e817562d88/c6fc315ea_D800B4E7-EEAF-43F7-9EFE-8EE4E09E21D9.png';
const APP_LINK = 'https://caprice-app.base44.app/';

const AStep = ({ n, icon: Icon, title, children, color }) => (
  <div className="flex gap-3">
    <div className="flex-none w-9 h-9 rounded-full grid place-items-center text-white shadow-sm" style={{ background: color }}>
      <Icon size={18} />
    </div>
    <div className="flex-1 pb-5">
      <p className="font-semibold text-[15px] text-[#211a15] leading-snug">{n}. {title}</p>
      {children && <p className="text-sm text-[#4a6052] mt-1 leading-relaxed">{children}</p>}
    </div>
  </div>
);

export default function Download() {
  const [config, setConfig] = useState(null);
  const [tab, setTab] = useState(() => (isIOS() ? 'ios' : isAndroid() ? 'android' : 'ios'));
  const [copied, setCopied] = useState(false);
  useEffect(() => { base44.entities.AppDistribution.list('-updated_date', 1).then(rows => setConfig(rows[0] || null)).catch(() => {}); }, []);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(APP_LINK); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <main className="min-h-screen text-[#211a15] font-body" style={{ background: '#f7f2e9' }}>
      <div className="max-w-md mx-auto px-5 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-[#9d7844] underline underline-offset-4">← Retour à CAPRICE</Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl grid place-items-center text-[#e4c98a] font-bold text-lg shadow" style={{ background: '#211a15' }}>C</div>
            <span className="tracking-[.25em] text-xs text-[#9d7844] font-semibold">CAPRICE</span>
          </div>
        </div>

        <h1 className="font-bold text-xl text-center text-[#211a15] mt-6">Téléchargez l’application CAPRICE</h1>
        <p className="text-center text-sm text-[#655b52] mt-1">Choisissez votre appareil pour installer l’application.</p>

        {/* Onglets coulissants */}
        <div className="grid grid-cols-2 gap-2 mt-6 p-1.5 rounded-2xl" style={{ background: '#e7dccb' }}>
          <button onClick={() => setTab('ios')} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition" style={tab === 'ios' ? { background: '#fff', color: '#0b6bcf', boxShadow: '0 2px 8px rgba(0,0,0,.08)' } : { color: '#655b52' }}>
            <AppleLogo className="w-5 h-5" /> iPhone / iPad
          </button>
          <button onClick={() => setTab('android')} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition" style={tab === 'android' ? { background: '#fff', color: '#2e9e4f', boxShadow: '0 2px 8px rgba(0,0,0,.08)' } : { color: '#655b52' }}>
            <AndroidLogo className="w-5 h-5" /> Android
          </button>
        </div>

        {tab === 'ios' ? (
          <section className="rounded-3xl p-6 mt-5" style={{ background: '#eef6fb' }}>
            <header className="flex items-center gap-3 mb-4">
              <span className="w-11 h-11 rounded-2xl grid place-items-center text-white" style={{ background: '#0b6bcf' }}><AppleLogo className="w-6 h-6" /></span>
              <div>
                <h2 className="font-bold text-lg text-[#211a15] leading-tight">iPhone / iPad</h2>
                <p className="text-xs text-[#3a6a8f]">Installation PWA — Ajouter à l’écran d’accueil</p>
              </div>
            </header>

            {/* Lien à copier */}
            <div className="rounded-2xl p-4 mb-5" style={{ background: '#f5e6d8' }}>
              <p className="text-xs font-semibold text-[#655b52] flex items-center gap-1.5"><Link2 size={13} /> Lien de l’application :</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex-1 bg-white rounded-full px-3 py-2 text-sm font-medium text-[#211a15] truncate border border-[#eadfce]">{APP_LINK}</span>
                <button onClick={copyLink} className="flex-none w-9 h-9 rounded-full grid place-items-center text-white" style={{ background: copied ? '#2e9e4f' : '#0b6bcf' }}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-xs text-[#655b52] mt-2">Accédez à l’application en 1 clic depuis votre écran d’accueil !</p>
            </div>

            {/* Image tutorielle en grand */}
            <a href={IPHONE_TUTORIAL} target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden border border-[#d6e8f5]">
              <img src={IPHONE_TUTORIAL} alt="Tutoriel d’installation CAPRICE sur iPhone" className="w-full h-auto block" />
            </a>
            <p className="text-center text-xs text-[#3a6a8f] mt-2 flex items-center justify-center gap-1"><ExternalLink size={12} /> Touchez l’image pour l’agrandir</p>
          </section>
        ) : (
          <section className="rounded-3xl p-6 mt-5" style={{ background: '#eef7ee' }}>
            <header className="flex items-center gap-3 mb-4">
              <span className="w-11 h-11 rounded-2xl grid place-items-center text-white" style={{ background: '#2e9e4f' }}><AndroidLogo className="w-6 h-6" /></span>
              <div>
                <h2 className="font-bold text-lg text-[#211a15] leading-tight">Android</h2>
                <p className="text-xs text-[#3a7a52]">Téléchargement direct de l’APK</p>
              </div>
            </header>

            {/* Bouton de téléchargement en haut */}
            <a href="/functions/downloadApk" className="flex items-center justify-center gap-2 rounded-2xl text-white p-4 font-bold text-base shadow-md" style={{ background: '#2e9e4f' }}>
              <DownloadIcon size={22} /> Télécharger l’application {config?.version ? `(v${config.version})` : ''}
            </a>
            {config?.size_mb ? <p className="text-center text-xs text-[#4a6052] mt-2">Taille : {config.size_mb} Mo</p> : null}

            {/* Tuto en bas */}
            <div className="mt-6">
              <AStep n={1} icon={DownloadIcon} color="#2e9e4f" title="Appuyez sur « Télécharger l’application »">Le fichier APK de CAPRICE se télécharge sur votre téléphone.</AStep>
              <AStep n={2} icon={FileDown} color="#2e9e4f" title="Ouvrez le fichier téléchargé">Touchez la notification de téléchargement ou ouvrez le .apk depuis vos téléchargements.</AStep>
              <AStep n={3} icon={ShieldCheck} color="#2e9e4f" title="Autorisez l’installation">Si demandé, autorisez l’installation depuis cette source, puis touchez « Installer ».</AStep>
              <AStep n={4} icon={Check} color="#2e9e4f" title="C’est prêt !">L’icône CAPRICE apparaît sur votre écran d’accueil. Ouvrez l’application.</AStep>
            </div>
          </section>
        )}

        <p className="text-center text-xs text-[#655b52] mt-8">Application distribuée directement par CAPRICE — Restaurant fine dining à Libreville.</p>
      </div>
    </main>
  );
}