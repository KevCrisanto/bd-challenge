'use client';

import type { ShopifyCollection, ShopifyProduct } from '@/lib/shopify/types';
import { AnimatePresence } from 'motion/react';
import { useMemo, useState } from 'react';
import { CollectionFilter } from './collection-filter';
import { ProductGrid } from './product-grid';

type CollectionViewProps = {
  readonly collections: readonly ShopifyCollection[];
};

export function CollectionView({ collections }: CollectionViewProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  const displayedProducts = useMemo((): readonly ShopifyProduct[] => {
    if (activeFilter === 'All') {
      const seen = new Map<string, ShopifyProduct>();
      for (const collection of collections) {
        for (const product of collection.products) {
          if (!seen.has(product.id)) {
            seen.set(product.id, product);
          }
        }
      }
      return [...seen.values()];
    }

    const match = collections.find((c) => c.title === activeFilter);
    return match?.products ?? [];
  }, [activeFilter, collections]);

  return (
    <div className="min-h-screen px-4 py-12 md:px-8 max-w-screen-xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Bryt Designs Frontend Challenge
        </h1>
      </header>
      <div className="mb-8">
        <CollectionFilter
          collections={collections}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>
      <AnimatePresence mode="wait">
        <ProductGrid key={activeFilter} products={displayedProducts} />
      </AnimatePresence>
    </div>
  );
}
