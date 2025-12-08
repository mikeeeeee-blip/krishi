'use client';

import { productData } from '@/data/products';
import { categorizeProduct } from '@/lib/categories';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default function BulkSection() {
  // Since there are no products with "bulk" in name, show products with large quantities or high discounts
  // as a fallback for Bulk section
  const bulkProducts = Object.values(productData)
    .filter((product) => {
      const category = categorizeProduct(product);
      // If product is already categorized as Bulk, use it
      if (category === 'Bulk') return true;
      // Otherwise, show products with very large quantities or very high discounts as "bulk deals"
      const hasLargeQuantity = product.variants.some(v => 
        v.quantity && (v.quantity.includes('kg') || v.quantity.includes('liter') || v.quantity.includes('Ltr'))
      );
      return hasLargeQuantity && product.discountPercent > 50;
    })
    .slice(0, 10);

  if (bulkProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-4 sm:py-6 md:py-8 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Bulk</h2>
          <Link 
            href="/categories/bulk" 
            className="text-[#16a34a] hover:text-[#15803d] font-semibold text-sm sm:text-base md:text-lg transition-colors whitespace-nowrap flex-shrink-0"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
          <div className="flex gap-3 sm:gap-4 pb-4" style={{ minWidth: 'max-content' }}>
            {bulkProducts.map((product) => (
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

