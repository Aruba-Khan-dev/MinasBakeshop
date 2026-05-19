import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envLocalPath = path.resolve('.env.local');
const envLocalContent = fs.readFileSync(envLocalPath, 'utf-8');
const env: Record<string, string> = {};
envLocalContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    if (key && value) {
      env[key.trim()] = value.trim();
    }
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
  } else {
    console.log('Products count:', data.length);
    const categoriesUsed = Array.from(new Set(data.map(p => p.category)));
    console.log('Categories used in products table:', categoriesUsed);
    console.log('Luxury products:', data.filter(p => p.category && p.category.toLowerCase().includes('bento') || p.category && p.category.toLowerCase().includes('gift') || p.category && p.category.toLowerCase().includes('hamper') || p.category && p.category.toLowerCase().includes('luxury')));
  }
}

listProducts();
