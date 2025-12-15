-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES public.categories(id),
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table based on CSV structure
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  barcode TEXT NOT NULL UNIQUE,
  base_unit TEXT,
  price DECIMAL(10, 2),
  group_code TEXT,
  category_id UUID REFERENCES public.categories(id),
  is_valid_barcode BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and products
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_products_barcode ON public.products(barcode);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_group_code ON public.products(group_code);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);

-- Create function to generate OpenFoodFacts image URL from barcode
CREATE OR REPLACE FUNCTION public.get_product_image_url(barcode TEXT)
RETURNS TEXT AS $$
DECLARE
  clean_barcode TEXT;
BEGIN
  clean_barcode := barcode;
  IF LENGTH(clean_barcode) >= 13 THEN
    RETURN 'https://images.openfoodfacts.org/images/products/' || 
           SUBSTRING(clean_barcode FROM 1 FOR 3) || '/' ||
           SUBSTRING(clean_barcode FROM 4 FOR 3) || '/' ||
           SUBSTRING(clean_barcode FROM 7 FOR 3) || '/' ||
           SUBSTRING(clean_barcode FROM 10) || '/front_de.3.400.jpg';
  ELSE
    RETURN 'https://images.openfoodfacts.org/images/products/' || clean_barcode || '/front_de.3.400.jpg';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();