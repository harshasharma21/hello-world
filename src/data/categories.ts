// Category hierarchy from cats.txt
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children: Category[];
}

// Helper to generate slug from name
const toSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

// Generate unique ID based on path
const generateId = (path: string[]): string => {
  return path.map(toSlug).join("-") || "root";
};

// Raw category tree from cats.txt
const rawCategoryTree = {
  name: "All Products",
  children: [
    {
      name: "Special Offers",
      children: []
    },
    {
      name: "Featured Products",
      children: []
    },
    {
      name: "New Products",
      children: []
    },
    {
      name: "Fresh & Chilled",
      children: [
        {
          name: "Dairy",
          children: [
            { name: "Milk", children: [] },
            {
              name: "Butter, Margarine & Ghee",
              children: [
                { name: "Block", children: [] },
                { name: "Spreadable", children: [] },
                { name: "Ghee", children: [] }
              ]
            },
            {
              name: "Cheese",
              children: [
                { name: "Spreadable", children: [] },
                { name: "Greek", children: [] },
                { name: "Cheddar", children: [] },
                { name: "Other European", children: [] },
                { name: "South Asian", children: [] },
                { name: "French", children: [] },
                { name: "Italian", children: [] },
                { name: "Sliced & Grated", children: [] }
              ]
            },
            {
              name: "Cream",
              children: [
                { name: "Single & Double", children: [] },
                { name: "Sour Cream", children: [] },
                { name: "Creme Fraiche", children: [] },
                { name: "Spray", children: [] },
                { name: "Clotted Cream", children: [] },
                { name: "Whipping Cream", children: [] }
              ]
            },
            {
              name: "Yoghurt",
              children: [
                { name: "Greek", children: [] },
                { name: "Fruit & Flavoured", children: [] },
                { name: "Natural", children: [] },
                { name: "Kids", children: [] },
                { name: "Drinking", children: [] }
              ]
            },
            { name: "Kefir", children: [] },
            { name: "Dips", children: [] }
          ]
        },
        { name: "Meat Alts & Tofu", children: [] },
        { name: "Desserts", children: [] },
        { name: "Salads & Olives", children: [] },
        {
          name: "Pasta & Sauces",
          children: [
            { name: "Fresh Pasta", children: [] },
            { name: "Fresh Sauces", children: [] }
          ]
        },
        {
          name: "Soup & Broth",
          children: [
            { name: "Broth", children: [] }
          ]
        },
        { name: "Dumplings & Noodles", children: [] },
        { name: "Ready Meals & Meal Kits", children: [] }
      ]
    },
    {
      name: "Meat & Fish",
      children: [
        {
          name: "Bacon & Pancetta",
          children: [
            { name: "Sliced", children: [] },
            { name: "Diced", children: [] }
          ]
        },
        {
          name: "Sausages & Frankfurters",
          children: [
            { name: "Fresh", children: [] },
            { name: "Cured & Smoked", children: [] }
          ]
        },
        { name: "Cooked & Cured", children: [] },
        { name: "Fish", children: [] },
        { name: "Halal", children: [] },
        { name: "Italian", children: [] },
        { name: "Spanish", children: [] },
        { name: "Polish", children: [] },
        { name: "Greek", children: [] }
      ]
    },
    {
      name: "Drinks",
      children: [
        {
          name: "Beer, Wine & Spirits",
          children: [
            {
              name: "Beer & Cider",
              children: [
                { name: "Beer", children: [] },
                { name: "Cider", children: [] }
              ]
            },
            { name: "Cocktails & RTD/Premixed", children: [] },
            {
              name: "Wine",
              children: [
                { name: "Red Wine", children: [] },
                { name: "Champagne & Sparkling Wine", children: [] },
                { name: "White Wine", children: [] },
                { name: "Rose Wine", children: [] },
                { name: "Orange Wine", children: [] }
              ]
            },
            { name: "Alcohol Free Drinks", children: [] }
          ]
        },
        {
          name: "Juice, Smoothies & Shots",
          children: [
            { name: "Juice", children: [] },
            { name: "Shots", children: [] },
            { name: "Smoothies", children: [] }
          ]
        },
        {
          name: "Milk & Alternatives",
          children: [
            { name: "Milk", children: [] },
            { name: "Kefir", children: [] },
            { name: "Flavoured", children: [] },
            { name: "Milk Alternatives", children: [] }
          ]
        },
        {
          name: "Soft Drinks & Better For You",
          children: [
            { name: "Classic Soft Drinks", children: [] },
            { name: "Iced Tea", children: [] },
            { name: "Kombucha", children: [] },
            { name: "Prebiotic", children: [] },
            { name: "CBD", children: [] },
            { name: "Energy", children: [] },
            { name: "Vitamin & Protein", children: [] }
          ]
        },
        { name: "RTD Coffee & Tea", children: [] },
        {
          name: "RTD Meals & Protein",
          children: [
            { name: "Meal Replacements", children: [] },
            { name: "Protein Shakes", children: [] }
          ]
        },
        {
          name: "Water",
          children: [
            { name: "Flavoured", children: [] }
          ]
        }
      ]
    },
    {
      name: "Bakery",
      children: [
        { name: "Bread", children: [] },
        { name: "Rolls & Bagels", children: [] },
        { name: "Baguettes", children: [] },
        { name: "Wraps & Flatbread", children: [] },
        { name: "Pitta", children: [] },
        { name: "Naan", children: [] },
        { name: "Breakfast", children: [] },
        { name: "Brioche", children: [] }
      ]
    },
    {
      name: "Snacking",
      children: [
        {
          name: "Chocolate & Confectionery",
          children: [
            { name: "Chocolate", children: [] },
            { name: "Confectionery", children: [] },
            { name: "Chewing Gum", children: [] }
          ]
        },
        {
          name: "Crisps & Savoury",
          children: [
            { name: "Crisps", children: [] },
            { name: "Tortillas", children: [] },
            { name: "Pretzel", children: [] },
            { name: "Veg & Asian", children: [] }
          ]
        },
        { name: "Popcorn", children: [] },
        { name: "Protein & Snacking Bars", children: [] },
        { name: "Rice & Corn Cakes", children: [] },
        { name: "Dried Fruit", children: [] },
        { name: "Nuts & Pulses", children: [] },
        { name: "Meat Snacks", children: [] }
      ]
    },
    {
      name: "Food Cupboard",
      children: [
        {
          name: "Oils & Vinegar",
          children: [
            { name: "Olive Oil", children: [] },
            { name: "Sunflower Oil", children: [] },
            { name: "Rapeseed Oil", children: [] },
            { name: "Virgin Coconut Oil", children: [] },
            { name: "Toasted Sesame Oil", children: [] },
            { name: "Wine Vinegar", children: [] },
            { name: "Cyder Vinegar", children: [] },
            { name: "Balsamic Vinegar", children: [] },
            { name: "Rice Vinegar", children: [] }
          ]
        },
        {
          name: "Pasta, Rice & Noodles",
          children: [
            { name: "Rice & Pulses", children: [] },
            { name: "Noodles", children: [] },
            { name: "Pasta", children: [] }
          ]
        },
        {
          name: "Sauces & Pastes",
          children: [
            { name: "Oriental", children: [] },
            { name: "Pasta, Passata & Pesto", children: [] },
            { name: "Mexican", children: [] },
            {
              name: "South Asia to Africa",
              children: [
                { name: "Tahini", children: [] },
                { name: "Harissa", children: [] }
              ]
            }
          ]
        },
        {
          name: "Syrup & Honey",
          children: [
            { name: "Honey", children: [] },
            { name: "Syrup", children: [] }
          ]
        },
        { name: "Table Sauces, Condiments & Dressings", children: [] },
        { name: "Ready Meals & Meal Kits", children: [] },
        { name: "Biscuits & Cakes", children: [] },
        { name: "Oriental Dry Foods", children: [] },
        { name: "Breakfast Cereals", children: [] },
        { name: "Crackers & Crispbreads", children: [] },
        {
          name: "Cooking, Baking & Ingredients",
          children: [
            { name: "Cooking Ingredients", children: [] },
            { name: "Flour", children: [] },
            { name: "Gravy & Stock", children: [] },
            { name: "Fat", children: [] }
          ]
        },
        {
          name: "Coffee, Tea & Hot Drinks",
          children: [
            { name: "Tea", children: [] },
            { name: "Ground & Wholebean Coffee", children: [] },
            { name: "Coffee Pods (Nespresso)", children: [] },
            { name: "Instant Coffee", children: [] }
          ]
        },
        {
          name: "Fruit, Veg, Salad & Pulses",
          children: [
            { name: "Antipasti & Dips", children: [] },
            { name: "Coconut Products", children: [] }
          ]
        },
        {
          name: "Jam & Spreads",
          children: [
            { name: "Peanut & Nut Butter", children: [] },
            { name: "Chocolate Spread", children: [] },
            { name: "Jam & Conserve", children: [] }
          ]
        },
        {
          name: "Meat, Fish & Alts",
          children: [
            { name: "Meat Substitutes", children: [] }
          ]
        }
      ]
    },
    {
      name: "Baby & Child",
      children: [
        { name: "Baby & Kids Food", children: [] },
        { name: "Nappies & Hygiene", children: [] }
      ]
    },
    {
      name: "Hygiene, Health & Pets",
      children: [
        { name: "Cleaning", children: [] },
        {
          name: "Health, Wellbeing & Beauty",
          children: [
            { name: "Personal Hygiene", children: [] }
          ]
        },
        { name: "Pet Food", children: [] }
      ]
    }
  ]
};

