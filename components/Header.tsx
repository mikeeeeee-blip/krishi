'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Truck, Menu, X, LogOut, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export default function Header({ onMenuToggle, isMenuOpen = false }: HeaderProps) {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = getTotalItems();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200 relative z-30 w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 max-w-7xl mx-auto">
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
              <Image src='/logo.png' alt='logo' className='object-cover' height={100} width={200}></Image>
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
              {isAuthenticated ? (
                <Link
                  href="/my-orders"
                  className="text-gray-700 hover:text-green-600 transition-colors p-1.5 flex items-center justify-center"
                >
                  <User size={18} className="sm:w-5 sm:h-5" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-green-600 transition-colors p-1.5 flex items-center justify-center"
                >
                  <User size={18} className="sm:w-5 sm:h-5" />
                </Link>
              )}
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
           <Image src='/logo.png' alt='logo' className='object-cover' height={100} width={200}></Image>
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
            <button className="bg-[#2563eb] text-white px-4 md:px-5 py-0 rounded-r-md hover:bg-[#1d4ed8] flex items-center justify-center transition-colors h-[42px] md:h-[44px] min-w-[42px] md:min-w-[44px] flex-shrink-0">
              <Search size={18} className="md:w-5 md:h-5" />
            </button>
            <button className="bg-[#16a34a] text-white px-4 md:px-5 py-2.5 rounded-md hover:bg-[#15803d] flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap hidden xl:flex transition-colors font-semibold h-[42px] md:h-[44px] shadow-sm">
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
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-green-600 transition-colors text-xs md:text-sm px-2 py-1.5"
                  >
                    <User size={20} className="md:w-6 md:h-6" />
                    <span className="whitespace-nowrap font-medium">My Account</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user?.firstName}</p>
                        <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/my-orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-green-600 transition-colors text-xs md:text-sm px-2 py-1.5"
                >
                  <User size={20} className="md:w-6 md:h-6" />
                  <span className="whitespace-nowrap font-medium">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

