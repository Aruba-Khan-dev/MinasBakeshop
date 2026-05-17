'use client';

import { useState, useEffect } from 'react';
import HeroSlider from '@/components/hero-slider';
import CategoryCarousel from '@/components/category-carousel';
import ReviewsSection from '@/components/reviews-section';
import Footer from '@/components/footer';
import { supabase } from '@/lib/supabase';

// Helper to convert category name to URL slug
function toSlug(name: string) {
  return name.toLowerCase().replace(/'/g, '').replace(/[\/&]/g, ' ').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

interface CarouselProduct {
  id: string;
  name: string;
  category: string;
  accentColor: string;
  image?: string;
  price?: number;
  productLink: string;
}

export default function Home() {
  const [classicProducts, setClassicProducts] = useState<CarouselProduct[]>([]);
  const [weddingProducts, setWeddingProducts] = useState<CarouselProduct[]>([]);
  const [bentoProducts, setBentoProducts] = useState<CarouselProduct[]>([]);

  useEffect(() => {
    async function fetchFeatured() {
      // Fetch Classic Cakes
      const { data: classic } = await supabase
        .from('products').select('id, name, category, image_url, product_sizes(*)')
        .eq('category', 'Classic Cakes').limit(5);
      if (classic) {
        setClassicProducts(classic.map(p => ({
          id: String(p.id), name: p.name, category: 'CLASSIC', accentColor: '#F283AE',
          image: p.image_url || undefined,
          price: (p as { product_sizes?: { price: number }[] }).product_sizes?.[0]?.price,
          productLink: `/shop/classic-cakes/${p.id}`,
        })));
      }

      // Fetch Wedding Cakes
      const { data: wedding } = await supabase
        .from('products').select('id, name, category, image_url, product_sizes(*)')
        .eq('category', 'Wedding Cakes').limit(5);
      if (wedding) {
        setWeddingProducts(wedding.map(p => ({
          id: String(p.id), name: p.name, category: 'WEDDING', accentColor: '#C59FBE',
          image: p.image_url || undefined,
          price: (p as { product_sizes?: { price: number }[] }).product_sizes?.[0]?.price,
          productLink: `/shop/wedding-cakes/${p.id}`,
        })));
      }

      // Fetch Bento Flower Boxes
      const { data: bento } = await supabase
        .from('products').select('id, name, category, image_url, product_sizes(*)')
        .eq('category', 'Bento Flower Boxes').limit(5);
      if (bento) {
        setBentoProducts(bento.map(p => ({
          id: String(p.id), name: p.name, category: 'BENTO FLOWER', accentColor: '#98B8B9',
          image: p.image_url || undefined,
          price: (p as { product_sizes?: { price: number }[] }).product_sizes?.[0]?.price,
          productLink: `/shop/bento-flower-boxes/${p.id}`,
        })));
      }
    }
    fetchFeatured();
  }, []);

  return (
    <>
      <section>
        <HeroSlider />
      </section>

      {classicProducts.length > 0 && (
        <section className="bg-[#F0E8DF]/20">
          <CategoryCarousel title="Classic Cakes" products={classicProducts} viewAllLink="/shop/classic-cakes" accentColor="#F283AE" />
        </section>
      )}

      {weddingProducts.length > 0 && (
        <section>
          <CategoryCarousel title="Wedding Cakes" products={weddingProducts} viewAllLink="/shop/wedding-cakes" accentColor="#C59FBE" />
        </section>
      )}

      {bentoProducts.length > 0 && (
        <section className="bg-[#98B8B9]/10">
          <CategoryCarousel title="Bento Flower Boxes" products={bentoProducts} viewAllLink="/shop/bento-flower-boxes" accentColor="#98B8B9" />
        </section>
      )}

      <ReviewsSection />
      <Footer />
    </>
  );
}
