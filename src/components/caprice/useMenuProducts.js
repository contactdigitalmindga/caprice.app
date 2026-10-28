import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useMenuProducts(category, search) {
  const [term, setTerm] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setTerm(search), 250);
    return () => clearTimeout(timer);
  }, [search]);
  const query = useInfiniteQuery({
    queryKey: ['caprice-menu', category, term],
    initialPageParam: null,
    queryFn: ({ pageParam }) => {
      const filter = { active: true };
      if (category !== 'Tous') filter.category = category;
      if (term.trim()) filter.name = { $regex: term.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
      return base44.entities.Product.filter(filter, { sort: 'price', limit: 24, ...(pageParam ? { cursor: pageParam } : {}) });
    },
    getNextPageParam: page => page.has_more ? page.next_cursor : undefined
  });
  return { ...query, items: query.data?.pages.flatMap(page => page.items) || [] };
}