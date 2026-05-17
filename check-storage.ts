import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStorage() {
  const { data, error } = await supabase.storage.from('product-images').list('hero-slider');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Hero slider files:', data);
  }
}

checkStorage();
