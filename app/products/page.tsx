'use client';

import { useState } from 'react';
import Link from 'next/link';

const allProducts = [
  // Trending
  { id: '1', name: 'Classic Vanilla Cake', category: 'TRENDING', emoji: '🎂', description: 'Timeless and elegant' },
  { id: '2', name: 'Chocolate Dream', category: 'TRENDING', emoji: '🍫', description: 'Rich chocolate perfection' },
  { id: '3', name: 'Strawberry Bliss', category: 'TRENDING', emoji: '🍓', description: 'Fresh and fruity' },
  { id: '4', name: 'Matcha Latte Cake', category: 'TRENDING', emoji: '🍵', description: 'Modern and sophisticated' },
  // Wedding
  { id: 'w1', name: 'Elegant White Pearl', category: 'WEDDING', emoji: '💍', description: 'Pristine elegance' },
  { id: 'w2', name: 'Rose Garden Romance', category: 'WEDDING', emoji: '🌹', description: 'Romantic design' },
  // Bento
  { id: 'b1', name: 'Mini Heart Bento', category: 'BENTO', emoji: '💕', description: 'Adorable portions' },
  { id: 'b2', name: 'Teddy Bear Box', category: 'BENTO', emoji: '🧸', description: 'Cute and delicious' },
  // Eid
  { id: 'e1', name: 'Eid Moon Cake', category: 'EID', emoji: '🌙', description: 'Festive favorite' },
  { id: 'e2', name: 'Star Delight', category: 'EID', emoji: '⭐', description: 'Celebration special' },
];

const themes = [
  { id: 'all', label: 'All Products', icon: '🎂' },
  { id: 'TRENDING', label: 'Trending', icon: '🔥' },
  { id: 'WEDDING', label: 'Wedding', icon: '💍' },
  { id: 'EID', label: 'Eid', icon: '🌙' },
  { id: 'BENTO', label: 'Bento', icon: '📦' },
];

export default function ProductsPage() {
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = allProducts.filter((product) => {
    const matchesTheme = selectedTheme === 'all' || product.category === selectedTheme;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF8] to-[#FAC1B5]/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C2C2C] mb-4">Browse Our Cakes</h1>
          <p className="text-[#98898D] text-lg">Discover our collection of custom cakes for every occasion</p>
        </div>

        {/* Theme Filters */}
        <div className="mb-12 flex flex-wrap gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedTheme === theme.id
                  ? 'bg-[#F283AE] text-white shadow-lg'
                  : 'bg-white border border-[#FAC1B5] text-[#2C2C2C] hover:border-[#F283AE]'
              }`}
            >
              {theme.icon} {theme.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#FAC1B5]/20 hover:border-[#F283AE]/50"
              >
                {/* Product Image Placeholder */}
                <div className="aspect-square bg-gradient-to-br from-[#FAC1B5]/30 to-[#F283AE]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-6xl">{product.emoji}</span>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <p className="text-xs font-semibold text-[#F283AE] bg-[#F283AE]/10 w-fit px-2 py-1 rounded">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-[#2C2C2C] group-hover:text-[#F283AE] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#98898D]">{product.description}</p>
                  <button className="w-full mt-4 bg-[#F283AE] text-white py-2 rounded-lg font-medium hover:bg-[#E86FA3] transition-colors">
                    Customize
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[#98898D] text-lg">No products found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
