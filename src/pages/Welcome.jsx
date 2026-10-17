import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
export default function Welcome({ onExplore }) {
  const enter = () => { localStorage.setItem('caprice_onboarded', '1'); onExplore?.(); };
  return <AuthLayout welcome title="Une expérience à savourer." subtitle="Découvrez notre menu, réservez une table et commandez vos plats préférés en quelques instants.">
    <Link to="/login" className="auth-primary" onClick={() => localStorage.setItem('caprice_onboarded', '1')}>Commencer <ArrowRight size={18} /></Link>
    <Link to="/menu" className="auth-secondary" onClick={enter}>Explorer le menu sans compte</Link>
  </AuthLayout>;
}