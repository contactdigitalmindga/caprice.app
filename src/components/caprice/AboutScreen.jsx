import React from 'react';
import { MapPin } from 'lucide-react';
import { hero } from '@/lib/caprice';
import Image from '@/components/caprice/PreloadedImage';
import BackArrow from '@/components/caprice/BackArrow';
import { restaurantContent as content } from '@/components/caprice/restaurantContent';

export default function AboutScreen() {
  return <main className="about">
    <Image src={hero} alt="Caprice Libreville" className="h-80 w-full" />
    <section>
      <BackArrow to="home" />
      <small>{content.slogan}</small>
      <h1>{content.storyTitle}</h1>
      {content.story.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      <p>Bienvenue.</p>
      <h3><MapPin aria-hidden="true" /> Libreville, Gabon</h3>
      <p>{content.address}<br /><a href={content.phoneHref} className="underline underline-offset-4">{content.phone}</a><br />{content.website}</p>
      <p>Lun–Jeu 08:00–23:00<br />Ven–Dim 08:00–00:00</p>
      <p>{content.allergens}</p>
      <p>{content.service}<br />{content.takeaway}</p>
      <button onClick={() => window.open('https://maps.app.goo.gl/gBT6xtbWfrdkUz6z8', '_blank', 'noopener,noreferrer')}>Nous trouver</button>
    </section>
  </main>;
}