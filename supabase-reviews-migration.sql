-- ============================================
-- Reviews table migration
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS reviews (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (customers can post reviews)
CREATE POLICY "Allow insert on reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Allow anyone to read reviews (shown on homepage carousel)
CREATE POLICY "Allow read on reviews" ON reviews FOR SELECT USING (true);

-- Allow admin (anon key with service role) to delete
CREATE POLICY "Allow delete on reviews" ON reviews FOR DELETE USING (true);
