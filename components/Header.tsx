'use client';

import { Search, ShoppingCart, User, Truck } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [cartCount] = useState(2);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 md:py-4 gap-3 md:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-xl md:text-2xl font-bold text-green-600 flex items-center gap-1.5">
              <span className="text-2xl md:text-3xl">🌿</span>
              <span>AgriBegri</span>
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
              <span className="text-sm">🌿</span>
              <span>Search by Technical Name</span>
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <button className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-green-600 transition-colors text-sm">
              <Truck size={18} className="md:w-5 md:h-5" />
              <span className="hidden md:inline whitespace-nowrap">Track Order</span>
            </button>
            <button className="relative flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-green-600 transition-colors text-sm">
              <ShoppingCart size={18} className="md:w-5 md:h-5" />
              <span className="hidden md:inline whitespace-nowrap">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-green-600 transition-colors text-sm">
              <User size={18} className="md:w-5 md:h-5" />
              <span className="hidden md:inline whitespace-nowrap">Login</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

