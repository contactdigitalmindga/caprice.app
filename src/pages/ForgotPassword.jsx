import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AuthLayout from '@/components/AuthLayout';
import AuthField from '@/components/auth/AuthField';
import { safeReturnTo } from '@/lib/authReturnTo';
export default function ForgotPassword() {
  const [email, setEmail] = useState(''), [loading, setLoading] = useState(false), [sent, setSent] = useState(false);
  const returnTo = safeReturnTo();
  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try { await base44.auth.resetPasswordRequest(email.trim()); }
    catch { /* Keep the same generic response to avoid revealing account existence. */ }
    finally { setLoading(false); setSent(true); }
  };
  return <AuthLayout icon={Mail} title={sent ? 'Consultez votre messagerie' : 'Mot de passe oublié ?'} subtitle={sent ? 'Retrouvez l’accès à votre expérience Caprice.' : 'Recevez un lien pour définir un nouveau mot de passe.'} footer={<Link to={'/login?returnTo=' + encodeURIComponent(returnTo)}>Retour à la connexion</Link>}>
    {sent ? <><p className="auth-notice" role="status">Si un compte correspond à {email}, vous recevrez un lien de réinitialisation. Consultez également vos courriers indésirables.</p><button className="auth-text-button" onClick={() => setSent(false)}>Réessayer avec mon adresse e-mail</button></> : <form className="auth-form" onSubmit={submit} aria-busy={loading}>
      <AuthField id="email" label="Adresse e-mail" type="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
      <button className="auth-primary" disabled={loading}>{loading && <Loader2 size={18} className="animate-spin" />}{loading ? 'Envoi…' : 'Envoyer le lien de réinitialisation'}</button>
    </form>}
  </AuthLayout>;
}