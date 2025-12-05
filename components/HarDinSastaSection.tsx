'use client';

import ProductCard from './ProductCard';
import { productData } from '@/data/products';
import Link from 'next/link';

export default function HarDinSastaSection() {
  // Har Din Sasta - Daily deals with very high discounts
  const harDinSastaProducts = Object.values(productData)
    .filter((product) => 
      product.discountPercent > 55 || // Very high discounts
      product.name.toLowerCase().includes('sasta') ||
      product.name.toLowerCase().includes('deal')
    )
    .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0))
    .slice(0, 10);

  if (harDinSastaProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Har Din Sasta</h2>
          <Link 
            href="/categories/har-din-sasta" 
            className="text-[#16a34a] hover:text-[#15803d] font-semibold text-base md:text-lg transition-colors whitespace-nowrap"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-4 md:-mx-6 px-4 md:px-6">
          <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
            {harDinSastaProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

