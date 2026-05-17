-- Run this in Supabase Dashboard → SQL Editor
-- Fixes order placement: missing columns + RLS policies

-- Auto-generate order_number if the app does not send one (optional safety net)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS trigger AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'MB-' || to_char(now(), 'YYYYMMDDHH24MISS') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
  END IF;
  IF NEW.order_type IS NULL OR NEW.order_type = '' THEN
    NEW.order_type := COALESCE(NEW.delivery_method, 'standard');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Add columns the checkout form expects (safe if they already exist)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_method text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS date date;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS time_slot text;

-- Backfill phone from customer_phone if your table uses the older column name
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'customer_phone'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'phone'
  ) THEN
    ALTER TABLE orders RENAME COLUMN customer_phone TO phone;
  END IF;
END $$;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone text;

-- Allow the site (anon key) to create and read orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on orders" ON orders;
CREATE POLICY "Allow all on orders" ON orders
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
