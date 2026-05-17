'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SUPABASE_STORAGE = 'https://ixbctzycgtvhmejubfef.supabase.co/storage/v1/object/public/product-images/hero-slider';

const heroSlides = [
  {
    id: 1,
    title: 'Vintage',
    titleSub: 'Cakes',
    image: `${SUPABASE_STORAGE}/heroimage01.jpeg`,
    link: '/shop/vintage-cakes',
  },
  {
    id: 2,
    title: 'Fresh Flower',
    titleSub: 'Cakes',
    image: `${SUPABASE_STORAGE}/heroimage02.jpeg`,
    link: '/shop/fresh-flower-cakes',
  },
  {
    id: 3,
    title: 'Baby',
    titleSub: 'Cakes',
    image: `${SUPABASE_STORAGE}/heroimage03.jpeg`,
    link: '/shop/baby-cakes',
  },
  {
    id: 4,
    title: 'Luxury',
    titleSub: 'Gifting',
    image: `${SUPABASE_STORAGE}/heroimage04.jpeg`,
    link: '/shop/hampers-gift-boxes',
  },
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isClient, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index % heroSlides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div
      className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] min-h-[350px] max-h-[800px] overflow-hidden bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {heroSlides.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === currentIndex ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
          }`}
          suppressHydrationWarning
        >
          {/* Full-width background image */}
          <img
            src={s.image}
            alt={`${s.title} ${s.titleSub}`}
            className="w-full h-full object-cover object-center"
          />

          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-black/40 md:to-transparent" />

          {/* Order Now Button */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:bottom-20 md:left-12 md:translate-x-0 z-[2]">
            <Link
              href={s.link}
              className="inline-block px-6 py-2.5 md:px-8 md:py-3 bg-[#F283AE] hover:bg-[#E86FA3] text-white text-sm md:text-base font-semibold rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Order Now
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white rounded-full transition-colors shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} className="text-[#2C2C2C]" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white rounded-full transition-colors shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="text-[#2C2C2C]" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex
                ? 'bg-[#F283AE] w-8'
                : 'bg-white/60 hover:bg-white/80 w-2'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

