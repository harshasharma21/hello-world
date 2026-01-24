-- Add image_url column to newProducts table
ALTER TABLE public."newProducts"
ADD COLUMN IF NOT EXISTS image_url text;