'use client';

import { Search, ShoppingCart, User, Truck, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export default function Header({ onMenuToggle, isMenuOpen = false }: HeaderProps) {
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 relative z-30 w-full">
      <div className="w-full px-3 sm:px-4 md:px-6">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Top Row: Menu, Logo, Icons */}
          <div className="flex items-center justify-between py-2 sm:py-3 gap-2">
            {/* Menu Button */}
            <button
              onClick={onMenuToggle}
              className="flex-shrink-0 p-2 text-gray-700 hover:text-green-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={20} className="sm:w-5 sm:h-5" />
              ) : (
                <Menu size={20} className="sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Logo - Centered */}
            <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 flex-1 justify-center">
              <div className="text-base sm:text-lg font-bold flex items-center">
                <span className="text-green-600">Agri</span>
                <span className="text-[#2563eb] relative">
                  <span className="absolute -top-0.5 left-0 text-green-600 text-sm sm:text-base">🌿</span>
                  <span className="relative z-10">Begri</span>
                </span>
              </div>
            </Link>

            {/* Right Icons: Delivery Truck, Shopping Cart, User */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button className="text-gray-700 hover:text-green-600 transition-colors p-1.5 flex items-center justify-center">
                <Truck size={18} className="sm:w-5 sm:h-5" />
              </button>
              <Link href="/cart" className="relative text-gray-700 hover:text-green-600 transition-colors p-1.5 flex items-center justify-center">
                <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              <button className="text-gray-700 hover:text-green-600 transition-colors p-1.5 flex items-center justify-center">
                <User size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar - Below top row */}
          <div className="flex items-center gap-1 pb-2 sm:pb-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Desktop/Tablet Layout */}
        <div className="hidden lg:flex items-center justify-between py-4 md:py-5 gap-4 md:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="text-xl md:text-2xl font-bold flex items-center">
              <span className="text-green-600">Agri</span>
              <span className="text-[#2563eb] relative">
                <span className="absolute -top-1 left-0 text-green-600 text-lg md:text-xl">🌿</span>
                <span className="relative z-10">Begri</span>
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl flex items-center gap-2 mx-2 md:mx-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base h-[42px] md:h-[44px]"
              />
            </div>
            <button className="bg-[#2563eb] text-white px-3 md:px-4 py-0 rounded-r-md hover:bg-[#1d4ed8] flex items-center justify-center transition-colors h-[42px] md:h-[44px] aspect-square flex-shrink-0">
              <Search size={16} className="md:w-4 md:h-4" />
            </button>
            <button className="bg-[#16a34a] text-white px-3 md:px-4 py-2.5 rounded-md hover:bg-[#15803d] flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap hidden xl:flex transition-colors font-medium h-[42px] md:h-[44px]">
              <Search size={16} />
              <span>Search by Technical Name</span>
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3 md:gap-4 lg:gap-5 flex-shrink-0">
            <button className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-green-600 transition-colors text-xs md:text-sm px-2 py-1.5">
              <Truck size={20} className="md:w-6 md:h-6" />
              <span className="whitespace-nowrap font-medium">Track Order</span>
            </button>
            <Link href="/cart" className="relative flex flex-col items-center gap-0.5 text-gray-700 hover:text-green-600 transition-colors text-xs md:text-sm px-2 py-1.5">
              <ShoppingCart size={20} className="md:w-6 md:h-6" />
              <span className="whitespace-nowrap font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-green-600 transition-colors text-xs md:text-sm px-2 py-1.5">
              <User size={20} className="md:w-6 md:h-6" />
              <span className="whitespace-nowrap font-medium">My Account</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

