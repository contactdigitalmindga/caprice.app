import React, { useState } from 'react';
import { Heart, Minus, Plus, Share2, ShoppingBag, Star } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { fmt } from '@/lib/caprice';
import { useCaprice } from '@/components/caprice/AppContext';
import BackArrow from '@/components/caprice/BackArrow';
import ImageCarousel from '@/components/caprice/ImageCarousel';
import RestaurantOptions, { requiresSide } from '@/components/caprice/RestaurantOptions';

export default function DetailScreen() {
  const { setScreen, add, toggleFavOptimistic: toggle, fav, cart } = useCaprice();
  const { id } = useParams();
  const [q, setQ] = useState(1), [side, setSide] = useState(null), [extras, setExtras] = useState([]);
  const { data: product, isPending, error, refetch } = useQuery({ queryKey: ['caprice-product', id], queryFn: () => base44.entities.Product.get(id), enabled: !!id });
  if (isPending) return <main className="screen"><BackArrow to="menu" /><p role="status" className="mt-6">Chargement du plat…</p></main>;
  if (error && error.status !== 404) return <main className="screen"><BackArrow to="menu" /><p role="alert" className="mt-6">Le plat n’a pas pu être chargé.</p><button className="outline mt-4" onClick={() => refetch()}>Réessayer</button></main>;
  if (!product || product.active === false) return <Navigate to="/menu" replace />;
  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean);
  const choices = [side, ...extras].filter(Boolean), extraTotal = choices.reduce((sum, choice) => sum + choice.price, 0);
  const total = (product.price + extraTotal) * q, opt = choices.map(choice => choice.name).join(', '), missingSide = requiresSide(product) && !side;
  return <main className="detail">
    <div className="detail-img"><ImageCarousel images={allImages} alt={product.name} /><BackArrow to="menu" className="back" /><div className="detail-actions"><button aria-label="Ajouter aux favoris" onClick={() => toggle(product)}><Heart fill={fav.some(value => value.id === product.id) ? 'currentColor' : 'none'} /></button><button className="caprice-action relative" aria-label="Voir le panier" onClick={() => setScreen('cart')}><ShoppingBag />{cart.length > 0 && <b className="badge">{cart.reduce((sum, value) => sum + value.q, 0)}</b>}</button><button aria-label="Partager" onClick={() => navigator.share?.({ title: product.name, text: product.description })}><Share2 /></button></div></div>
    <section><small>{product.category.toUpperCase()}</small><h1>{product.name}</h1><span className="rating"><Star size={15} fill="currentColor" /> {product.rating}</span>{product.description && <p>{product.description}</p>}
      <RestaurantOptions product={product} side={side} setSide={setSide} extras={extras} setExtras={setExtras} />
      <div className="qty"><button aria-label="Diminuer" onClick={() => setQ(Math.max(1, q - 1))}><Minus /></button><b>{q}</b><button aria-label="Augmenter" onClick={() => setQ(q + 1)}><Plus /></button></div>
    </section>
    <button className="sticky-cta disabled:opacity-50" disabled={missingSide} onClick={() => { add({ ...product, price: product.price + extraTotal }, q, opt); setScreen('menu'); }}>{missingSide ? 'Choisissez un accompagnement' : `Ajouter au panier — ${fmt(total)}`}</button>
  </main>;
}