'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getAllCategories } from '@/lib/supabase';
import type { Category } from '@/lib/supabase';
import { useSidebar } from '@/context/sidebar-context';

export default function SidebarNav() {
  const { isOpen, setIsOpen } = useSidebar();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchCats() {
      try {
        const data = await getAllCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    fetchCats();
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const toggleSubmenu = (menu: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(menu)) {
        next.delete(menu);
      } else {
        next.add(menu);
      }
      return next;
    });
  };

  const isExpanded = (menu: string) => expandedMenus.has(menu);

  // Group categories dynamically
  const cakes = categories.filter(c => c.group === 'Cakes');
  const desserts = categories.filter(c => c.group === 'Desserts');
  const luxuryGifting = categories.filter(c => c.group === 'Luxury Gifting');
  const other = categories.filter(c => c.group === 'Other');

  // Helper to generate slug from category name (fallback if slug not in DB)
  const toSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/'/g, '')
      .replace(/[\/&]/g, ' ')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  return (
    <>
      {/* Close button shown on top of the open sidebar */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed top-[10px] left-4 md:left-6 z-50 p-2 hover:bg-[#F0E8DF]/50 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X size={24} className="text-[#2C2C2C]" />
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-80 bg-[#FCE4EC] shadow-lg transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        {/* Navigation Menu */}
        <nav className="p-6 space-y-1 mt-12">
          {/* Home */}
          <Link
            href="/"
            className="block px-4 py-3 text-[#2C2C2C] hover:bg-[#F0E8DF]/50 rounded-lg transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {/* Shop - Collapsible */}
          <div>
            <button
              onClick={() => toggleSubmenu('shop')}
              className="w-full flex justify-between items-center px-4 py-3 text-[#2C2C2C] hover:bg-[#F0E8DF]/50 rounded-lg transition-colors font-medium"
            >
              <span>Shop</span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  isExpanded('shop') ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Shop Submenu */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded('shop') ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="ml-4 mt-2 space-y-1 pl-2 border-l-2 border-[#FAC1B5]/30">
                {/* Cakes */}
                <div>
                  <button
                    onClick={() => toggleSubmenu('cakes')}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#98898D] hover:text-[#F283AE] uppercase tracking-wider flex justify-between items-center rounded-md hover:bg-[#F283AE]/5 transition-colors"
                  >
                    Cakes
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        isExpanded('cakes') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded('cakes') ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-2 space-y-0.5 pl-2 border-l border-[#FAC1B5]/20">
                      {cakes.map((cake) => (
                        <Link
                          key={cake.id}
                          href={`/shop/${cake.slug}`}
                          className="block px-4 py-1.5 text-xs text-[#2C2C2C] hover:text-[#F283AE] hover:bg-[#F283AE]/5 rounded-md transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {cake.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desserts */}
                <div>
                  <button
                    onClick={() => toggleSubmenu('desserts')}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#98898D] hover:text-[#F283AE] uppercase tracking-wider flex justify-between items-center rounded-md hover:bg-[#F283AE]/5 transition-colors"
                  >
                    Desserts
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        isExpanded('desserts') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded('desserts') ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-2 space-y-0.5 pl-2 border-l border-[#FAC1B5]/20">
                      {desserts.map((dessert) => (
                        <Link
                          key={dessert.id}
                          href={`/shop/${dessert.slug}`}
                          className="block px-4 py-1.5 text-xs text-[#2C2C2C] hover:text-[#F283AE] hover:bg-[#F283AE]/5 rounded-md transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {dessert.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Luxury Gifting */}
                <div>
                  <button
                    onClick={() => toggleSubmenu('luxury')}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#98898D] hover:text-[#F283AE] uppercase tracking-wider flex justify-between items-center rounded-md hover:bg-[#F283AE]/5 transition-colors"
                  >
                    Luxury Gifting
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        isExpanded('luxury') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded('luxury') ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-2 space-y-0.5 pl-2 border-l border-[#FAC1B5]/20">
                      {luxuryGifting.map((item) => (
                        <Link
                          key={item.id}
                          href={`/shop/${item.slug}`}
                          className="block px-4 py-1.5 text-xs text-[#2C2C2C] hover:text-[#F283AE] hover:bg-[#F283AE]/5 rounded-md transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Other Categories */}
                {other.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleSubmenu('other')}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#98898D] hover:text-[#F283AE] uppercase tracking-wider flex justify-between items-center rounded-md hover:bg-[#F283AE]/5 transition-colors"
                    >
                      Other
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          isExpanded('other') ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded('other') ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="ml-2 space-y-0.5 pl-2 border-l border-[#FAC1B5]/20">
                        {other.map((item) => (
                          <Link
                            key={item.id}
                            href={`/shop/${item.slug}`}
                            className="block px-4 py-1.5 text-xs text-[#2C2C2C] hover:text-[#F283AE] hover:bg-[#F283AE]/5 rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Custom Order */}
          <Link
            href="/customize"
            className="block px-4 py-3 text-[#2C2C2C] hover:bg-[#F0E8DF]/50 rounded-lg transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            Custom Order
          </Link>

          {/* About Us */}
          <Link
            href="/about"
            className="block px-4 py-3 text-[#2C2C2C] hover:bg-[#F0E8DF]/50 rounded-lg transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>

          {/* Contact Us */}
          <Link
            href="/contact"
            className="block px-4 py-3 text-[#2C2C2C] hover:bg-[#F0E8DF]/50 rounded-lg transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
        </nav>
      </aside>
    </>
  );
}
