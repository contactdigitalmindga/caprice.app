import React, { useState } from 'react';
import { Bell, Smartphone } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { base44 } from '@/api/base44Client';
import { useCaprice } from '@/components/caprice/AppContext';
import BackArrow from '@/components/caprice/BackArrow';
export default function NotificationSettings() {
  const { user, userLoading, refreshUser, goLogin } = useCaprice();
  const [saving, setSaving] = useState(false), [error, setError] = useState(''), [saved, setSaved] = useState(false);
  const change = async enabled => {
    setSaving(true); setError(''); setSaved(false);
    try {
      await base44.auth.updateMe({ push_notifications_enabled: enabled });
      await refreshUser(); setSaved(true);
    } catch { setError('Votre préférence n’a pas pu être enregistrée. Réessayez.'); }
    finally { setSaving(false); }
  };
  return <main className="screen notification-settings"><BackArrow to="profile" /><small>MON COMPTE</small><h1>Paramètres & notifications</h1>
    {userLoading ? <p role="status">Chargement des préférences…</p> : !user ? <section className="settings-card"><p>Connectez-vous pour enregistrer vos préférences de notifications.</p><button className="outline" onClick={goLogin}>Se connecter</button></section> : <section className="settings-card">
      <Bell aria-hidden="true" /><h2>Notifications push</h2><p>Enregistrez votre choix de réception sur iOS et Android.</p>
      <div className="settings-toggle"><label htmlFor="push-enabled">Autoriser les notifications</label><Switch id="push-enabled" checked={user.push_notifications_enabled === true} onCheckedChange={change} disabled={saving} /></div>
      {saving && <p role="status">Enregistrement…</p>}{saved && <p role="status">Préférence enregistrée. L’autorisation du téléphone reste indépendante.</p>}{error && <p role="alert">{error}</p>}
    </section>}
    <section className="settings-card"><Smartphone aria-hidden="true" /><h2>Autorisation du téléphone</h2><p>Ce réglage enregistre votre préférence ; il ne donne pas à l’application l’autorisation système d’envoyer des notifications.</p><p>Sur iPhone : Réglages → Notifications → CAPRICE → Autoriser les notifications.</p><p>Sur Android : Paramètres → Applications → CAPRICE → Notifications.</p><p>Les push nécessitent une version native CAPRICE intégrant la configuration Apple ou Firebase. Ils ne sont pas disponibles depuis la simple installation sur l’écran d’accueil de Safari.</p></section>
  </main>;
}