// Flatten tree to array with parent references
interface RawCategory {
  name: string;
  children: RawCategory[];
}

function flattenCategories(
  node: RawCategory,
  parentId: string | null = null,
  path: string[] = []
): Category[] {
  const currentPath = node.name === "All Products" ? [] : [...path, node.name];
  const id = currentPath.length === 0 ? "all-products" : generateId(currentPath);
  const slug = currentPath.length === 0 ? "all-products" : toSlug(node.name);

  const children: Category[] = [];
  const childCategories: Category[] = [];

  for (const child of node.children) {
    const flattened = flattenCategories(child, id, currentPath);
    childCategories.push(...flattened);
    // Find the direct child
    const directChild = flattened.find(c => c.parentId === id);
    if (directChild) {
      children.push(directChild);
    }
  }

  const category: Category = {
    id,
    name: node.name,
    slug,
    parentId,
    children,
  };

  return [category, ...childCategories];
}

// Export flattened categories
export const categories: Category[] = flattenCategories(rawCategoryTree);

// Helper to get category by slug
export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(c => c.slug === slug);
};

// Helper to get category by id
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(c => c.id === id);
};

// Helper to get root categories (direct children of All Products)
export const getRootCategories = (): Category[] => {
  return categories.filter(c => c.parentId === "all-products");
};

