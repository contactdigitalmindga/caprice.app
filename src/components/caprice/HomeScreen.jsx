import React from 'react';
import { ArrowRight, Navigation } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useCaprice } from '@/components/caprice/AppContext';
import TopBar from '@/components/caprice/TopBar';
import BrandHeader from '@/components/caprice/BrandHeader';
import ProductCard from '@/components/caprice/ProductCard';
import HeroCarousel from '@/components/caprice/HeroCarousel';
import PullToRefresh from '@/components/caprice/PullToRefresh';
import { restaurantContent as content } from '@/components/caprice/restaurantContent';

export default function HomeScreen() {
  const { setScreen, refreshProducts } = useCaprice();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['caprice-featured'],
    queryFn: () => base44.entities.Product.filter({ active: true, featured: true }, { sort: 'price', limit: 4 })
  });
  return <PullToRefresh onRefresh={() => Promise.all([refreshProducts(), refetch()])}>
    <BrandHeader /><TopBar />
    <main className="px-5 pb-28">
      <section className="hero"><HeroCarousel /><div /><h1>Le luxe discret<br /><i>d’un moment suspendu.</i></h1><button onClick={() => setScreen('menu')}>Découvrir le menu <ArrowRight size={16} /></button></section>
      <div className="section-title"><h2>Nos incontournables</h2><button onClick={() => setScreen('menu')}>Voir tout</button></div>
      <div className="cards-row">{isLoading ? [1, 2].map(i => <div key={i} className="skeleton" />) : data?.items.map(product => <ProductCard key={product.id} p={product} />)}</div>
      <section className="story"><small>DEPUIS 2021 · LIBREVILLE</small><h2>{content.storyTitle}</h2><p>{content.story[5]}</p><button onClick={() => setScreen('about')}>À propos de nous</button></section>
      <section className="reserve-card"><p>Votre table vous attend</p><h2>Réserver une table</h2><button onClick={() => setScreen('reserve')}>Réserver maintenant</button></section>
      <button className="caprice-go" onClick={() => window.open('https://maps.app.goo.gl/gBT6xtbWfrdkUz6z8', '_blank')}><Navigation size={18} /> Aller au Caprice</button>
    </main>
  </PullToRefresh>;
}