import React from 'react';
import { Utensils } from 'lucide-react';
import Image from '@/components/caprice/PreloadedImage';

export default function MenuProductImage({ src, alt, className = '' }) {
  if (src) return <Image src={src} alt={alt} loading="eager" className={className} />;
  return <div role="img" aria-label={alt} className={`${className} flex items-center justify-center bg-muted text-muted-foreground`}><Utensils size={36} strokeWidth={1} aria-hidden="true" /></div>;
}