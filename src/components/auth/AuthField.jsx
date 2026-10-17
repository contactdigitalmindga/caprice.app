import React, { useState } from 'react';
import { Eye, EyeOff, Mail, LockKeyhole, UserRound } from 'lucide-react';
export default function AuthField({ id, label, type = 'text', value, onChange, autoComplete, minLength, match, ...props }) {
  const [visible, setVisible] = useState(false), [touched, setTouched] = useState(false);
  const password = type === 'password';
  const Icon = password ? LockKeyhole : type === 'email' ? Mail : UserRound;
  const message = !value ? 'Ce champ est requis.' : type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Saisissez une adresse e-mail valide.' : minLength && value.length < minLength ? `Utilisez au moins ${minLength} caractères.` : match !== undefined && value !== match ? 'Les mots de passe ne correspondent pas.' : '';
  return <div className="auth-field">
    <label htmlFor={id}>{label}</label>
    <div className="auth-input-wrap"><Icon size={17} aria-hidden="true" />
      <input {...props} id={id} name={id} type={password && visible ? 'text' : type} value={value} onChange={onChange} onBlur={() => setTouched(true)} required minLength={minLength} autoComplete={autoComplete} aria-invalid={touched && !!message} aria-describedby={touched && message ? `${id}-error` : undefined} />
      {password && <button type="button" className="auth-eye" aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
    </div>
    {touched && message && <p id={`${id}-error`} className="auth-field-error">{message}</p>}
  </div>;
}