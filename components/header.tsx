'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Search, X, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useSidebar } from '@/context/sidebar-context';
import CartDrawer from './cart-drawer';
import HeaderSearch from './header-search';

export default function Header() {
  const { totalItems } = useCart();
  const { isOpen, setIsOpen } = useSidebar();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith('/admin');

  if (pathname === '/admin/login') {
    return null;
  }

  return (
    <header className="bg-white border-b border-[#FAC1B5]/20 sticky top-0 z-30 relative">
      {!isAdminPage && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-2 hover:bg-[#F0E8DF]/50 rounded-lg transition-colors z-20"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-[#2C2C2C]" />
        </button>
      )}
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Left Side: Search Bar (Desktop) */}
        <div className="flex-1 flex items-center justify-start gap-4">
          {!isAdminPage && (
            <div className="hidden md:block w-full max-w-xs">
              <HeaderSearch variant="desktop" />
            </div>
          )}
        </div>

        {/* Center: Actual Logo */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
        >
          <span className="pointer-events-auto h-12 sm:h-14 flex items-center justify-center max-w-[220px]">
            <Image
              src="/logo.png"
              alt="Minas Bakeshop"
              width={220}
              height={56}
              className="object-contain max-h-full w-auto mix-blend-multiply"
              priority
            />
          </span>
        </Link>

        {/* Right Side: Icons */}
        <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
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
