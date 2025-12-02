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
  price: number;
  isBestSeller?: boolean;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  rating: number;
  reviews: number;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  discountPercent: number;
  images: string[];
  variants: ProductVariant[];
  isBestSeller: boolean;
  freeDelivery: boolean;
  pricePerUnit: string;
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
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
        {/* Image Section */}
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-3"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />

          {/* Discount Badge - Top Left */}
          <div className="absolute top-2 left-2">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discountPercent}% Off
            </span>
          </div>

          {/* Heart Icon - Top Right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Heart size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-gray-900">
                ₹{selectedVariant.price}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            </div>
          </div>

          {/* Quantity */}
          <p className="text-xs text-gray-600 mb-3">
            {selectedVariant.quantity}
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-3 rounded transition-colors mt-auto"
          >
            Add to Cart
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
