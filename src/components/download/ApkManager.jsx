import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function ApkManager({config, onSave}) {
  const [version, setVersion] = useState(config?.version || '1.0.0'), [file, setFile] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const save = async e => {
    e.preventDefault(); setError('');
    if (!file || !/\.apk$/i.test(file.name)) return setError('Sélectionnez un fichier .apk signé.');
    if (!/^\d+\.\d+\.\d+$/.test(version)) return setError('Indiquez une version au format 1.0.0.');
    setBusy(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      if (!new URL(file_url).pathname.toLowerCase().endsWith('.apk')) throw new Error('L’hébergement n’a pas conservé l’extension .apk. Utilisez une URL HTTPS se terminant par .apk.');
      await onSave({ apk_url: file_url, version, size_mb: Math.round(file.size / 1048576 * 10) / 10 });
      setFile(null); e.target.reset();
    } catch (err) { setError(err.message || 'Envoi impossible.'); } finally { setBusy(false); }
  };
  return <section><h2>Version Android</h2><p className="text-sm text-[#655b52] mb-3">Lien stable : /functions/downloadApk · {config?.apk_url ? `Version actuelle : ${config.version || '1.0.0'}` : 'Aucun APK publié'}</p>
    <form onSubmit={save} className="form"><label className="block !p-3">Nouvel APK signé<input className="!p-2" type="file" accept=".apk,application/vnd.android.package-archive" onChange={e=>setFile(e.target.files?.[0] || null)}/></label><input aria-label="Version APK" value={version} onChange={e=>setVersion(e.target.value)} placeholder="Version : 1.0.0"/><button type="submit" disabled={busy}>{busy ? 'Envoi en cours…' : 'Publier cette version'}</button></form>
    {error && <p role="alert" className="mt-2 text-red-700 text-sm">{error}</p>}
  </section>;
}