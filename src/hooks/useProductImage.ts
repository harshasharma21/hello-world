import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Cache for product images (from `newProducts.image_url`)
const imageCache = new Map<string, string>();

// Fetch product image URL from `newProducts.image_url` via Supabase
export const fetchProductImage = async (barcode: string): Promise<string> => {
  if (imageCache.has(barcode)) return imageCache.get(barcode)!;

  try {
    // newProducts stores Barcode as a numeric column named `Barcode` (note the capital B).
    // Accept either a numeric string or number; convert to number when possible so PostgREST matches correctly.
    const parsed = barcode && /^[0-9]+$/.test(barcode) ? Number(barcode) : barcode;
    const { data, error } = await supabase
      .from("newProducts")
      .select("image_url")
      .eq("Barcode", parsed as any)
      .limit(1)
      .single();

    if (error) throw error;
    if (data?.image_url) {
      const imageUrl = (data as any).image_url as string;
      imageCache.set(barcode, imageUrl);
      return imageUrl;
    }
  } catch (err) {
    console.log(`Failed to fetch image for barcode ${barcode}`, err);
  }

  return "/placeholder.svg";
};

// Hook to fetch and cache product image
export const useProductImage = (barcode: string) => {
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      const url = await fetchProductImage(barcode);
      setImageUrl(url);
      setIsLoading(false);
    };
    loadImage();
  }, [barcode]);

  return { imageUrl, isLoading };
};

// Get cached image or placeholder (synchronous)
export const getCachedImageUrl = (barcode: string): string => {
  return imageCache.get(barcode) || "/placeholder.svg";
};

// Prefetch images for multiple products
export const prefetchProductImages = async (barcodes: string[]): Promise<void> => {
  const uncachedBarcodes = barcodes.filter((b) => !imageCache.has(b));
  await Promise.all(uncachedBarcodes.map((b) => fetchProductImage(b)));
};
