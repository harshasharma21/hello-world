// Helper to get image URL from Supabase storage
const STORAGE_BASE_URL = 'https://xiztfbqekscdtztaoqdo.supabase.co/storage/v1/object/public/product-images';

export const getImageUrl = (filename: string, type: 'product' | 'category' = 'product'): string => {
  const folder = type === 'product' ? 'products' : 'categorys';
  // Add .jpg extension if not present
  const fullFilename = filename.includes('.') ? filename : `${filename}.jpg`;
  return `${STORAGE_BASE_URL}/${folder}/${fullFilename}`;
};

// Product image URLs (keys without extension to match mockData)
export const productImages: Record<string, string> = {
  'product-passata': getImageUrl('product-passata'),
  'product-pesto': getImageUrl('product-pesto'),
  'product-pasta': getImageUrl('product-pasta'),
  'product-orange-juice': getImageUrl('product-orange-juice'),
  'product-water': getImageUrl('product-water'),
  'product-cola': getImageUrl('product-cola'),
  'product-chips': getImageUrl('product-chips'),
};

// Category image URLs
export const categoryImages: Record<string, string> = {
  'category-food-cupboard': getImageUrl('category-food-cupboard.jpg', 'category'),
  'category-beverages': getImageUrl('category-beverages.jpg', 'category'),
  'category-frozen-foods': getImageUrl('category-frozen-foods.jpg', 'category'),
  'category-snacks': getImageUrl('category-snacks.jpg', 'category'),
};
