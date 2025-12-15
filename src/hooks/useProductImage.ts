import { useState, useEffect } from "react";

// Cache for product images from Open Food Facts API
const imageCache = new Map<string, string>();

// Fetch product image URL from Open Food Facts API
export const fetchProductImage = async (barcode: string): Promise<string> => {
  // Check cache first
  if (imageCache.has(barcode)) {
    return imageCache.get(barcode)!;
  }

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    const data = await response.json();

    if (data.status === 1 && data.product?.image_url) {
      const imageUrl = data.product.image_url;
      imageCache.set(barcode, imageUrl);
      return imageUrl;
    }
  } catch (error) {
    console.log(`Failed to fetch image for barcode ${barcode}`);
  }

  // Fallback to placeholder
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
  const uncachedBarcodes = barcodes.filter(b => !imageCache.has(b));
  await Promise.all(uncachedBarcodes.map(b => fetchProductImage(b)));
};
