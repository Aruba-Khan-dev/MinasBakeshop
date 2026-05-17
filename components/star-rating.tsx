'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export default function StarRating({
  value,
  onChange,
  interactive = true,
  size = 'md',
  showNumber = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const displayRating = hoverRating || value;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;

          if (interactive) {
            return (
              <button
                key={index}
                type="button"
                onClick={() => onChange(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-all cursor-pointer hover:scale-110"
                aria-label={`Rate ${starValue} star${starValue !== 1 ? 's' : ''}`}
              >
                <Star
                  size={16}
                  className={`${sizeClasses[size]} transition-colors ${
                    isFilled
                      ? 'fill-[#FFD700] text-[#FFD700]'
                      : 'fill-[#E0E0E0] text-[#E0E0E0]'
                  }`}
                />
              </button>
            );
          } else {
            return (
              <div
                key={index}
                className="transition-all cursor-default"
                aria-label={`Rating: ${starValue} star${starValue !== 1 ? 's' : ''}`}
              >
                <Star
                  size={16}
                  className={`${sizeClasses[size]} transition-colors ${
                    isFilled
                      ? 'fill-[#FFD700] text-[#FFD700]'
                      : 'fill-[#E0E0E0] text-[#E0E0E0]'
                  }`}
                />
              </div>
            );
          }
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-[#2C2C2C] ml-2">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
