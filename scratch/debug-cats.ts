import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: categories, error: catError } = await supabase.from('categories').select('*');
  if (catError) console.error(catError);
  else console.log("Categories Table:", categories);

  const { data: products, error: prodError } = await supabase.from('products').select('category');
  if (prodError) console.error(prodError);
  else {
    const uniqueCats = Array.from(new Set(products.map(p => p.category)));
    console.log("Unique Categories in Products Table:", uniqueCats);
  }
}
main();
