import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AuthLayout from '@/components/AuthLayout';
export default function EmailVerification({ email, fullName, returnTo }) {
  const [code, setCode] = useState(''), [busy, setBusy] = useState(false), [resending, setResending] = useState(false);
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [seconds, setSeconds] = useState(60), [verified, setVerified] = useState(false);
  useEffect(() => { if (!seconds) return; const timer = setTimeout(() => setSeconds(seconds - 1), 1000); return () => clearTimeout(timer); }, [seconds]);
  const verify = async e => {
    e.preventDefault(); setBusy(true); setError('');
    let isVerified = verified;
    try {
      if (!verified) {
        const result = await base44.auth.verifyOtp({ email, otpCode: code });
        if (!result?.access_token) throw new Error('verification');
        base44.auth.setToken(result.access_token); setVerified(true); isVerified = true;
      }
      await base44.auth.updateMe({ display_name: fullName.trim() });
      window.location.href = returnTo;
    } catch { setError(isVerified ? 'Votre e-mail est vérifié, mais le nom n’a pas pu être enregistré. Réessayez ou retournez à la connexion.' : 'Code invalide ou expiré, ou réseau indisponible. Vérifiez le code ou demandez-en un nouveau.'); }
    finally { setBusy(false); }
  };
  const resend = async () => {
    setResending(true); setError(''); setNotice('');
    try { await base44.auth.resendOtp(email); setNotice('Un nouveau code a été envoyé. Consultez aussi vos courriers indésirables.'); setSeconds(60); }
    catch { setError('Impossible de renvoyer le code. Vérifiez votre connexion et réessayez.'); }
    finally { setResending(false); }
  };
  return <AuthLayout icon={Mail} title="Vérifiez votre adresse e-mail" subtitle="Nous vous avons envoyé un code de vérification pour sécuriser votre compte." footer={<Link to={'/login?returnTo=' + encodeURIComponent(returnTo)}>Retour à la connexion</Link>}>
    <p className="auth-email">{email}</p>
    <ol className="auth-instructions"><li>Ouvrez l’e-mail envoyé par Caprice.</li><li>Copiez le code de vérification reçu.</li><li>Saisissez-le ci-dessous pour activer votre compte.</li></ol>
    {error && <p className="auth-error" role="alert">{error}</p>}{notice && <p className="auth-notice" role="status">{notice}</p>}
    <form onSubmit={verify} className="auth-form">
      {!verified && <div className="auth-field"><label htmlFor="verification-code">Code à 6 chiffres</label><div className="auth-input-wrap"><input id="verification-code" className="auth-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} required /></div></div>}
      <button className="auth-primary" disabled={busy || resending || (!verified && code.length !== 6)}>{busy && <Loader2 size={18} className="animate-spin" />}{busy ? 'Vérification…' : verified ? 'Terminer mon inscription' : 'Vérifier mon e-mail'}</button>
    </form>
    {!verified && <button className="auth-text-button" type="button" onClick={resend} disabled={resending || busy || seconds > 0}>{resending ? 'Envoi…' : `Renvoyer le code${seconds ? ` (${seconds} s)` : ''}`}</button>}
  </AuthLayout>;
}