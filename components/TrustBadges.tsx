'use client';

import { CheckCircle2, Truck, Shield, HandCoins } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: CheckCircle2,
      title: 'Guaranteed Lowest Prices',
      bgColor: 'bg-green-600',
    },
    {
      icon: Truck,
      title: 'FREE India Wide Shipping',
      bgColor: 'bg-blue-600',
    },
    {
      icon: Shield,
      title: 'SAFE SHOPPING Guarantee',
      bgColor: 'bg-green-600',
    },
    {
      icon: HandCoins,
      title: 'EASY Returns & Replacements',
      bgColor: 'bg-blue-600',
    },
  ];

  return (
    <section className="bg-white py-4 sm:py-5 md:py-6 lg:py-8 border-b border-gray-200">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-2.5 sm:p-3 md:p-4 hover:shadow-md transition-all rounded-lg bg-gray-50 hover:bg-white"
              >
                <div className={`${badge.bgColor} rounded-full p-2 sm:p-2.5 md:p-3 mb-1.5 sm:mb-2 md:mb-3 flex-shrink-0`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <h4 className="text-[10px] xs:text-xs sm:text-xs md:text-sm lg:text-base font-semibold text-gray-900 leading-tight px-1">
                  {badge.title}
                </h4>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

