import { Product, Category } from "@/types/product";

export const tags = [
  { id: "special-offer", name: "Special Offer" },
  { id: "organic", name: "Organic" },
  { id: "new", name: "New" },
  { id: "ambient", name: "Ambient" },
  { id: "chilled", name: "Chilled" },
  { id: "b-corp", name: "B Corp" },
  { id: "vegan", name: "Vegan" },
  { id: "vegetarian", name: "Vegetarian" },
];

// New category hierarchy from cats.txt
export const categories: Category[] = [
  // Level 1: Main categories
  { id: "special-offers", slug: "special-offers", name: "Special Offers", productCount: 0 },
  { id: "featured-products", slug: "featured-products", name: "Featured Products", productCount: 0 },
  { id: "new-products", slug: "new-products", name: "New Products", productCount: 0 },
  { id: "fresh-chilled", slug: "fresh-chilled", name: "Fresh & Chilled", productCount: 120 },
  { id: "meat-fish", slug: "meat-fish", name: "Meat & Fish", productCount: 80 },
  { id: "drinks", slug: "drinks", name: "Drinks", productCount: 150 },
  { id: "bakery", slug: "bakery", name: "Bakery", productCount: 45 },
  { id: "snacking", slug: "snacking", name: "Snacking", productCount: 90 },
  { id: "food-cupboard", slug: "food-cupboard", name: "Food Cupboard", productCount: 200 },
  { id: "baby-child", slug: "baby-child", name: "Baby & Child", productCount: 30 },
  { id: "hygiene-health-pets", slug: "hygiene-health-pets", name: "Hygiene Health & Pets", productCount: 50 },

  // Fresh & Chilled subcategories
  { id: "dairy", slug: "dairy", name: "Dairy", parentId: "fresh-chilled", productCount: 60 },
  { id: "meat-alts-tofu", slug: "meat-alts-tofu", name: "Meat Alts & Tofu", parentId: "fresh-chilled", productCount: 15 },
  { id: "desserts", slug: "desserts", name: "Desserts", parentId: "fresh-chilled", productCount: 20 },
  { id: "salads-olives", slug: "salads-olives", name: "Salads & Olives", parentId: "fresh-chilled", productCount: 15 },
  { id: "pasta-sauces", slug: "pasta-sauces", name: "Pasta & Sauces", parentId: "fresh-chilled", productCount: 10 },
  { id: "soup-broth", slug: "soup-broth", name: "Soup & Broth", parentId: "fresh-chilled", productCount: 8 },
  { id: "dumplings-noodles", slug: "dumplings-noodles", name: "Dumplings & Noodles", parentId: "fresh-chilled", productCount: 12 },
  { id: "ready-meals", slug: "ready-meals", name: "Ready Meals & Meal Kits", parentId: "fresh-chilled", productCount: 18 },

  // Dairy subcategories (Level 3)
  { id: "milk", slug: "milk", name: "Milk", parentId: "dairy", productCount: 12 },
  { id: "butter-margarine-ghee", slug: "butter-margarine-ghee", name: "Butter, Margarine & Ghee", parentId: "dairy", productCount: 15 },
  { id: "cheese", slug: "cheese", name: "Cheese", parentId: "dairy", productCount: 25 },
  { id: "cream", slug: "cream", name: "Cream", parentId: "dairy", productCount: 10 },
  { id: "yoghurt", slug: "yoghurt", name: "Yoghurt", parentId: "dairy", productCount: 15 },
  { id: "kefir", slug: "kefir", name: "Kefir", parentId: "dairy", productCount: 5 },
  { id: "dips", slug: "dips", name: "Dips", parentId: "dairy", productCount: 8 },

  // Butter, Margarine & Ghee subcategories (Level 4)
  { id: "block", slug: "block", name: "Block", parentId: "butter-margarine-ghee", productCount: 5 },
  { id: "spreadable", slug: "spreadable", name: "Spreadable", parentId: "butter-margarine-ghee", productCount: 5 },
  { id: "ghee", slug: "ghee", name: "Ghee", parentId: "butter-margarine-ghee", productCount: 5 },

  // Cheese subcategories (Level 4)
  { id: "cheese-spreadable", slug: "cheese-spreadable", name: "Spreadable", parentId: "cheese", productCount: 3 },
  { id: "greek-cheese", slug: "greek-cheese", name: "Greek", parentId: "cheese", productCount: 4 },
  { id: "cheddar", slug: "cheddar", name: "Cheddar", parentId: "cheese", productCount: 5 },
  { id: "other-european", slug: "other-european", name: "Other European", parentId: "cheese", productCount: 4 },
  { id: "south-asian-cheese", slug: "south-asian-cheese", name: "South Asian", parentId: "cheese", productCount: 3 },
  { id: "french-cheese", slug: "french-cheese", name: "French", parentId: "cheese", productCount: 3 },
  { id: "italian-cheese", slug: "italian-cheese", name: "Italian", parentId: "cheese", productCount: 3 },
  { id: "sliced-grated", slug: "sliced-grated", name: "Sliced & Grated", parentId: "cheese", productCount: 4 },

  // Cream subcategories (Level 4)
  { id: "single-double", slug: "single-double", name: "Single & Double", parentId: "cream", productCount: 3 },
  { id: "sour-cream", slug: "sour-cream", name: "Sour Cream", parentId: "cream", productCount: 2 },
  { id: "creme-fraiche", slug: "creme-fraiche", name: "Creme Fraiche", parentId: "cream", productCount: 2 },
  { id: "spray-cream", slug: "spray-cream", name: "Spray", parentId: "cream", productCount: 1 },
  { id: "clotted-cream", slug: "clotted-cream", name: "Clotted Cream", parentId: "cream", productCount: 1 },
  { id: "whipping-cream", slug: "whipping-cream", name: "Whipping Cream", parentId: "cream", productCount: 2 },

  // Yoghurt subcategories (Level 4)
  { id: "yoghurt-greek", slug: "yoghurt-greek", name: "Greek", parentId: "yoghurt", productCount: 4 },
  { id: "fruit-flavoured", slug: "fruit-flavoured", name: "Fruit & Flavoured", parentId: "yoghurt", productCount: 5 },
  { id: "natural-yoghurt", slug: "natural-yoghurt", name: "Natural", parentId: "yoghurt", productCount: 3 },
  { id: "kids-yoghurt", slug: "kids-yoghurt", name: "Kids", parentId: "yoghurt", productCount: 2 },
  { id: "drinking-yoghurt", slug: "drinking-yoghurt", name: "Drinking", parentId: "yoghurt", productCount: 2 },

  // Pasta & Sauces subcategories (Level 3)
  { id: "fresh-pasta", slug: "fresh-pasta", name: "Fresh Pasta", parentId: "pasta-sauces", productCount: 5 },
  { id: "fresh-sauces", slug: "fresh-sauces", name: "Fresh Sauces", parentId: "pasta-sauces", productCount: 5 },

  // Soup & Broth subcategories
  { id: "broth", slug: "broth", name: "Broth", parentId: "soup-broth", productCount: 4 },

  // Meat & Fish subcategories
  { id: "bacon-pancetta", slug: "bacon-pancetta", name: "Bacon & Pancetta", parentId: "meat-fish", productCount: 12 },
  { id: "sausages-frankfurters", slug: "sausages-frankfurters", name: "Sausages & Frankfurters", parentId: "meat-fish", productCount: 15 },
  { id: "cooked-cured", slug: "cooked-cured", name: "Cooked & Cured", parentId: "meat-fish", productCount: 10 },
  { id: "fish", slug: "fish", name: "Fish", parentId: "meat-fish", productCount: 8 },
  { id: "halal", slug: "halal", name: "Halal", parentId: "meat-fish", productCount: 10 },
  { id: "italian-meat", slug: "italian-meat", name: "Italian", parentId: "meat-fish", productCount: 8 },
  { id: "spanish-meat", slug: "spanish-meat", name: "Spanish", parentId: "meat-fish", productCount: 6 },
  { id: "polish-meat", slug: "polish-meat", name: "Polish", parentId: "meat-fish", productCount: 6 },
  { id: "greek-meat", slug: "greek-meat", name: "Greek", parentId: "meat-fish", productCount: 4 },

  // Bacon & Pancetta subcategories
  { id: "sliced-bacon", slug: "sliced-bacon", name: "Sliced", parentId: "bacon-pancetta", productCount: 6 },
  { id: "diced-bacon", slug: "diced-bacon", name: "Diced", parentId: "bacon-pancetta", productCount: 6 },

  // Sausages & Frankfurters subcategories
  { id: "fresh-sausages", slug: "fresh-sausages", name: "Fresh", parentId: "sausages-frankfurters", productCount: 8 },
  { id: "cured-smoked", slug: "cured-smoked", name: "Cured & Smoked", parentId: "sausages-frankfurters", productCount: 7 },

  // Drinks subcategories
  { id: "beer-wine-spirits", slug: "beer-wine-spirits", name: "Beer Wine & Spirits", parentId: "drinks", productCount: 40 },
  { id: "juice-smoothies-shots", slug: "juice-smoothies-shots", name: "Juice Smoothies & Shots", parentId: "drinks", productCount: 25 },
  { id: "milk-alternatives", slug: "milk-alternatives", name: "Milk & Alternatives", parentId: "drinks", productCount: 20 },
  { id: "soft-drinks-better", slug: "soft-drinks-better", name: "Soft Drinks & Better For You", parentId: "drinks", productCount: 30 },
  { id: "rtd-coffee-tea", slug: "rtd-coffee-tea", name: "RTD Coffee & Tea", parentId: "drinks", productCount: 15 },
  { id: "rtd-meals-protein", slug: "rtd-meals-protein", name: "RTD Meals & Protein", parentId: "drinks", productCount: 10 },
  { id: "water", slug: "water", name: "Water", parentId: "drinks", productCount: 10 },

  // Beer, Wine & Spirits subcategories
  { id: "beer-cider", slug: "beer-cider", name: "Beer & Cider", parentId: "beer-wine-spirits", productCount: 15 },
  { id: "cocktails-rtd", slug: "cocktails-rtd", name: "Cocktails & RTD/Premixed", parentId: "beer-wine-spirits", productCount: 8 },
  { id: "wine", slug: "wine", name: "Wine", parentId: "beer-wine-spirits", productCount: 12 },
  { id: "alcohol-free-drinks", slug: "alcohol-free-drinks", name: "Alcohol Free Drinks", parentId: "beer-wine-spirits", productCount: 5 },

  // Beer & Cider subcategories
  { id: "beer", slug: "beer", name: "Beer", parentId: "beer-cider", productCount: 10 },
  { id: "cider", slug: "cider", name: "Cider", parentId: "beer-cider", productCount: 5 },

  // Wine subcategories
  { id: "red-wine", slug: "red-wine", name: "Red Wine", parentId: "wine", productCount: 4 },
  { id: "champagne-sparkling", slug: "champagne-sparkling", name: "Champagne & Sparkling Wine", parentId: "wine", productCount: 3 },
  { id: "white-wine", slug: "white-wine", name: "White Wine", parentId: "wine", productCount: 3 },
  { id: "rose-wine", slug: "rose-wine", name: "Rose Wine", parentId: "wine", productCount: 2 },
  { id: "orange-wine", slug: "orange-wine", name: "Orange Wine", parentId: "wine", productCount: 1 },

  // Juice, Smoothies & Shots subcategories
  { id: "juice", slug: "juice", name: "Juice", parentId: "juice-smoothies-shots", productCount: 12 },
  { id: "shots", slug: "shots", name: "Shots", parentId: "juice-smoothies-shots", productCount: 5 },
  { id: "smoothies", slug: "smoothies", name: "Smoothies", parentId: "juice-smoothies-shots", productCount: 8 },

  // Milk & Alternatives subcategories
  { id: "drinks-milk", slug: "drinks-milk", name: "Milk", parentId: "milk-alternatives", productCount: 6 },
  { id: "drinks-kefir", slug: "drinks-kefir", name: "Kefir", parentId: "milk-alternatives", productCount: 4 },
  { id: "flavoured-milk", slug: "flavoured-milk", name: "Flavoured", parentId: "milk-alternatives", productCount: 4 },
  { id: "milk-alts", slug: "milk-alts", name: "Milk Alternatives", parentId: "milk-alternatives", productCount: 6 },

  // Soft Drinks & Better For You subcategories
  { id: "classic-soft-drinks", slug: "classic-soft-drinks", name: "Classic Soft Drinks", parentId: "soft-drinks-better", productCount: 8 },
  { id: "iced-tea", slug: "iced-tea", name: "Iced Tea", parentId: "soft-drinks-better", productCount: 4 },
  { id: "kombucha", slug: "kombucha", name: "Kombucha", parentId: "soft-drinks-better", productCount: 5 },
  { id: "prebiotic", slug: "prebiotic", name: "Prebiotic", parentId: "soft-drinks-better", productCount: 4 },
  { id: "cbd", slug: "cbd", name: "CBD", parentId: "soft-drinks-better", productCount: 2 },
  { id: "energy", slug: "energy", name: "Energy", parentId: "soft-drinks-better", productCount: 4 },
  { id: "vitamin-protein", slug: "vitamin-protein", name: "Vitamin & Protein", parentId: "soft-drinks-better", productCount: 3 },

  // RTD Meals & Protein subcategories
  { id: "meal-replacements", slug: "meal-replacements", name: "Meal Replacements", parentId: "rtd-meals-protein", productCount: 5 },
  { id: "protein-shakes", slug: "protein-shakes", name: "Protein Shakes", parentId: "rtd-meals-protein", productCount: 5 },

  // Water subcategories
  { id: "flavoured-water", slug: "flavoured-water", name: "Flavoured", parentId: "water", productCount: 5 },

  // Bakery subcategories
  { id: "bread", slug: "bread", name: "Bread", parentId: "bakery", productCount: 10 },
  { id: "rolls-bagels", slug: "rolls-bagels", name: "Rolls & Bagels", parentId: "bakery", productCount: 6 },
  { id: "baguettes", slug: "baguettes", name: "Baguettes", parentId: "bakery", productCount: 4 },
  { id: "wraps-flatbread", slug: "wraps-flatbread", name: "Wraps & Flatbread", parentId: "bakery", productCount: 5 },
  { id: "pitta", slug: "pitta", name: "Pitta", parentId: "bakery", productCount: 3 },
  { id: "naan", slug: "naan", name: "Naan", parentId: "bakery", productCount: 4 },
  { id: "breakfast", slug: "breakfast", name: "Breakfast", parentId: "bakery", productCount: 6 },
  { id: "brioche", slug: "brioche", name: "Brioche", parentId: "bakery", productCount: 3 },

  // Snacking subcategories
  { id: "chocolate-confectionery", slug: "chocolate-confectionery", name: "Chocolate & Confectionery", parentId: "snacking", productCount: 25 },
  { id: "crisps-savoury", slug: "crisps-savoury", name: "Crisps & Savoury", parentId: "snacking", productCount: 20 },
  { id: "popcorn", slug: "popcorn", name: "Popcorn", parentId: "snacking", productCount: 8 },
  { id: "protein-snacking-bars", slug: "protein-snacking-bars", name: "Protein & Snacking Bars", parentId: "snacking", productCount: 12 },
  { id: "rice-corn-cakes", slug: "rice-corn-cakes", name: "Rice & Corn Cakes", parentId: "snacking", productCount: 6 },
  { id: "dried-fruit", slug: "dried-fruit", name: "Dried Fruit", parentId: "snacking", productCount: 8 },
  { id: "nuts-pulses", slug: "nuts-pulses", name: "Nuts & Pulses", parentId: "snacking", productCount: 10 },
  { id: "meat-snacks", slug: "meat-snacks", name: "Meat Snacks", parentId: "snacking", productCount: 6 },

  // Chocolate & Confectionery subcategories
  { id: "chocolate", slug: "chocolate", name: "Chocolate", parentId: "chocolate-confectionery", productCount: 15 },
  { id: "confectionery", slug: "confectionery", name: "Confectionery", parentId: "chocolate-confectionery", productCount: 8 },
  { id: "chewing-gum", slug: "chewing-gum", name: "Chewing Gum", parentId: "chocolate-confectionery", productCount: 3 },

  // Crisps & Savoury subcategories
  { id: "crisps", slug: "crisps", name: "Crisps", parentId: "crisps-savoury", productCount: 10 },
  { id: "tortillas", slug: "tortillas", name: "Tortillas", parentId: "crisps-savoury", productCount: 5 },
  { id: "pretzel", slug: "pretzel", name: "Pretzel", parentId: "crisps-savoury", productCount: 3 },
  { id: "veg-asian", slug: "veg-asian", name: "Veg & Asian", parentId: "crisps-savoury", productCount: 4 },

  // Food Cupboard subcategories
  { id: "oils-vinegar", slug: "oils-vinegar", name: "Oils & Vinegar", parentId: "food-cupboard", productCount: 25 },
  { id: "pasta-rice-noodles", slug: "pasta-rice-noodles", name: "Pasta Rice & Noodles", parentId: "food-cupboard", productCount: 30 },
  { id: "sauces-pastes", slug: "sauces-pastes", name: "Sauces & Pastes", parentId: "food-cupboard", productCount: 35 },
  { id: "syrup-honey", slug: "syrup-honey", name: "Syrup & Honey", parentId: "food-cupboard", productCount: 12 },
  { id: "table-sauces-condiments", slug: "table-sauces-condiments", name: "Table Sauces Condiments & Dressings", parentId: "food-cupboard", productCount: 20 },
  { id: "fc-ready-meals", slug: "fc-ready-meals", name: "Ready Meals & Meal Kits", parentId: "food-cupboard", productCount: 15 },
  { id: "biscuits-cakes", slug: "biscuits-cakes", name: "Biscuits & Cakes", parentId: "food-cupboard", productCount: 18 },
  { id: "oriental-dry-foods", slug: "oriental-dry-foods", name: "Oriental Dry Foods", parentId: "food-cupboard", productCount: 12 },
  { id: "breakfast-cereals", slug: "breakfast-cereals", name: "Breakfast Cereals", parentId: "food-cupboard", productCount: 15 },
  { id: "crackers-crispbreads", slug: "crackers-crispbreads", name: "Crackers & Crispbreads", parentId: "food-cupboard", productCount: 10 },
  { id: "cooking-baking-ingredients", slug: "cooking-baking-ingredients", name: "Cooking Baking & Ingredients", parentId: "food-cupboard", productCount: 20 },
  { id: "coffee-tea-hot-drinks", slug: "coffee-tea-hot-drinks", name: "Coffee Tea & Hot Drinks", parentId: "food-cupboard", productCount: 25 },
  { id: "fruit-veg-salad-pulses", slug: "fruit-veg-salad-pulses", name: "Fruit Veg Salad & Pulses", parentId: "food-cupboard", productCount: 15 },
  { id: "jam-spreads", slug: "jam-spreads", name: "Jam & Spreads", parentId: "food-cupboard", productCount: 12 },
  { id: "fc-meat-fish-alts", slug: "fc-meat-fish-alts", name: "Meat Fish & Alts", parentId: "food-cupboard", productCount: 10 },

  // Oils & Vinegar subcategories
  { id: "olive-oil", slug: "olive-oil", name: "Olive Oil", parentId: "oils-vinegar", productCount: 6 },
  { id: "sunflower-oil", slug: "sunflower-oil", name: "Sunflower Oil", parentId: "oils-vinegar", productCount: 3 },
  { id: "rapeseed-oil", slug: "rapeseed-oil", name: "Rapeseed Oil", parentId: "oils-vinegar", productCount: 3 },
  { id: "virgin-coconut-oil", slug: "virgin-coconut-oil", name: "Virgin Coconut Oil", parentId: "oils-vinegar", productCount: 2 },
  { id: "toasted-sesame-oil", slug: "toasted-sesame-oil", name: "Toasted Sesame Oil", parentId: "oils-vinegar", productCount: 2 },
  { id: "wine-vinegar", slug: "wine-vinegar", name: "Wine Vinegar", parentId: "oils-vinegar", productCount: 3 },
  { id: "cyder-vinegar", slug: "cyder-vinegar", name: "Cyder Vinegar", parentId: "oils-vinegar", productCount: 2 },
  { id: "balsamic-vinegar", slug: "balsamic-vinegar", name: "Balsamic Vinegar", parentId: "oils-vinegar", productCount: 3 },
  { id: "rice-vinegar", slug: "rice-vinegar", name: "Rice Vinegar", parentId: "oils-vinegar", productCount: 2 },

  // Pasta, Rice & Noodles subcategories
  { id: "rice-pulses", slug: "rice-pulses", name: "Rice & Pulses", parentId: "pasta-rice-noodles", productCount: 10 },
  { id: "noodles", slug: "noodles", name: "Noodles", parentId: "pasta-rice-noodles", productCount: 10 },
  { id: "pasta", slug: "pasta", name: "Pasta", parentId: "pasta-rice-noodles", productCount: 10 },

  // Sauces & Pastes subcategories
  { id: "oriental", slug: "oriental", name: "Oriental", parentId: "sauces-pastes", productCount: 10 },
  { id: "pasta-passata-pesto", slug: "pasta-passata-pesto", name: "Pasta Passata & Pesto", parentId: "sauces-pastes", productCount: 12 },
  { id: "mexican", slug: "mexican", name: "Mexican", parentId: "sauces-pastes", productCount: 5 },
  { id: "south-asia-africa", slug: "south-asia-africa", name: "South Asia to Africa", parentId: "sauces-pastes", productCount: 8 },

  // South Asia to Africa subcategories
  { id: "tahini", slug: "tahini", name: "Tahini", parentId: "south-asia-africa", productCount: 3 },
  { id: "harissa", slug: "harissa", name: "Harissa", parentId: "south-asia-africa", productCount: 3 },

  // Syrup & Honey subcategories
  { id: "honey", slug: "honey", name: "Honey", parentId: "syrup-honey", productCount: 6 },
  { id: "syrup", slug: "syrup", name: "Syrup", parentId: "syrup-honey", productCount: 6 },

  // Cooking, Baking & Ingredients subcategories
  { id: "cooking-ingredients", slug: "cooking-ingredients", name: "Cooking Ingredients", parentId: "cooking-baking-ingredients", productCount: 6 },
  { id: "flour", slug: "flour", name: "Flour", parentId: "cooking-baking-ingredients", productCount: 5 },
  { id: "gravy-stock", slug: "gravy-stock", name: "Gravy & Stock", parentId: "cooking-baking-ingredients", productCount: 5 },
  { id: "fat", slug: "fat", name: "Fat", parentId: "cooking-baking-ingredients", productCount: 4 },

  // Coffee, Tea & Hot Drinks subcategories
  { id: "tea", slug: "tea", name: "Tea", parentId: "coffee-tea-hot-drinks", productCount: 10 },
  { id: "ground-wholebean-coffee", slug: "ground-wholebean-coffee", name: "Ground & Wholebean Coffee", parentId: "coffee-tea-hot-drinks", productCount: 8 },
  { id: "coffee-pods", slug: "coffee-pods", name: "Coffee Pods (Nespresso)", parentId: "coffee-tea-hot-drinks", productCount: 4 },
  { id: "instant-coffee", slug: "instant-coffee", name: "Instant Coffee", parentId: "coffee-tea-hot-drinks", productCount: 4 },

  // Fruit, Veg, Salad & Pulses subcategories
  { id: "antipasti-dips", slug: "antipasti-dips", name: "Antipasti & Dips", parentId: "fruit-veg-salad-pulses", productCount: 8 },
  { id: "coconut-products", slug: "coconut-products", name: "Coconut Products", parentId: "fruit-veg-salad-pulses", productCount: 5 },

  // Jam & Spreads subcategories
  { id: "peanut-nut-butter", slug: "peanut-nut-butter", name: "Peanut & Nut Butter", parentId: "jam-spreads", productCount: 5 },
  { id: "chocolate-spread", slug: "chocolate-spread", name: "Chocolate Spread", parentId: "jam-spreads", productCount: 3 },
  { id: "jam-conserve", slug: "jam-conserve", name: "Jam & Conserve", parentId: "jam-spreads", productCount: 5 },

  // Meat, Fish & Alts subcategories
  { id: "meat-substitutes", slug: "meat-substitutes", name: "Meat Substitutes", parentId: "fc-meat-fish-alts", productCount: 10 },

  // Baby & Child subcategories
  { id: "baby-kids-food", slug: "baby-kids-food", name: "Baby & Kids Food", parentId: "baby-child", productCount: 20 },
  { id: "nappies-hygiene", slug: "nappies-hygiene", name: "Nappies & Hygiene", parentId: "baby-child", productCount: 10 },

  // Hygiene, Health & Pets subcategories
  { id: "cleaning", slug: "cleaning", name: "Cleaning", parentId: "hygiene-health-pets", productCount: 15 },
  { id: "health-wellbeing-beauty", slug: "health-wellbeing-beauty", name: "Health Wellbeing & Beauty", parentId: "hygiene-health-pets", productCount: 20 },
  { id: "pet-food", slug: "pet-food", name: "Pet Food", parentId: "hygiene-health-pets", productCount: 15 },

  // Health, Wellbeing & Beauty subcategories
  { id: "personal-hygiene", slug: "personal-hygiene", name: "Personal Hygiene", parentId: "health-wellbeing-beauty", productCount: 10 },
];

// Empty products array - products now come from newProducts table
export const products: Product[] = [];
