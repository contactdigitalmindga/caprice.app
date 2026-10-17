import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LockKeyhole, Loader2, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AuthLayout from '@/components/AuthLayout';
import AuthField from '@/components/auth/AuthField';
export default function ResetPassword() {
  const resetToken = new URLSearchParams(window.location.search).get('token');
  const [password, setPassword] = useState(''), [confirm, setConfirm] = useState(''), [error, setError] = useState(''), [loading, setLoading] = useState(false);
  const submit = async e => {
    e.preventDefault(); setError('');
    if (password.length < 8) return setError('Utilisez au moins 8 caractères.');
    if (password !== confirm) return setError('Les mots de passe ne correspondent pas.');
    setLoading(true);
    try { await base44.auth.resetPassword({ resetToken, newPassword: password }); window.location.href = '/login'; }
    catch { setError('Le lien peut être expiré ou déjà utilisé. Vérifiez votre connexion ou demandez un nouveau lien.'); }
    finally { setLoading(false); }
  };
  if (!resetToken) return <AuthLayout icon={AlertTriangle} title="Lien invalide" subtitle="Ce lien de réinitialisation est incomplet ou invalide." footer={<Link to="/forgot-password">Demander un nouveau lien</Link>}><p className="auth-notice">Pour protéger votre compte, utilisez le lien reçu dans votre e-mail de réinitialisation.</p></AuthLayout>;
  return <AuthLayout icon={LockKeyhole} title="Un nouveau départ" subtitle="Choisissez un nouveau mot de passe pour votre compte Caprice." footer={<Link to="/login">Retour à la connexion</Link>}>
    {error && <div className="auth-error" role="alert">{error}<br /><Link to="/forgot-password">Demander un nouveau lien</Link></div>}
    <form className="auth-form" onSubmit={submit} aria-busy={loading}>
      <AuthField id="password" label="Nouveau mot de passe" type="password" minLength={8} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
      <AuthField id="confirm-password" label="Confirmer le mot de passe" type="password" autoComplete="new-password" match={password} value={confirm} onChange={e => setConfirm(e.target.value)} disabled={loading} />
      <button className="auth-primary" disabled={loading}>{loading && <Loader2 size={18} className="animate-spin" />}{loading ? 'Enregistrement…' : 'Enregistrer mon mot de passe'}</button>
    </form>
  </AuthLayout>;
}