import React from 'react';
import { fmt } from '@/lib/caprice';

const DEFAULT_SIDES=[['Frites maison',0],['Riz parfumé',0],['Alloco',1000],['Légumes sautés',1000]];
const EXTRAS=[['Portion de frites',2000],['Portion de riz',1500],['Portion d’alloco',2000],['Légumes sautés',2000]];
const SAUCES=[['Sauce au poivre',1000],['Sauce champignons',1000],['Sauce barbecue',500],['Sauce piment',0]];
const MEALS=['Entrées','Pâtes','Grillades','Burgers','Pizzas','Salades'];
export const requiresSide=product=>Boolean(product.options?.length)||['Grillades','Burgers'].includes(product.category);

function ChoiceGroup({title,items,selected,onSelect,multiple=false}){return <div><h3>{title}</h3><div className="options">{items.map(([name,price])=>{const active=multiple?selected.some(v=>v.name===name):selected?.name===name;return <button type="button" key={name} className={active?'selected':''} onClick={()=>onSelect({name,price})}>{name}{price>0&&` · +${fmt(price)}`}</button>})}</div></div>}

export default function RestaurantOptions({product,side,setSide,extras,setExtras,sauces,setSauces}){
  const meal=MEALS.includes(product.category);
  const sides=(product.options?.length?product.options.map(v=>[v,0]):['Grillades','Burgers'].includes(product.category)?DEFAULT_SIDES:[]);
  const toggle=(list,setList,item)=>setList(list.some(v=>v.name===item.name)?list.filter(v=>v.name!==item.name):[...list,item]);
  return <>{sides.length>0&&<ChoiceGroup title="Choisissez votre accompagnement" items={sides} selected={side} onSelect={setSide}/>} {meal&&<ChoiceGroup title="Ajoutez des suppléments" items={EXTRAS} selected={extras} onSelect={v=>toggle(extras,setExtras,v)} multiple/>} {meal&&<ChoiceGroup title="Choisissez vos sauces" items={SAUCES} selected={sauces} onSelect={v=>toggle(sauces,setSauces,v)} multiple/>}</>;
}