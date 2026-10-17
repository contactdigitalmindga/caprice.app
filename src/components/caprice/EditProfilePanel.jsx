import React, { useRef } from 'react';
import { Loader2 } from 'lucide-react';
import '@/components/caprice/edit-profile.css';

export default function EditProfilePanel({ onClose, preview, name, setName, uploading, busy, pickPhoto, save }) {
  const fileInput = useRef(null);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'var(--caprice-overlay)' }} onClick={onClose}>
      <div className="caprice-profile-window" onClick={e => e.stopPropagation()}>
        <div className="profile-head">
          <h2>Modifier mon profil</h2>
          <button className="close-button" type="button" onClick={onClose} aria-label="Fermer"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
        </div>
        <div className="photo-area">
          <div className="avatar" aria-hidden="true">
            {preview ? <img src={preview} alt="" className="w-full h-full rounded-full object-cover" /> : <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="14" r="7" fill="#91A5D4" /><path d="M7.5 32.2c1.6-6.2 6.1-9.4 12.5-9.4s10.9 3.2 12.5 9.4c.2.9-.5 1.8-1.5 1.8H9c-1 0-1.7-.9-1.5-1.8Z" fill="#7189C3" /></svg>}
          </div>
          <button className="photo-button" type="button" onClick={() => fileInput.current?.click()} disabled={uploading || busy}>
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8.5h3l1.5-2h7l1.5 2h3A1.5 1.5 0 0 1 21.5 10v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="12" cy="13.5" r="3.5" stroke="currentColor" strokeWidth="1.6" /></svg>}
            Photo de profil (stockée en privé)
          </button>
          <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={pickPhoto} disabled={uploading || busy} />
        </div>
        <div className="profile-field">
          <label htmlFor="profile-name">Nom complet</label>
          <input id="profile-name" type="text" maxLength={60} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <button className="save-button" type="button" onClick={save} disabled={busy || uploading}>
          {busy ? <Loader2 size={18} className="animate-spin" /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}