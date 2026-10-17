import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { hero } from '@/lib/caprice';
import '@/components/auth/auth.css';
export default function AuthLayout({ icon: Icon, title, subtitle, footer, children, welcome = false }) {
  return <main className={`caprice-auth${welcome ? ' auth-welcome' : ''}`}>
    <div className="auth-background" aria-hidden="true"><img src={hero} alt="" fetchPriority="high" /></div>
    <div className="auth-shell">
      <div className="auth-top"><Link to="/welcome" className="auth-back" aria-label="Retour à l’accueil"><ArrowLeft size={18} /></Link></div>
      <header className="auth-heading">
        {Icon && <div className="auth-emblem"><Icon size={28} aria-hidden="true" /></div>}
        <h1>{title}</h1>{subtitle && <p>{subtitle}</p>}
      </header>
      <div className="auth-panel">{children}</div>
      {footer && <div className="auth-footer">{footer}</div>}
    </div>
  </main>;
}