'use client';

import ProductCard from './ProductCard';
import { productData } from '@/data/products';
import Link from 'next/link';

export default function TodaysOffers() {
  // Today's Offers - products with high discounts or special offers
  const todaysOffers = Object.values(productData)
    .filter((product) => 
      product.discountPercent > 40 || // High discount
      product.isBestSeller // Best sellers are often on offer
    )
    .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0))
    .slice(0, 10);

  if (todaysOffers.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Today&apos;s Offers</h2>
          <Link 
            href="/categories" 
            className="text-[#16a34a] hover:text-[#15803d] font-semibold text-base md:text-lg transition-colors whitespace-nowrap"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
          <div className="flex gap-3 sm:gap-4 pb-4" style={{ minWidth: 'max-content' }}>
            {todaysOffers.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[140px] xs:w-[160px] sm:w-[200px] md:w-[240px] lg:w-[260px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

