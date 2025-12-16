import { categories } from "@/data/mockData";

// Mapping from database GroupCode to mockData category slugs
// Based on actual database values: GENERAL, GROCERY, DAIRY, CHOCOLATE & SWEETS, 
// COFFEE & TEA, SOFT DRINKS, CILLED, CRISP&NUTS&SNACK, BAKERY, SAUCE, DAIRY FOOD,
// HOUSEHOLD, TEA & COFFEE, HOUSEHOLD & HEALTH & BEAUTY, SNACKS, BABY PRODUCTS, 
// FROZEN, PET FOODS, BABY FOOD, FRUIT & VEG, ALCOHOLIC DRINKS, VEGETABLE, etc.
export const groupCodeToCategorySlug: Record<string, string> = {
  // Food Cupboard - general groceries
  "GENERAL": "food-cupboard",
  "GROCERY": "food-cupboard",
  "FROZEN": "food-cupboard",
  
  // Drinks
  "SOFT DRINKS": "soft-drinks-better",
  "ALCOHOLIC DRINKS": "drinks",
  "ALCHOHOL DRINKS": "drinks",
  
  // Hot Drinks
  "TEA & COFFEE": "coffee-tea-hot-drinks",
  "COFFEE & TEA": "coffee-tea-hot-drinks",
  
  // Snacks
  "SNACKS": "crisps-savoury",
  "CRISP&NUTS&SNACK": "crisps-savoury",
  
  // Confectionery
  "CHOCOLATE & SWEETS": "chocolate-confectionery",
  
  // Dairy
  "DAIRY": "dairy",
  "DAIRY FOOD": "dairy",
  "CILLED": "dairy", // Chilled items
  
  // Bakery
  "BAKERY": "bakery",
  
  // Fresh
  "FRUIT & VEG": "fruit-veg-salad-pulses",
  "FRUIT": "fruit-veg-salad-pulses",
  "VEGETABLE": "fruit-veg-salad-pulses",
  
  // Sauces & Condiments
  "SAUCE": "table-sauces-condiments",
  "SAUCES": "sauces-pastes",
  "CONDIMENTS": "table-sauces-condiments",
  
  // Baby
  "BABY PRODUCTS": "baby-child",
  "BABY FOOD": "baby-child",
  "BABY": "baby-child",
  
  // Health & Household
  "HOUSEHOLD": "hygiene-health-pets",
  "HOUSEHOLD & HEALTH & BEAUTY": "hygiene-health-pets",
  "HEALTH": "hygiene-health-pets",
  "MEDICINE": "hygiene-health-pets",
  
  // Pets
  "PET FOODS": "hygiene-health-pets",
  
  // Other
  "CIGARETTES & TOBACCO": "food-cupboard",
};

// Reverse mapping: category slug to all matching GroupCodes
export const categorySlugToGroupCodes: Record<string, string[]> = {
  "food-cupboard": ["GENERAL", "GROCERY", "FROZEN", "CIGARETTES & TOBACCO"],
  "soft-drinks-better": ["SOFT DRINKS"],
  "drinks": ["SOFT DRINKS", "ALCOHOLIC DRINKS", "ALCHOHOL DRINKS"],
  "coffee-tea-hot-drinks": ["TEA & COFFEE", "COFFEE & TEA"],
  "crisps-savoury": ["SNACKS", "CRISP&NUTS&SNACK"],
  "snacking": ["SNACKS", "CRISP&NUTS&SNACK", "CHOCOLATE & SWEETS"],
  "chocolate-confectionery": ["CHOCOLATE & SWEETS"],
  "dairy": ["DAIRY", "DAIRY FOOD", "CILLED"],
  "bakery": ["BAKERY"],
  "fruit-veg-salad-pulses": ["FRUIT & VEG", "FRUIT", "VEGETABLE"],
  "table-sauces-condiments": ["SAUCE", "CONDIMENTS"],
  "sauces-pastes": ["SAUCES", "SAUCE"],
  "baby-child": ["BABY PRODUCTS", "BABY FOOD", "BABY"],
  "hygiene-health-pets": ["HOUSEHOLD", "HOUSEHOLD & HEALTH & BEAUTY", "HEALTH", "MEDICINE", "PET FOODS"],
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
