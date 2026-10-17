import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AuthLayout from '@/components/AuthLayout';
import AuthField from '@/components/auth/AuthField';
import ProviderButtons from '@/components/auth/ProviderButtons';
import { safeReturnTo } from '@/lib/authReturnTo';
export default function Login() {
  const [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const [error, setError] = useState(''), [loading, setLoading] = useState(false);
  const returnTo = safeReturnTo(), query = '?returnTo=' + encodeURIComponent(returnTo);
  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await base44.auth.loginViaEmailPassword(email.trim(), password); window.location.href = returnTo; }
    catch (err) { setError(!navigator.onLine || !err.status ? 'Connexion impossible. Vérifiez votre connexion Internet et réessayez.' : 'Connexion refusée. Vérifiez votre e-mail et votre mot de passe. Si votre compte est récent, terminez sa vérification.'); }
    finally { setLoading(false); }
  };
  return <AuthLayout title="Bienvenue chez Caprice" subtitle="Connectez-vous pour retrouver vos commandes, réservations et favoris." footer={<>Pas encore de compte ? <Link to={'/register' + query}>Créer un compte</Link><br /><Link to="/menu">Explorer le menu sans compte</Link></>}>
    <ProviderButtons returnTo={returnTo} />
    {error && <p className="auth-error" role="alert">{error}</p>}
    <form onSubmit={submit} className="auth-form" aria-busy={loading}>
      <AuthField id="email" label="Adresse e-mail" type="email" autoComplete="username" inputMode="email" autoCapitalize="none" spellCheck={false} placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
      <AuthField id="password" label="Mot de passe" type="password" autoComplete="current-password" placeholder="Votre mot de passe" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
      <Link className="auth-forgot" to={'/forgot-password' + query}>Mot de passe oublié ?</Link>
      <button className="auth-primary" disabled={loading}>{loading && <Loader2 size={18} className="animate-spin" />}{loading ? 'Connexion…' : 'Se connecter'}</button>
    </form>
  </AuthLayout>;
}