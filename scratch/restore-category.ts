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

async function restoreCategory() {
  console.log('Deleting incorrect category...');
  await supabase
    .from('categories')
    .delete()
    .eq('slug', 'bento-flower-box');

  console.log('Checking category existence for bento-flower-boxes...');
  const { data: existing, error: fetchError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', 'bento-flower-boxes')
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching:', fetchError);
    return;
  }

  if (existing) {
    console.log('Category already exists:', existing);
    return;
  }

  console.log('Category not found, inserting correct one...');
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: 'Bento Flower Boxes',
      slug: 'bento-flower-boxes',
      group: 'Luxury Gifting'
    })
    .select()
    .single();

  if (error) {
    console.error('Insert error:', error);
  } else {
    console.log('Restored category successfully:', data);
  }
}

restoreCategory();
