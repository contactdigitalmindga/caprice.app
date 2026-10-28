import React from 'react';
import { restaurantContent as content } from '@/components/caprice/restaurantContent';

export default function MenuNotices({ category }) {
  const all = category === 'Tous';
  return <aside className="mt-8 space-y-3 text-sm leading-relaxed text-muted-foreground">
    {(all || category === 'Pizzas traditionnelles') && <p>{content.pizza}</p>}
    {(all || ['Viandes', 'Poissons'].includes(category)) && <p>{content.accompaniment}</p>}
    {(all || category === 'Poissons') && <p>{content.fishMezze} <a href={content.phoneHref} className="underline underline-offset-4">{content.phone}</a></p>}
    {(category === 'Burgers') && <p>Portion de frites : 2 000 FCFA.</p>}
    <p>{content.allergens}</p>
    <p>{content.service}<br />{content.takeaway}</p>
  </aside>;
}