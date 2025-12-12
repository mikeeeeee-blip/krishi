'use client';

import { LucideIcon } from 'lucide-react';

interface OrderSummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  bgColor?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export default function OrderSummaryCard({
  title,
  value,
  icon: Icon,
  iconColor,
  bgColor = 'bg-white',
  onClick,
  isActive = false,
}: OrderSummaryCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`${bgColor} rounded-lg border-2 p-4 shadow-sm transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-105 active:scale-100' : ''
      } ${
        isActive 
          ? 'border-green-500 bg-green-50 shadow-md' 
          : 'border-gray-200 hover:border-green-300'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <p className={`text-sm ${isActive ? 'text-green-700 font-semibold' : 'text-gray-600'}`}>
          {title}
        </p>
      </div>
      <p className={`text-2xl font-bold ${isActive ? 'text-green-700' : 'text-gray-900'}`}>
        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
      </p>
    </div>
  );
}

