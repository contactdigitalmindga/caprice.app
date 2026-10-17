import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AuthLayout from '@/components/AuthLayout';
import AuthField from '@/components/auth/AuthField';
import ProviderButtons from '@/components/auth/ProviderButtons';
import EmailVerification from '@/components/auth/EmailVerification';
import { safeReturnTo } from '@/lib/authReturnTo';
export default function Register() {
  const [name, setName] = useState(''), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(false), [error, setError] = useState(''), [loading, setLoading] = useState(false), [verification, setVerification] = useState(false);
  const returnTo = safeReturnTo();
  const submit = async e => {
    e.preventDefault(); setError('');
    if (!name.trim()) return setError('Veuillez renseigner votre nom complet.');
    if (password.length < 8) return setError('Utilisez au moins 8 caractères pour votre mot de passe.');
    if (password !== confirm) return setError('Les mots de passe ne correspondent pas.');
    if (!accepted) return setError('Veuillez accepter les conditions d’utilisation et la politique de confidentialité.');
    setLoading(true);
    try { await base44.auth.register({ email: email.trim(), password }); setVerification(true); }
    catch { setError('Inscription impossible. Vérifiez votre connexion. Si vous avez déjà un compte, connectez-vous ou réinitialisez votre mot de passe.'); }
    finally { setLoading(false); }
  };
  if (verification) return <EmailVerification email={email.trim()} fullName={name} returnTo={returnTo} />;
  return <AuthLayout title="Rejoignez Caprice" subtitle="Créez votre compte et profitez d’une expérience personnalisée." footer={<>Déjà membre ? <Link to={'/login?returnTo=' + encodeURIComponent(returnTo)}>Se connecter</Link></>}>
    <ProviderButtons returnTo={returnTo} />
    {error && <p className="auth-error" role="alert">{error}</p>}
    <form className="auth-form" onSubmit={submit} aria-busy={loading}>
      <AuthField id="full-name" label="Nom complet" autoComplete="name" placeholder="Votre nom complet" value={name} onChange={e => setName(e.target.value)} disabled={loading} />
      <AuthField id="email" label="Adresse e-mail" type="email" autoComplete="email" autoCapitalize="none" inputMode="email" spellCheck={false} placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
      <AuthField id="password" label="Mot de passe" type="password" autoComplete="new-password" minLength={8} placeholder="8 caractères minimum" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
      <AuthField id="confirm-password" label="Confirmer le mot de passe" type="password" autoComplete="new-password" match={password} value={confirm} onChange={e => setConfirm(e.target.value)} disabled={loading} />
      <label className="auth-legal"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} required disabled={loading} /><span>J’accepte les <Link to="/account/terms" target="_blank" rel="noopener noreferrer">Conditions d’utilisation</Link> et la <Link to="/account/privacy" target="_blank" rel="noopener noreferrer">Politique de confidentialité</Link>.</span></label>
      <button className="auth-primary" disabled={loading}>{loading && <Loader2 size={18} className="animate-spin" />}{loading ? 'Création du compte…' : 'Créer mon compte'}</button>
    </form>
  </AuthLayout>;
}