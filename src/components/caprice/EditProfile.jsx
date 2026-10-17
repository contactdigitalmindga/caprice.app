import React, { useState } from 'react';
import EditProfilePanel from '@/components/caprice/EditProfilePanel';
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

  return <EditProfilePanel onClose={onClose} preview={preview} name={name} setName={setName} uploading={uploading} busy={busy} pickPhoto={pickPhoto} save={save} />;
}