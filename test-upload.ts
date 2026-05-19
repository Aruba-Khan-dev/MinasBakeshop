import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpload() {
  const dummyFile = Buffer.from('test image content');
  const fileName = `custom-orders/test-${Date.now()}.txt`;
  
  console.log('Attempting to upload to product-images bucket...');
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, dummyFile, {
      contentType: 'text/plain'
    });

  if (error) {
    console.error('Upload error:', error);
  } else {
    console.log('Upload success:', data);
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
    console.log('Public URL:', publicUrlData.publicUrl);
  }
}

testUpload();
