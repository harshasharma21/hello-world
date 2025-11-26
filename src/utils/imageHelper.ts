// Helper to get image URL from Supabase storage
const STORAGE_BASE_URL = 'https://xiztfbqekscdtztaoqdo.supabase.co/storage/v1/object/public/product-images';

export const getImageUrl = (filename: string, type: 'product' | 'category' = 'product'): string => {
  const folder = type === 'product' ? 'products' : 'categorys';
  return `${STORAGE_BASE_URL}/${folder}/${filename}`;
};

// Product image URLs
export const productImages: Record<string, string> = {
  'product-passata.jpg': getImageUrl('product-passata.jpg'),
  'product-pesto.jpg': getImageUrl('product-pesto.jpg'),
  'product-pasta.jpg': getImageUrl('product-pasta.jpg'),
  'product-orange-juice.jpg': getImageUrl('product-orange-juice.jpg'),
  'product-water.jpg': getImageUrl('product-water.jpg'),
  'product-cola.jpg': getImageUrl('product-cola.jpg'),
  'product-chips.jpg': getImageUrl('product-chips.jpg'),
};

// Category image URLs
export const categoryImages: Record<string, string> = {
  'category-food-cupboard': getImageUrl('category-food-cupboard.jpg', 'category'),
  'category-beverages': getImageUrl('category-beverages.jpg', 'category'),
  'category-frozen-foods': getImageUrl('category-frozen-foods.jpg', 'category'),
  'category-snacks': getImageUrl('category-snacks.jpg', 'category'),
};
