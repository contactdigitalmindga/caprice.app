import React from 'react';
import { fmt } from '@/lib/caprice';
import { MENU_SIDES, EGG_EXTRAS, SAVOURY_CATEGORIES } from '@/components/caprice/menuChoices';

export const requiresSide = product => Boolean(product.options?.length);

function ChoiceGroup({ title, items, selected, onSelect, multiple = false }) {
  return <div><h3>{title}</h3><div className="options">{items.map(([name, price]) => {
    const active = multiple ? selected.some(value => value.name === name) : selected?.name === name;
    return <button type="button" key={name} className={active ? 'selected' : ''} onClick={() => onSelect({ name, price })}>{name}{price > 0 && ` · +${fmt(price)}`}</button>;
  })}</div></div>;
}

export default function RestaurantOptions({ product, side, setSide, extras, setExtras }) {
  const sides = (product.options || []).map(name => [name, 0]);
  const egg = product.category === 'Petit déjeuner' && ['Omelette', 'Œuf au plat'].includes(product.name);
  const additions = egg ? EGG_EXTRAS : SAVOURY_CATEGORIES.includes(product.category) ? MENU_SIDES : [];
  const toggle = item => setExtras(extras.some(value => value.name === item.name) ? extras.filter(value => value.name !== item.name) : [...extras, item]);
  return <>
    {sides.length > 0 && <ChoiceGroup title="Choisissez votre accompagnement inclus" items={sides} selected={side} onSelect={setSide} />}
    {additions.length > 0 && <ChoiceGroup title="Ajoutez des suppléments" items={additions} selected={extras} onSelect={toggle} multiple />}
  </>;
}