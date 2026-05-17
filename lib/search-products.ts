import type { Product } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

export function categoryToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[\/&]/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getProductShopPath(product: Product): string {
  return `/shop/${categoryToSlug(product.category)}/${product.id}`;
}

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

/** Score how closely a product matches the search query (higher = better). */
export function scoreProductMatch(product: Product, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const name = normalize(product.name);
  const category = normalize(product.category);
  const description = normalize(product.description || '');

  let score = 0;

  if (name === q) score = Math.max(score, 100);
  if (name.startsWith(q)) score = Math.max(score, 85);
  if (name.includes(q)) score = Math.max(score, 70);
  if (category.includes(q)) score = Math.max(score, 55);
  if (description.includes(q)) score = Math.max(score, 40);

  const words = q.split(/\s+/).filter((w) => w.length > 1);
  if (words.length > 1) {
    let wordHits = 0;
    for (const word of words) {
      if (name.includes(word) || category.includes(word) || description.includes(word)) {
        wordHits += 1;
      }
    }
    if (wordHits === words.length) score = Math.max(score, 65);
    else if (wordHits > 0) score = Math.max(score, 30 + wordHits * 12);
  } else if (words.length === 1) {
    const word = words[0];
    if (name.includes(word)) score = Math.max(score, 50);
    else if (category.includes(word)) score = Math.max(score, 35);
    else if (description.includes(word)) score = Math.max(score, 25);
  }

  return score;
}

export function rankProductsBySearch(
  products: Product[],
  query: string,
  limit = 20
): Product[] {
  const q = query.trim();
  if (!q) return [];

  return products
    .map((product) => ({ product, score: scoreProductMatch(product, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product }) => product);
}

export async function searchProducts(query: string, limit = 20): Promise<Product[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const escaped = q.replace(/[%_\\]/g, '');
  const pattern = `%${escaped}%`;

  const { data, error } = await supabase
    .from('products')
    .select('*, product_sizes(*)')
    .or(`name.ilike.${pattern},category.ilike.${pattern},description.ilike.${pattern}`)
    .limit(80);

  if (!error && data?.length) {
    const ranked = rankProductsBySearch(data, q, limit);
    if (ranked.length > 0) return ranked;
  }

  const { data: all, error: allError } = await supabase
    .from('products')
    .select('*, product_sizes(*)');

  if (allError) throw allError;

  return rankProductsBySearch(all || [], q, limit);
}
