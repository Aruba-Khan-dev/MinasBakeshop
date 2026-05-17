'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function SplashCard() {
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and then hide splash after 3.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#E8E4DC] transition-opacity duration-500 ease-out animate-fade-in">
      {/* Logo Image as Center Focus */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Mina's Bakeshop Logo"
          width={400}
          height={400}
          className="object-contain max-w-full max-h-full"
          priority
        />
      </div>

      {/* Loading Indicator at Bottom */}
      <div className="absolute bottom-16 flex justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#2C2C2C] animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-[#2C2C2C] animate-pulse animation-delay-200" />
        <div className="w-2 h-2 rounded-full bg-[#2C2C2C] animate-pulse animation-delay-400" />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  )
}
