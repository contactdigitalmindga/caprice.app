import React from 'react';
import BackArrow from '@/components/caprice/BackArrow';
import termsContent from '@/components/caprice/termsContent';
import privacyContent from '@/components/caprice/privacyContent';
export default function LegalScreen({ type }) {
  const document = type === 'privacy' ? privacyContent : termsContent;
  return <main className="screen legal-copy">
    <BackArrow to="profile" /><small>INFORMATIONS CAPRICE</small><h1>{document.title}</h1>
    <p className="legal-date">Mise à jour : 17 octobre 2026</p><p>{document.intro}</p>
    <aside className="legal-notice">Texte informatif à faire valider par l’exploitant et son conseil juridique. L’identité juridique complète, les coordonnées de contact et les modalités effectives de conservation et d’hébergement restent à confirmer.</aside>
    {document.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}
  </main>;
}