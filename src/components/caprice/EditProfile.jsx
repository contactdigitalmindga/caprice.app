import React, { useState } from 'react';
import { Loader2, Camera, X, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from '@/components/ui/use-toast';
import { useCaprice } from './AppContext';
import { useSignedPhoto } from './useSignedPhoto';

export default function EditProfile({ onClose }) {
  const { user, refreshUser } = useCaprice();
  const [name, setName] = useState(user?.display_name || user?.full_name || '');
  const [photoUri, setPhotoUri] = useState(user?.profile_photo || null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const preview = useSignedPhoto(photoUri);

  const pickPhoto = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast({ title: 'Photo trop lourde', description: '5 Mo maximum.', variant: 'destructive' }); return; }
    setUploading(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      setPhotoUri(file_uri);
    } catch {
      toast({ title: 'Erreur', description: 'Photo impossible à charger.', variant: 'destructive' });
    } finally { setUploading(false); }
  };

  const save = async () => {
    if (!name.trim()) { toast({ title: 'Veuillez renseigner votre nom.', variant: 'destructive' }); return; }
    setBusy(true);
    try {
      await base44.auth.updateMe({ display_name: name.trim(), profile_photo: photoUri });
      await refreshUser();
      toast({ title: 'Profil mis à jour' });
      onClose();
    } catch {
      toast({ title: 'Erreur', description: 'Enregistrement impossible.', variant: 'destructive' });
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'var(--caprice-overlay)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-t-3xl p-6 pb-8" style={{ background: 'var(--caprice-card)', maxHeight: '92vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: 'var(--caprice-fg)' }}>Modifier mon profil</h2>
          <button onClick={onClose} className="back-arrow" aria-label="Fermer"><X size={18} /></button>
        </div>

        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="relative">
            <div className="profile-avatar" style={{ width: 96, height: 96, fontSize: 34 }}>
              {preview ? <img src={preview} alt="" className="w-full h-full rounded-full object-cover" /> : <span>{(name || 'C')[0].toUpperCase()}</span>}
            </div>
            <label className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full grid place-items-center cursor-pointer" style={{ background: 'var(--caprice-accent)', color: '#fff', boxShadow: '0 4px 12px var(--caprice-shadow)' }}>
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              <input type="file" accept="image/*" className="hidden" onChange={pickPhoto} disabled={uploading || busy} />
            </label>
          </div>
          <small style={{ color: 'var(--caprice-muted-fg)' }}>Photo de profil (stockée en privé)</small>
        </div>

        <label className="block text-sm mb-1" style={{ color: 'var(--caprice-muted-fg)' }}>Nom complet</label>
        <input value={name} onChange={e => setName(e.target.value)} maxLength={60} className="w-full mb-6" style={{ background: 'var(--caprice-input-bg)', border: '1px solid var(--caprice-input-border)', borderRadius: 16, padding: 15, outline: 'none', color: 'var(--caprice-fg)', fontSize: 16 }} />

        <button onClick={save} disabled={busy || uploading} className="caprice-go" style={{ margin: 0 }}>
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}