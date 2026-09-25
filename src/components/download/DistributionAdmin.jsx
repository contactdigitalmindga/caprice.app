import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import ApkManager from './ApkManager';
import DownloadQrAdmin from './DownloadQrAdmin';

export default function DistributionAdmin() {
  const [config, setConfig] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState('');
  useEffect(() => { base44.entities.AppDistribution.list('-updated_date', 1).then(rows=>setConfig(rows[0] || null)).catch(()=>setError('Chargement impossible.')).finally(()=>setLoading(false)); }, []);
  const save = async changes => { const next = config ? await base44.entities.AppDistribution.update(config.id, changes) : await base44.entities.AppDistribution.create(changes); setConfig(next); };
  if (loading) return <p>Chargement…</p>;
  return <div>{error && <p role="alert">{error}</p>}<ApkManager key={config?.apk_url || 'new'} config={config} onSave={save}/><DownloadQrAdmin key={config?.download_url || 'new'} config={config} onSave={save}/></div>;
}