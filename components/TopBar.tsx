'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function TopBar() {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  return (
    <div className="bg-[#2563eb] text-white text-sm w-full">
      <div className="w-full px-4 md:px-6">
        <div className="flex items-center justify-between py-2.5 md:py-3">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="whitespace-nowrap font-medium text-xs md:text-sm">Extra Discount On Online Payment</span>
            <span className="whitespace-nowrap font-medium text-xs md:text-sm hidden sm:inline">Partial Payment Extra Discount</span>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity font-medium text-xs md:text-sm"
              >
                <span>EN</span>
                <ChevronDown size={14} className={`transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <a href="#" className="hover:underline whitespace-nowrap text-xs md:text-sm font-medium">Sell with us</a>
            <a href="#" className="hover:underline whitespace-nowrap text-xs md:text-sm font-medium">Seller Login</a>
            <a href="#" className="hover:underline whitespace-nowrap text-xs md:text-sm font-medium hidden sm:inline">Be a Partner</a>
            <a href="#" className="hover:underline whitespace-nowrap text-xs md:text-sm font-medium hidden md:inline">Ask Agro Experts</a>
          </div>
        </div>
      </div>
    </div>
  );
}