// Helper to get all descendant slugs for a category
export const getAllDescendantSlugs = (categoryId: string): string[] => {
  const category = getCategoryById(categoryId);
  if (!category) return [];

  const slugs: string[] = [category.slug];
  
  const collectDescendants = (cat: Category) => {
    for (const child of cat.children) {
      slugs.push(child.slug);
      collectDescendants(child);
    }
  };
  
  collectDescendants(category);
  return slugs;
};

// Helper to get all descendant category names (for matching latestCategories)
export const getAllDescendantNames = (categoryId: string): string[] => {
  const category = getCategoryById(categoryId);
  if (!category) return [];

  const names: string[] = [category.name];
  
  const collectDescendants = (cat: Category) => {
    for (const child of cat.children) {
      names.push(child.name);
      collectDescendants(child);
    }
  };
  
  collectDescendants(category);
  return names;
};

// Helper to build breadcrumb path
export const getCategoryBreadcrumb = (categoryId: string): Category[] => {
  const breadcrumb: Category[] = [];
  let current = getCategoryById(categoryId);
  
  while (current && current.id !== "all-products") {
    breadcrumb.unshift(current);
    current = current.parentId ? getCategoryById(current.parentId) : undefined;
  }
  
  return breadcrumb;
};

// Helper to build URL path for a category
export const buildCategoryPath = (category: Category): string => {
  const breadcrumb = getCategoryBreadcrumb(category.id);
  if (breadcrumb.length === 0) return "/shop";
  return "/shop/" + breadcrumb.map(c => c.slug).join("/");
};

// Get category by matching any level in latestCategories
export const getCategoryByName = (name: string): Category | undefined => {
  if (!name) return undefined;
  const normalizedName = name.trim().toLowerCase();
  return categories.find(c => c.name.toLowerCase() === normalizedName);
};

// Map from category level columns to slugs for product filtering
export type CategoryLevels = {
  level1: string | null;
  level2: string | null;
  level3: string | null;
  level4: string | null;
};

// Check if a product belongs to a category based on its category levels
export const productBelongsToCategory = (
  levels: CategoryLevels,
  categoryName: string
): boolean => {
  const normalizedCategoryName = categoryName.trim().toLowerCase();
  
  return [levels.level1, levels.level2, levels.level3, levels.level4]
    .filter(Boolean)
    .some(level => level!.trim().toLowerCase() === normalizedCategoryName);
};
