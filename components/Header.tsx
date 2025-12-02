'use client';

import { Search, ShoppingCart, User, Truck } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 relative z-30 w-full">
      <div className="w-full px-4 md:px-6">
        <div className="flex items-center justify-between py-4 md:py-5 gap-4 md:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-xl md:text-2xl font-bold flex items-center">
              <span className="text-green-600">Agri</span>
              <span className="text-[#2563eb] relative">
                <span className="absolute -top-1 left-0 text-green-600 text-lg md:text-xl">🌿</span>
                <span className="relative z-10">Begri</span>
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl flex gap-2 mx-2 md:mx-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
              />
            </div>
            <button className="bg-[#2563eb] text-white px-5 md:px-6 py-2.5 rounded-r-md hover:bg-[#1d4ed8] flex items-center justify-center transition-colors">
              <Search size={18} />
            </button>
            <button className="bg-[#16a34a] text-white px-3 md:px-4 py-2.5 rounded-md hover:bg-[#15803d] flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap hidden lg:flex transition-colors font-medium">
              <Search size={16} />
              <span>Search by Technical Name</span>
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4 md:gap-5 flex-shrink-0">
            <button className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-green-600 transition-colors text-xs md:text-sm px-2 py-1">
              <Truck size={20} className="md:w-6 md:h-6" />
              <span className="whitespace-nowrap font-medium">Track Order</span>
            </button>
            <Link href="/cart" className="relative flex flex-col items-center gap-0.5 text-gray-700 hover:text-green-600 transition-colors text-xs md:text-sm px-2 py-1">
              <ShoppingCart size={20} className="md:w-6 md:h-6" />
              <span className="whitespace-nowrap font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-green-600 transition-colors text-xs md:text-sm px-2 py-1">
              <User size={20} className="md:w-6 md:h-6" />
              <span className="whitespace-nowrap font-medium">Login</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

