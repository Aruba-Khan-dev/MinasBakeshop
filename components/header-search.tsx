'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Search } from 'lucide-react';
import type { Product } from '@/lib/supabase';
import { getProductShopPath, searchProducts } from '@/lib/search-products';

type HeaderSearchProps = {
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
};

export default function HeaderSearch({ variant = 'desktop', onNavigate }: HeaderSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const runSearch = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const matches = await searchProducts(trimmed, 8);
      setResults(matches);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      runSearch(query);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, open, runSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function goToSearchPage(q?: string) {
    const term = (q ?? query).trim();
    if (!term) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    goToSearchPage();
  }

  const inputClass =
    variant === 'mobile'
      ? 'w-full bg-[#F0E8DF]/40 border border-[#FAC1B5]/20 rounded-full py-3 px-5 pl-12 focus:outline-none focus:border-[#F283AE]'
      : 'w-full bg-[#F0E8DF]/40 border border-[#FAC1B5]/20 rounded-full py-2 px-5 pl-12 focus:outline-none focus:border-[#F283AE] transition-all text-sm';

  return (
    <div ref={containerRef} className={variant === 'desktop' ? 'relative w-full' : 'relative flex-1'}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="search"
          placeholder={variant === 'mobile' ? 'Search...' : 'Search for cakes, brownies...'}
          className={inputClass}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          autoFocus={variant === 'mobile'}
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98898D] pointer-events-none"
          size={variant === 'mobile' ? 20 : 18}
        />
      </form>

      {open && query.trim().length >= 2 && (
        <div
          className={`absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-[#FAC1B5]/30 bg-white shadow-xl ${
            variant === 'mobile' ? 'top-full' : 'top-full'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-[#98898D]">
              <Loader2 className="h-4 w-4 animate-spin text-[#F283AE]" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-2">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={getProductShopPath(product)}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F0E8DF]/50 transition-colors"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F0E8DF]/60 flex items-center justify-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">🎂</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate font-semibold text-[#2C2C2C]">{product.name}</p>
                      <p className="truncate text-xs text-[#98898D]">{product.category}</p>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="border-t border-[#FAC1B5]/20">
                <button
                  type="button"
                  onClick={() => goToSearchPage()}
                  className="w-full px-4 py-3 text-center text-sm font-semibold text-[#F283AE] hover:bg-[#F0E8DF]/40"
                >
                  View all results for &ldquo;{query.trim()}&rdquo;
                </button>
              </li>
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-[#98898D]">
              No products found. Try a different search term.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
