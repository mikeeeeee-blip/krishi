'use client';

import ProductCard from './ProductCard';
import { productData } from '@/data/products';
import { categorizeProduct, categorySlugs, type CategoryType } from '@/lib/categories';
import Link from 'next/link';

interface CategorySectionProps {
  categoryName: CategoryType;
  title?: string;
  limit?: number;
  bgColor?: 'white' | 'gray';
}

export default function CategorySection({ 
  categoryName, 
  title,
  limit = 10,
  bgColor = 'white'
}: CategorySectionProps) {
  // Filter products by category
  const categoryProducts = Object.values(productData)
    .filter((product) => {
      const productCategory = categorizeProduct(product);
      return productCategory === categoryName;
    })
    .slice(0, limit);

  const displayTitle = title || categoryName;
  const categorySlug = categorySlugs[categoryName];

  // Don't render if no products found
  if (categoryProducts.length === 0) {
    return null;
  }

  return (
    <section className={`py-6 md:py-8 ${bgColor === 'gray' ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{displayTitle}</h2>
          <Link 
            href={`/categories/${categorySlug}`} 
            className="text-[#16a34a] hover:text-[#15803d] font-semibold text-base md:text-lg transition-colors whitespace-nowrap"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
          <div className="flex gap-3 sm:gap-4 pb-4" style={{ minWidth: 'max-content' }}>
            {categoryProducts.map((product) => (
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

