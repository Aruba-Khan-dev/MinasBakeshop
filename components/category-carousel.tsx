'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  emoji?: string;
  accentColor: string;
  image?: string;
  price?: number;
  productLink?: string;
}

interface CategoryCarouselProps {
  title: string;
  products: Product[];
  viewAllLink: string;
  accentColor: string;
}

export default function CategoryCarousel({
  title,
  products,
  viewAllLink,
  accentColor
}: CategoryCarouselProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = 300;
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-10 md:py-12 px-4 md:px-12 max-w-full">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-serif text-[#2C2C2C]">{title}</h2>
        <Link
          href={viewAllLink}
          className="flex items-center gap-1 md:gap-2 text-sm font-semibold"
          style={{ color: accentColor }}
        >
          View All
          <ChevronRight size={18} />
        </Link>
      </div>

      <div className="relative">
        {/* Scroll Container */}
        <div
          ref={scrollContainer}
          className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
          style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.productLink || viewAllLink}
              className="flex-shrink-0 w-48 md:w-64 group"
            >
              <div
                className="h-48 md:h-64 rounded-2xl overflow-hidden mb-3 md:mb-4 transition-transform group-hover:scale-[1.03] flex items-center justify-center text-6xl"
                style={{
                  backgroundColor: `${accentColor}15`,
                  borderLeft: `4px solid ${accentColor}`
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  product.emoji
                )}
              </div>
              <h3 className="font-semibold text-[#2C2C2C] text-center text-sm md:text-base mb-1 line-clamp-1">
                {product.name}
              </h3>
              {product.price ? (
                <p
                  className="text-xs md:text-sm text-center font-bold"
                  style={{ color: accentColor }}
                >
                  Rs. {product.price.toLocaleString()}
                </p>
              ) : (
                <p
                  className="text-xs text-center font-semibold"
                  style={{ color: accentColor }}
                >
                  From Rs. 2,600
                </p>
              )}
            </Link>
          ))}
        </div>

        {/* Navigation Buttons — hidden on mobile, visible on desktop */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-4 top-1/3 -translate-y-1/2 p-2 bg-white border border-[#FAC1B5]/30 hover:border-[#FAC1B5] rounded-full transition-colors shadow-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} className="text-[#2C2C2C]" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-4 top-1/3 -translate-y-1/2 p-2 bg-white border border-[#FAC1B5]/30 hover:border-[#FAC1B5] rounded-full transition-colors shadow-sm"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="text-[#2C2C2C]" />
        </button>
      </div>
    </section>
  );
}
