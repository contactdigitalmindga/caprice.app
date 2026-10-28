import React, { useState } from 'react';
import { Search, Heart, ShoppingBag } from 'lucide-react';
import { cats } from '@/lib/caprice';
import { useCaprice } from '@/components/caprice/AppContext';
import ProductCard from '@/components/caprice/ProductCard';
import PullToRefresh from '@/components/caprice/PullToRefresh';
import BrandHeader from '@/components/caprice/BrandHeader';
import MenuNotices from '@/components/caprice/MenuNotices';
import useMenuProducts from '@/components/caprice/useMenuProducts';
export default function MenuScreen() {
  const { setScreen, refreshProducts, cart } = useCaprice();
  const [cat, setCat] = useState('Tous'), [q, setQ] = useState('');
  const { items, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } = useMenuProducts(cat, q);
  return <PullToRefresh onRefresh={() => Promise.all([refreshProducts(), refetch()])}>
    <BrandHeader />
    <main className="screen pt-0">
      <div className="page-head"><div><small>LA CARTE CAPRICE</small><h1>Notre Menu</h1></div><div className="flex gap-2"><button className="icon caprice-action" aria-label="Mes favoris" onClick={() => setScreen('favorites')}><Heart size={20} /></button><button className="icon caprice-action relative" aria-label="Mon panier" onClick={() => setScreen('cart')}><ShoppingBag size={20} />{cart.length > 0 && <b className="badge">{cart.reduce((sum, item) => sum + item.q, 0)}</b>}</button></div></div>
      <label className="search"><Search size={18} /><input aria-label="Rechercher un plat" value={q} onChange={event => setQ(event.target.value)} placeholder="Rechercher un plat..." /></label>
      <div className="chips">{cats.map(category => <button className={cat === category ? 'selected' : ''} onClick={() => setCat(category)} key={category}>{category}</button>)}</div>
      <div className="menu-grid">
        {isLoading ? [1, 2].map(i => <div key={i} className="skeleton w-full" role="status" aria-label="Chargement de la carte" />) : items.map(product => <ProductCard key={product.id} p={product} wide />)}
        {!isLoading && !isError && !items.length && <div className="empty"><Search /><h3>Aucun plat trouvé</h3><p>Essayez une autre recherche.</p></div>}
      </div>
      {isError && <div className="mt-5" role="alert"><p>La carte n’a pas pu être chargée.</p><button className="outline mt-3" onClick={() => refetch()}>Réessayer</button></div>}
      {hasNextPage && <button className="outline mt-6" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>{isFetchingNextPage ? 'Chargement…' : 'Voir plus de plats'}</button>}
      <MenuNotices category={cat} />
    </main>
  </PullToRefresh>;
}