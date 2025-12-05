'use client';

import ProductCard from './ProductCard';
import { productData } from '@/data/products';
import Link from 'next/link';

export default function NewArrivals() {
  // New Arrivals - typically products with high IDs (newer products) or high ratings
  // For now, we'll use products with high ratings and recent additions
  const newArrivals = Object.values(productData)
    .filter((product) => 
      (product.rating && product.rating > 4.0) || // Good ratings indicate new quality products
      product.reviews && product.reviews < 100 // Fewer reviews might indicate newer products
    )
    .slice(0, 10);

  if (newArrivals.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
          <Link 
            href="/categories" 
            className="text-[#16a34a] hover:text-[#15803d] font-semibold text-base md:text-lg transition-colors whitespace-nowrap"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-4 md:-mx-6 px-4 md:px-6">
          <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
            {newArrivals.map((product) => (
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

