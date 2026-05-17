'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop/wedding', label: 'Shop' },
    { href: '/customize', label: 'Custom Order' },
    { href: '/admin/dashboard', label: 'Admin' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#FAC1B5]/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="relative w-8 h-8">
            <Image
              src="/logo.png"
              alt="Mina's Bakeshop"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-serif text-lg font-bold text-[#2C2C2C] hidden sm:inline">
            Mina&apos;s
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xs"
        >
          <input
            type="text"
            placeholder="Search cakes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-l-lg bg-[#F0E8DF] text-[#2C2C2C] placeholder-[#98898D] focus:outline-none focus:ring-2 focus:ring-[#F283AE]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#F283AE] text-white rounded-r-lg hover:bg-[#E86FA3] transition-colors"
          >
            🔍
          </button>
        </form>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-[#F283AE] border-b-2 border-[#F283AE]'
                  : 'text-[#2C2C2C] hover:text-[#F283AE]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-[#F0E8DF]"
        >
          <svg
            className="w-6 h-6 text-[#2C2C2C]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                mobileMenuOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#FAC1B5]/30 shadow-lg">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="border-b border-[#FAC1B5]/20 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#F0E8DF] text-[#2C2C2C] placeholder-[#98898D] focus:outline-none focus:ring-2 focus:ring-[#F283AE]"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#F283AE] text-white rounded-lg hover:bg-[#E86FA3] transition-colors"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col p-4 gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#F283AE] text-white'
                    : 'text-[#2C2C2C] hover:bg-[#F0E8DF]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
