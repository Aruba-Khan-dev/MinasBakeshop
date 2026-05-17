'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import CartDrawer from './cart-drawer';
import HeaderSearch from './header-search';

export default function Header() {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <header className="bg-white border-b border-[#FAC1B5]/20 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inas-JLJ6buduzGt8x41vQzIlnOz0J2HrXe.png"
            alt="Minas Bakeshop Logo"
            className="h-12 md:h-16 w-auto object-contain"
          />
        </Link>

        {!isAdminPage && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <HeaderSearch variant="desktop" />
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4">
          {!isAdminPage && (
            <>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 hover:bg-[#F0E8DF] rounded-full transition-colors"
                aria-label="Open search"
              >
                <Search size={22} className="text-[#2C2C2C]" />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-[#F0E8DF] rounded-full transition-colors group"
                aria-label="Open cart"
              >
                <ShoppingBag size={24} className="text-[#2C2C2C] group-hover:text-[#F283AE] transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F283AE] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                    {totalItems}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {isSearchOpen && !isAdminPage && (
        <div className="fixed inset-0 bg-white z-[100] md:hidden p-4 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <HeaderSearch variant="mobile" onNavigate={() => setIsSearchOpen(false)} />
            <button onClick={() => setIsSearchOpen(false)} className="p-2 shrink-0" aria-label="Close search">
              <X size={24} className="text-[#2C2C2C]" />
            </button>
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
