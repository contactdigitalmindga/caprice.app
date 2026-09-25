import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download as DownloadIcon, Share2, Plus, Check, QrCode, ScanLine, FileDown, ShieldCheck, Smartphone, AppWindow, PackageCheck } from 'lucide-react';
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

const Step = ({ n, icon: Icon, title, children, color }) => (
  <div className="flex gap-3">
    <div className="flex-none w-9 h-9 rounded-full grid place-items-center text-white shadow-sm" style={{ background: color }}>
      <Icon size={18} />
    </div>
    <div className="flex-1 pb-6">
      <p className="font-semibold text-[15px] text-[#211a15] leading-snug">{n}. {title}</p>
      {children && <p className="text-sm text-[#655b52] mt-1 leading-relaxed">{children}</p>}
    </div>
  </div>
);

const IOSSection = () => (
  <section className="rounded-3xl p-6 mt-5" style={{ background: '#eef6fb' }}>
    <header className="flex items-center gap-3 mb-2">
      <span className="w-11 h-11 rounded-2xl grid place-items-center text-white" style={{ background: '#0b6bcf' }}><AppleLogo className="w-6 h-6" /></span>
      <div>
        <h2 className="font-bold text-lg text-[#211a15] leading-tight">iPhone / iPad</h2>
        <p className="text-xs text-[#3a6a8f]">Installation PWA — Ajouter à l’écran d’accueil</p>
      </div>
    </header>
    <p className="text-sm text-[#4a5560] leading-relaxed mb-5">Sur iPhone et iPad, l’application s’installe sous forme de PWA. Ajoutez-la à votre écran d’accueil depuis Safari.</p>
    <Step n={1} icon={ScanLine} color="#0b6bcf" title="Scannez le QR code">Ouvrez l’appareil photo de votre iPhone et scannez le QR code ci-dessus.</Step>
    <Step n={2} icon={QrCode} color="#0b6bcf" title="Ouvrez le lien dans Safari">Touchez la notification Safari qui apparaît en haut de l’écran.</Step>
    <Step n={3} icon={Share2} color="#0b6bcf" title="Appuyez sur Partager">En bas de Safari, touchez l’icône de partage (carré avec flèche vers le haut).</Step>
    <Step n={4} icon={Plus} color="#0b6bcf" title="Choisissez « Ajouter à l’écran d’accueil »">Faites défiler et sélectionnez cette option dans la feuille de partage.</Step>
    <Step n={5} icon={Check} color="#0b6bcf" title="Confirmez avec « Ajouter »">L’icône CAPRICE apparaît sur votre écran d’accueil. C’est prêt !</Step>
  </section>
);

const AndroidSection = ({ config }) => (
  <section className="rounded-3xl p-6 mt-5" style={{ background: '#eef7ee' }}>
    <header className="flex items-center gap-3 mb-2">
      <span className="w-11 h-11 rounded-2xl grid place-items-center text-white" style={{ background: '#2e9e4f' }}><AndroidLogo className="w-6 h-6" /></span>
      <div>
        <h2 className="font-bold text-lg text-[#211a15] leading-tight">Android</h2>
        <p className="text-xs text-[#3a7a52]">Téléchargement direct de l’APk</p>
      </div>
    </header>
    <p className="text-sm text-[#4a6052] leading-relaxed mb-5">Sur Android, téléchargez directement le fichier APK de l’application et installez-le sur votre téléphone.</p>
    <Step n={1} icon={ScanLine} color="#2e9e4f" title="Scannez le QR code">Ouvrez l’appareil photo de votre téléphone et scannez le QR code ci-dessus.</Step>
    <Step n={2} icon={DownloadIcon} color="#2e9e4f" title="Touchez « Télécharger l’APK »">Sur la page qui s’ouvre, appuyez sur le bouton vert de téléchargement.</Step>
    <Step n={3} icon={FileDown} color="#2e9e4f" title="Patientez pendant le téléchargement">Le fichier .apk se télécharge. Vous le retrouverez dans vos notifications.</Step>
    <Step n={4} icon={ShieldCheck} color="#2e9e4f" title="Autorisez l’installation">Si demandé, autorisez l’installation depuis cette source, puis touchez « Installer ».</Step>
    <Step n={5} icon={Check} color="#2e9e4f" title="C’est prêt !">L’icône CAPRICE apparaît sur votre écran d’accueil. Ouvrez l’application.</Step>
    <a href="/functions/downloadApk" className="mt-2 flex items-center justify-center gap-2 rounded-2xl text-white p-4 font-semibold shadow-md" style={{ background: '#2e9e4f' }}>
      <DownloadIcon size={20} /> Télécharger l’APK {config?.version ? `(v${config.version})` : ''}
    </a>
    {config?.size_mb ? <p className="text-center text-xs text-[#4a6052] mt-2">Taille : {config.size_mb} Mo</p> : null}
  </section>
);

export default function Download() {
  const [config, setConfig] = useState(null), [loading, setLoading] = useState(true);
  useEffect(() => { base44.entities.AppDistribution.list('-updated_date', 1).then(rows => setConfig(rows[0] || null)).catch(() => {}).finally(() => setLoading(false)); }, []);
  const ios = isIOS(), android = isAndroid();
  const downloadUrl = config?.download_url || (window.location.origin + '/download');
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&format=png&data=${encodeURIComponent(downloadUrl)}`;
  const showIOS = ios || (!ios && !android);
  const showAndroid = android || (!ios && !android);

  return (
    <main className="min-h-screen text-[#211a15] font-body" style={{ background: '#f7f2e9' }}>
      <div className="max-w-md mx-auto px-5 py-10">
        <Link to="/" className="text-sm text-[#9d7844] underline underline-offset-4">← Retour à CAPRICE</Link>

        <div className="text-center mt-6">
          <div className="mx-auto w-16 h-16 rounded-2xl grid place-items-center text-[#e4c98a] font-bold text-3xl shadow-md" style={{ background: '#211a15' }}>C</div>
          <p className="mt-3 tracking-[.3em] text-xs text-[#9d7844]">CAPRICE</p>
        </div>

        <div className="bg-white rounded-3xl p-6 mt-7 text-center shadow-lg">
          <h1 className="font-bold text-base text-[#211a15] leading-snug px-2">SCANNEZ CE QR CODE POUR TÉLÉCHARGER L’APPLICATION</h1>
          <div className="my-5 flex justify-center">
            <img src={qrSrc} alt="QR code de téléchargement CAPRICE" className="w-60 h-60 rounded-2xl" />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-[#655b52]">
            <Smartphone size={16} />
            <span className="font-medium">{downloadUrl.replace(/^https?:\/\//, '')}</span>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-[#655b52] mt-8">Chargement…</p>
        ) : (
          <>
            {showIOS && <IOSSection />}
            {showAndroid && <AndroidSection config={config} />}
          </>
        )}

        <p className="text-center text-xs text-[#655b52] mt-8">Application distribuée directement par CAPRICE — Restaurant fine dining à Libreville.</p>
      </div>
    </main>
  );
}