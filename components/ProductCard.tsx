'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Toast from './Toast';

interface ProductVariant {
  name: string;
  quantity: string;
  price: number | null;
  isBestSeller?: boolean | null;
  inStock?: boolean | null;
}

interface Product {
  id: string;
  name: string;
  brand: string | null;
  rating: number | null;
  reviews: number | null;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  discountPercent: number;
  images: readonly string[] | string[];
  variants: readonly ProductVariant[] | ProductVariant[];
  isBestSeller: boolean | null;
  freeDelivery: boolean | null;
  pricePerUnit: string | null;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const selectedVariant = product.variants[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedVariant.price === null) return; // Don't add if price is null
    addToCart({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      image: product.images[0],
      variant: selectedVariant.name,
      quantity: selectedVariant.quantity,
      price: selectedVariant.price,
      originalPrice: product.originalPrice,
    });
    setShowToast(true);
  };

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <div className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full">
        {/* Image Section - Fixed height */}
        <div className="relative aspect-square bg-white flex-shrink-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-2 sm:p-3 md:p-4"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
          />

          {/* Discount Badge - Top Left - Matching agribegri.com style */}
          {product.discountPercent > 0 && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white text-[10px] xs:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded">
                {product.discountPercent}% Off
              </span>
            </div>
          )}

          {/* Heart Icon - Top Right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-10"
            aria-label="Add to favorites"
          >
            <Heart size={16} className="sm:w-4 sm:h-4 text-gray-600" />
          </button>
        </div>

        {/* Content Section - Matching agribegri.com layout */}
        <div className="p-2.5 sm:p-3 flex-1 flex flex-col">
          {/* Product Name - Matching agribegri.com style */}
          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1.5 line-clamp-2 min-h-[2.5rem] leading-snug">
            {product.name}
          </h3>

          {/* Brand - Matching agribegri.com style */}
          {product.brand && (
            <p className="text-[10px] sm:text-xs text-gray-600 mb-1.5 line-clamp-1">
              {product.brand}
            </p>
          )}

          {/* Rating and Reviews - Matching agribegri.com style */}
          {product.rating !== null && product.reviews !== null && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                <span className="text-yellow-500 text-xs">★</span>
                <span className="text-xs text-gray-700 ml-0.5 font-medium">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews > 999 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews})
              </span>
            </div>
          )}

          {/* Price Section - Matching agribegri.com style */}
          <div className="mb-2 flex items-baseline gap-2">
            {selectedVariant.price !== null ? (
              <>
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  ₹{selectedVariant.price}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              </>
            ) : (
              <span className="text-xs sm:text-sm text-gray-500">Price not available</span>
            )}
          </div>

          {/* Quantity - Matching agribegri.com style */}
          <p className="text-[10px] sm:text-xs text-gray-600 mb-3 line-clamp-1">
            {selectedVariant.quantity}
          </p>

          {/* Add to Cart Button - Matching agribegri.com exact style */}
          <button
            onClick={handleAddToCart}
            disabled={selectedVariant.price === null}
            className="w-full bg-[#16a34a] hover:bg-[#15803d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 rounded transition-colors mt-auto flex items-center justify-center"
          >
            {selectedVariant.price === null ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
      
      <Toast
        message="Item added to cart!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </Link>
  );
}
