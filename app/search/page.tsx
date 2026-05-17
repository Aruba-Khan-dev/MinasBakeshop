'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Footer from '@/components/footer';
import type { Product } from '@/lib/supabase';
import { getProductShopPath, searchProducts } from '@/lib/search-products';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q')?.trim() ?? '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!q) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await searchProducts(q, 48);
        if (!cancelled) setProducts(results);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div className="min-h-screen bg-[#FFFBF8] pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <h1 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] mb-2">Search results</h1>
        {q ? (
          <p className="text-[#98898D] mb-10">
            {loading
              ? `Finding products matching “${q}”…`
              : products.length > 0
                ? `${products.length} product${products.length === 1 ? '' : 's'} matching “${q}”`
                : `No products matching “${q}”`}
          </p>
        ) : (
          <p className="text-[#98898D] mb-10">Enter a search term in the header to find products.</p>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#F283AE]" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const price = product.product_sizes?.[0]?.price;
              return (
                <Link
                  key={product.id}
                  href={getProductShopPath(product)}
                  className="group bg-white rounded-xl shadow-sm border border-[#FAC1B5]/20 overflow-hidden hover:border-[#F283AE]/50 hover:shadow-md transition-all"
                >
                  <div className="aspect-square bg-[#F0E8DF]/40 flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-5xl">🎂</span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-xs font-semibold text-[#F283AE]">{product.category}</p>
                    <h2 className="font-semibold text-[#2C2C2C] group-hover:text-[#F283AE] transition-colors">
                      {product.name}
                    </h2>
                    {price != null && (
                      <p className="text-sm font-bold text-[#2C2C2C]">From Rs. {price.toLocaleString()}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : q ? (
          <p className="text-center text-[#98898D] py-16">
            Try searching for a cake name, flavour, or category (e.g. wedding, bento, chocolate).
          </p>
        ) : null}
      </div>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFBF8] pt-20 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#F283AE]" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
