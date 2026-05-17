'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
  ctaText: string;
}

const defaultBanners: Banner[] = [
  {
    id: '1',
    title: 'Eid Specials',
    subtitle: 'Celebrate Eid with our exclusive cake collection',
    emoji: '🎉',
    gradient: 'from-[#F283AE] to-[#C59FBE]',
    ctaText: 'Order Now',
  },
  {
    id: '2',
    title: 'Wedding Collection',
    subtitle: 'Make your special day even more beautiful',
    emoji: '💍',
    gradient: 'from-[#C59FBE] to-[#98B8B9]',
    ctaText: 'Explore',
  },
  {
    id: '3',
    title: 'Bento Boxes',
    subtitle: 'Adorable individual cake portions for everyone',
    emoji: '📦',
    gradient: 'from-[#98B8B9] to-[#C6C870]',
    ctaText: 'Order Now',
  },
  {
    id: '4',
    title: 'Mehndi Magic',
    subtitle: 'Celebrate with colorful, delicious designs',
    emoji: '🎨',
    gradient: 'from-[#FAC1B5] to-[#F283AE]',
    ctaText: 'Browse',
  },
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Ensure hydration matches by setting client flag
  useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!autoPlay || !isClient) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, isClient]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + defaultBanners.length) % defaultBanners.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % defaultBanners.length);
    setAutoPlay(false);
  };

  const currentBanner = isClient ? defaultBanners[currentIndex] : defaultBanners[0];

  return (
    <div className="relative w-full h-96 md:h-80 rounded-2xl overflow-hidden group">
      {/* Banner Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${currentBanner.gradient} transition-all duration-500`}
        suppressHydrationWarning
      />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-start px-8 md:px-12">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-4" suppressHydrationWarning>
            <span className="text-5xl">{currentBanner.emoji}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white">
              {currentBanner.title}
            </h2>
          </div>

          <p className="text-white/95 text-lg max-w-md">{currentBanner.subtitle}</p>

          <button className="bg-white text-[#F283AE] px-6 py-3 rounded-lg font-semibold hover:bg-[#F0E8DF] transition-colors">
            {currentBanner.ctaText}
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#F283AE] p-2 rounded-full transition-colors z-10"
      >
        ←
      </button>

      <button
        onClick={goToNext}
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#F283AE] p-2 rounded-full transition-colors z-10"
      >
        →
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {defaultBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setAutoPlay(false);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
