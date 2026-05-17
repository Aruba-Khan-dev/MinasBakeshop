'use client';

import React, { useState, useRef } from 'react';
import ProductCard, { ProductCardProps } from './product-card';

interface HorizontalProductListProps {
  title: string;
  products: ProductCardProps[];
  accentColor: string;
  backgroundColor: string;
  emoji: string;
}

export default function HorizontalProductList({
  title,
  products,
  accentColor,
  backgroundColor,
  emoji,
}: HorizontalProductListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [expandedView, setExpandedView] = useState(false);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (expandedView) {
    return (
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{emoji}</span>
              <h2 className="text-3xl font-serif text-[#2C2C2C]">{title}</h2>
            </div>
            <button
              onClick={() => setExpandedView(false)}
              className="text-[#98898D] hover:text-[#2C2C2C] font-semibold"
            >
              ← Back
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{emoji}</span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#2C2C2C]">{title}</h2>
          </div>
          <button
            onClick={() => setExpandedView(true)}
            className="text-sm md:text-base font-semibold transition-colors"
            style={{ color: accentColor }}
          >
            See More →
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="relative group">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#2C2C2C] p-2 rounded-full shadow-lg transition-colors"
            >
              ←
            </button>
          )}

          {/* Product Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}

            {/* See More Card */}
            <div
              className="flex-shrink-0 w-56 rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border-2 border-dashed flex items-center justify-center cursor-pointer group/more"
              style={{ borderColor: accentColor, backgroundColor: `${accentColor}10` }}
              onClick={() => setExpandedView(true)}
            >
              <div className="text-center space-y-2">
                <p className="text-3xl font-bold" style={{ color: accentColor }}>
                  +{products.length - 6}
                </p>
                <p className="text-sm font-semibold text-[#98898D]">More Products</p>
                <p className="text-xs text-[#98898D]">Click to explore all</p>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#2C2C2C] p-2 rounded-full shadow-lg transition-colors"
            >
              →
            </button>
          )}
        </div>
      </div>

      {/* Hide scrollbar styling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
