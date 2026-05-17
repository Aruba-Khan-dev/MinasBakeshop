'use client';

import React from 'react';

export interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price?: number;
  emoji?: string;
  accentColor: string;
  backgroundColor: string;
}

export default function ProductCard({
  id,
  name,
  category,
  price,
  emoji = '🎂',
  accentColor,
  backgroundColor,
}: ProductCardProps) {
  return (
    <div className="flex-shrink-0 w-56 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
      {/* Image Placeholder */}
      <div className={`aspect-square flex items-center justify-center ${backgroundColor}`}>
        <span className="text-5xl">{emoji}</span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-xs font-semibold px-2 py-1 rounded w-fit"
           style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
          {category}
        </p>

        <h3 className="font-semibold text-[#2C2C2C] text-sm line-clamp-2">{name}</h3>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div>
            {typeof price === 'number' ? (
              <p className="font-bold text-sm" style={{ color: accentColor }}>
                Rs. {price.toLocaleString()}
              </p>
            ) : (
              <p className="text-xs text-gray-500">Price on request</p>
            )}
          </div>
          <button
            className="text-white px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: accentColor }}
          >
            {typeof price === 'number' ? 'Add' : 'Customize'}
          </button>
        </div>
      </div>
    </div>
  );
}
