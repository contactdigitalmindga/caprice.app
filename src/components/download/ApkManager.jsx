import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';

const toDirectDownload = (raw) => {
  const driveMatch = raw.match(/drive\.google\.com\/file\/d\/([^/]+)/) || raw.match(/[?&]id=([^&]+)/);
  if (driveMatch) return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
  return raw;
};

export default function ApkManager({ config, onSave }) {
  const [mode, setMode] = useState('link');
  const [version, setVersion] = useState(config?.version || '1.0.0');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState(config?.apk_url || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d+\.\d+\.\d+$/.test(version)) return setError('Indiquez une version au format 1.0.0.');
    setBusy(true);
    try {
      if (mode === 'link') {
        if (!link.trim()) return setError('Collez le lien de l’APK.');
        const direct = toDirectDownload(link.trim());
        const u = new URL(direct);
        if (u.protocol !== 'https:') throw new Error('Le lien doit être en HTTPS.');
        await onSave({ apk_url: u.href, version });
        setLink(u.href);
      } else {
        if (!file || !/\.apk$/i.test(file.name)) return setError('Sélectionnez un fichier .apk signé.');
        const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
        if (!new URL(file_url).pathname.toLowerCase().endsWith('.apk')) throw new Error('L’hébergement n’a pas conservé l’extension .apk.');
        await onSave({ apk_url: file_url, version, size_mb: Math.round(file.size / 1048576 * 10) / 10 });
        setFile(null);
        e.target.reset();
      }
    } catch (err) {
      setError(err.message || 'Envoi impossible.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <h2>Version Android</h2>
      <p className="text-sm text-[#655b52] mb-3">Lien stable : /functions/downloadApk · {config?.apk_url ? `Version actuelle : ${config.version || '1.0.0'}` : 'Aucun APK publié'}</p>
      <div className="tabs">
        <button type="button" className={mode === 'link' ? 'selected' : ''} onClick={() => setMode('link')}>Coller un lien</button>
        <button type="button" className={mode === 'file' ? 'selected' : ''} onClick={() => setMode('file')}>Uploader un fichier</button>
      </div>
      <form onSubmit={save} className="form">
        {mode === 'link' ? (
          <input type="url" aria-label="Lien de l’APK" placeholder="Lien Google Drive ou URL directe .apk" value={link} onChange={(e) => setLink(e.target.value)} />
        ) : (
          <label className="block !p-3">Nouvel APK signé<input className="!p-2" type="file" accept=".apk,application/vnd.android.package-archive" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label>
        )}
        <input aria-label="Version APK" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="Version : 1.0.0" />
        <button type="submit" disabled={busy}>{busy ? 'Envoi en cours…' : 'Publier cette version'}</button>
      </form>
      {error && <p role="alert" className="mt-2 text-red-700 text-sm">{error}</p>}
    </section>
  );
}