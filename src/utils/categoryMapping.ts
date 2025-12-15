import { categories } from "@/data/mockData";

// Mapping from CSV GroupCode to mockData category slugs
export const groupCodeToCategorySlug: Record<string, string> = {
  "FRUIT & VEG": "fruit-veg-salad-pulses",
  "GROCERY": "food-cupboard",
  "SOFT DRINKS": "soft-drinks-better",
  "GENERAL": "food-cupboard",
  "SNACKS": "crisps-savoury",
  "TEA & COFFEE": "coffee-tea-hot-drinks",
  "COFFEE & TEA": "coffee-tea-hot-drinks",
  "CHOCOLATE & SWEETS": "chocolate-confectionery",
  "DAIRY": "dairy",
  "BAKERY": "bakery",
  "DRINKS": "drinks",
  "FROZEN": "food-cupboard",
  "MEAT & FISH": "meat-fish",
  "CONDIMENTS": "table-sauces-condiments",
  "OILS": "oils-vinegar",
  "PASTA": "pasta-rice-noodles",
  "SAUCES": "sauces-pastes",
  "HONEY": "syrup-honey",
  "CEREALS": "breakfast-cereals",
  "BABY": "baby-child",
  "HEALTH": "hygiene-health-pets",
};

// Get category slug from group code
export const getCategorySlugFromGroupCode = (groupCode: string | null): string | null => {
  if (!groupCode) return null;
  const normalized = groupCode.trim().toUpperCase();
  return groupCodeToCategorySlug[normalized] || null;
};

// Get category by slug
export const getCategoryBySlug = (slug: string) => {
  return categories.find(c => c.slug === slug);
};

// Get category by ID
export const getCategoryById = (id: string) => {
  return categories.find(c => c.id === id);
};

// Build full category path from slug
export const buildCategoryPath = (categorySlug: string): string => {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return "/shop";

  const chain: string[] = [];
  let current = category;

  while (current) {
    chain.unshift(current.slug);
    if (current.parentId) {
      current = getCategoryById(current.parentId);
    } else {
      break;
    }
  }

  return `/shop/${chain.join("/")}`;
};

// Build product path with full category hierarchy
export const buildProductPath = (productId: string, categorySlug: string | null): string => {
  if (!categorySlug) {
    return `/shop/product/${productId}`;
  }
  
  const categoryPath = buildCategoryPath(categorySlug);
  return `${categoryPath}/product/${productId}`;
};

// Get all descendant category slugs for filtering
export const getAllDescendantSlugs = (categoryId: string): string[] => {
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return [];

  const slugs = [cat.slug];
  const children = categories.filter(c => c.parentId === categoryId);

  children.forEach(child => {
    slugs.push(...getAllDescendantSlugs(child.id));
  });

  return slugs;
};

// Get subcategories
export const getSubcategories = (parentId: string) => {
  return categories.filter(cat => cat.parentId === parentId);
};

// Get root categories (no parent)
export const getRootCategories = () => {
  return categories.filter(cat => !cat.parentId);
};
