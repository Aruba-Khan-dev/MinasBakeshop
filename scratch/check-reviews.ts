import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  // Fetch one row to see column names
  const { data, error } = await supabase.from('reviews').select('*').limit(1);
  console.log('Error:', error);
  console.log('Data:', data);
  if (data && data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
  } else {
    // Try inserting a minimal row to see what columns are expected
    const { error: insertErr } = await supabase.from('reviews').insert({ test: 'test' });
    console.log('Insert error (shows expected columns):', insertErr);
  }
}

main();
