-- Create images table to store product and category images
CREATE TABLE IF NOT EXISTS public.images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename text NOT NULL,
  storage_path text NOT NULL,
  type text NOT NULL CHECK (type IN ('product', 'category')),
  product_id text,
  category_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing images
CREATE POLICY "Images are viewable by everyone"
  ON public.images
  FOR SELECT
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_images_product_id ON public.images(product_id);
CREATE INDEX idx_images_category_id ON public.images(category_id);
CREATE INDEX idx_images_type ON public.images(type);