-- Fix function search path for get_product_image_url
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
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;