// Keyword-based product categorization
// Products are categorized by matching keywords in their names

const categoryKeywords: Record<string, string[]> = {
  // Soft Drinks
  "soft-drinks-better": [
    "cola", "pepsi", "fanta", "sprite", "7up", "7-up", "mirinda", "tango", 
    "lucozade", "ribena", "vimto", "irn bru", "dr pepper", "mountain dew",
    "lemonade", "orangeade", "squash", "cordial", "juice", "water", "mineral",
    "sparkling", "still water", "energy drink", "red bull", "monster", "relentless",
    "fizzy", "soda", "pop", "soft drink", "fruit shoot", "capri sun", "oasis",
    "j2o", "appletiser", "schweppes", "barr", "um bongo", "rubicon", "ting",
    "ginger beer", "ginger ale", "tonic", "bitter lemon", "elderflower"
  ],
  
  // Alcoholic Drinks
  "drinks": [
    "beer", "lager", "ale", "cider", "wine", "vodka", "whisky", "whiskey",
    "gin", "rum", "brandy", "cognac", "champagne", "prosecco", "sherry",
    "port", "vermouth", "liqueur", "absinthe", "tequila", "bourbon",
    "stella", "heineken", "budweiser", "corona", "carling", "fosters",
    "strongbow", "magners", "kopparberg", "smirnoff", "absolut", "gordons"
  ],
  
  // Coffee & Tea
  "coffee-tea-hot-drinks": [
    "coffee", "tea", "nescafe", "kenco", "douwe egberts", "lavazza",
    "espresso", "cappuccino", "latte", "mocha", "americano", "instant coffee",
    "ground coffee", "coffee beans", "decaf", "tetley", "pg tips", "twinings",
    "yorkshire tea", "green tea", "herbal tea", "chai", "earl grey", "english breakfast",
    "hot chocolate", "cocoa", "horlicks", "ovaltine", "milo", "drinking chocolate",
    "coffee mate", "creamer"
  ],
  
  // Crisps & Savoury Snacks
  "crisps-savoury": [
    "crisps", "chips", "doritos", "pringles", "walkers", "lays", "kettle",
    "sensations", "mccoys", "monster munch", "wotsits", "quavers", "skips",
    "hula hoops", "french fries", "nik naks", "twiglets", "mini cheddars",
    "popcorn", "pretzels", "crackers", "rice cakes", "breadsticks",
    "nuts", "peanuts", "cashews", "almonds", "pistachios", "mixed nuts",
    "bombay mix", "tortilla chips", "nachos", "popchips", "kettle chips"
  ],
  
  // Chocolate & Confectionery
  "chocolate-confectionery": [
    "chocolate", "cadbury", "dairy milk", "galaxy", "mars", "snickers", "twix",
    "kit kat", "kitkat", "bounty", "milky way", "maltesers", "m&ms", "smarties",
    "aero", "wispa", "crunchie", "double decker", "boost", "picnic", "turkish delight",
    "ferrero", "rocher", "lindt", "toblerone", "kinder", "nutella",
    "sweets", "candy", "haribo", "starburst", "skittles", "fruit pastilles",
    "wine gums", "jelly babies", "liquorice", "fudge", "toffee", "caramel",
    "lollipop", "chewing gum", "mints", "polo", "tic tac", "mentos",
    "trebor", "extra", "airwaves", "wrigley", "hubba bubba", "fruit gums"
  ],
  
  // Dairy
  "dairy": [
    "milk", "cheese", "yogurt", "yoghurt", "butter", "cream", "margarine",
    "cheddar", "mozzarella", "parmesan", "brie", "camembert", "stilton",
    "cottage cheese", "cream cheese", "philadelphia", "lurpak", "anchor",
    "flora", "clover", "bertolli", "cravendale", "semi skimmed", "skimmed",
    "whole milk", "oat milk", "almond milk", "soya milk", "coconut milk",
    "single cream", "double cream", "whipping cream", "sour cream", "creme fraiche",
    "muller", "activia", "danone", "yakult", "actimel", "petit filous"
  ],
  
  // Bakery
  "bakery": [
    "bread", "loaf", "rolls", "baguette", "croissant", "pastry", "cake",
    "muffin", "cupcake", "donut", "doughnut", "scone", "crumpet", "bagel",
    "wrap", "tortilla", "pitta", "naan", "chapati", "flatbread", "focaccia",
    "sourdough", "wholemeal", "white bread", "brown bread", "seeded",
    "biscuits", "cookies", "digestive", "hobnob", "rich tea", "bourbon",
    "custard cream", "oreo", "mcvities", "jaffa cakes", "shortbread",
    "wafer", "biscotti", "brownie", "flapjack", "cereal bar"
  ],
  
  // Fruit, Veg & Salad
  "fruit-veg-salad-pulses": [
    "apple", "banana", "orange", "grape", "strawberry", "raspberry", "blueberry",
    "mango", "pineapple", "melon", "watermelon", "kiwi", "pear", "peach",
    "plum", "cherry", "lemon", "lime", "grapefruit", "avocado", "coconut",
    "carrot", "potato", "tomato", "onion", "garlic", "pepper", "cucumber",
    "lettuce", "spinach", "broccoli", "cauliflower", "cabbage", "celery",
    "mushroom", "courgette", "aubergine", "sweetcorn", "peas", "beans",
    "lentils", "chickpeas", "kidney beans", "baked beans", "salad", "coleslaw",
    "hummus", "guacamole", "dried fruit", "raisins", "sultanas", "dates", "figs"
  ],
  
  // Sauces & Condiments
  "table-sauces-condiments": [
    "ketchup", "mayonnaise", "mayo", "mustard", "relish", "pickle", "chutney",
    "brown sauce", "hp sauce", "worcestershire", "soy sauce", "vinegar",
    "salad cream", "dressing", "bbq sauce", "hot sauce", "tabasco", "sriracha",
    "heinz", "hellmanns", "hellmann's", "french's", "colmans", "branston"
  ],
  
  // Cooking Sauces & Pastes
  "sauces-pastes": [
    "pasta sauce", "curry sauce", "stir fry sauce", "cooking sauce",
    "pesto", "tomato puree", "passata", "chopped tomatoes", "dolmio",
    "ragu", "loyd grossman", "uncle bens", "pataks", "sharwoods",
    "tikka masala", "korma", "madras", "jalfrezi", "balti", "thai curry",
    "oyster sauce", "fish sauce", "hoisin", "teriyaki", "sweet chilli"
  ],
  
  // Baby & Child
  "baby-child": [
    "baby", "infant", "toddler", "nappy", "nappies", "diaper", "pampers",
    "huggies", "pull ups", "baby wipes", "sudocrem", "baby food", "formula",
    "aptamil", "cow & gate", "sma", "hipp", "ella's kitchen", "organix",
    "baby milk", "follow on", "growing up milk", "rusks", "baby rice",
    "baby cereal", "baby snacks", "baby juice", "gripe water", "calpol",
    "baby powder", "baby oil", "baby lotion", "baby shampoo", "baby bath"
  ],
  
  // Health, Hygiene & Pets
  "hygiene-health-pets": [
    "soap", "shampoo", "conditioner", "shower gel", "body wash", "bath",
    "toothpaste", "toothbrush", "mouthwash", "dental", "floss", "colgate",
    "oral b", "sensodyne", "aquafresh", "listerine",
    "deodorant", "antiperspirant", "roll on", "spray", "sure", "dove", "lynx",
    "razor", "shaving", "gillette", "wilkinson",
    "toilet paper", "toilet roll", "tissues", "kitchen roll", "andrex", "cushelle",
    "detergent", "washing powder", "fabric softener", "laundry", "persil", "ariel",
    "bold", "comfort", "lenor", "fairy", "washing up liquid",
    "bleach", "disinfectant", "cleaner", "dettol", "flash", "mr muscle",
    "air freshener", "febreze", "glade", "plug in",
    "pet food", "dog food", "cat food", "pedigree", "whiskas", "felix",
    "iams", "purina", "cesar", "dreamies", "cat litter", "pet treats",
    "vitamins", "supplements", "paracetamol", "ibuprofen", "plasters", "bandage",
    "medicine", "cold", "flu", "cough", "throat", "pain relief", "antihistamine"
  ],
  
  // Food Cupboard (general/fallback items that are clearly food)
  "food-cupboard": [
    "rice", "pasta", "noodles", "spaghetti", "penne", "fusilli", "macaroni",
    "cereal", "porridge", "oats", "muesli", "granola", "weetabix", "cornflakes",
    "shreddies", "cheerios", "coco pops", "frosties", "special k", "bran flakes",
    "soup", "heinz soup", "cup a soup", "instant noodles", "pot noodle",
    "canned", "tinned", "tuna", "salmon", "sardines", "mackerel", "spam",
    "corned beef", "ham", "chicken", "beef", "pork", "lamb", "turkey",
    "sausage", "bacon", "hot dog", "burger", "meatballs",
    "flour", "sugar", "salt", "pepper", "spices", "herbs", "stock", "gravy",
    "oil", "olive oil", "vegetable oil", "sunflower oil", "coconut oil",
    "honey", "jam", "marmalade", "peanut butter", "marmite", "spread",
    "syrup", "golden syrup", "treacle", "maple syrup",
    "custard", "jelly", "blancmange", "angel delight",
    "baking", "yeast", "baking powder", "bicarbonate", "vanilla", "food colouring",
    "icing", "marzipan", "sprinkles", "cake mix", "brownie mix",
    "frozen", "ice cream", "fish fingers", "chicken nuggets", "pizza", "chips",
    "ready meal", "microwave", "frozen veg", "frozen fruit"
  ]
};

// Get category for a product based on its name
export const categorizeProduct = (productName: string): string => {
  const nameLower = productName.toLowerCase();
  
  // Check each category's keywords
  for (const [categorySlug, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword.toLowerCase())) {
        return categorySlug;
      }
    }
  }
  
  // Default to food-cupboard if no match
  return "food-cupboard";
};

// Check if a product belongs to a specific category (including parent categories)
export const productBelongsToCategory = (productName: string, categorySlug: string): boolean => {
  const productCategory = categorizeProduct(productName);
  
  // Direct match
  if (productCategory === categorySlug) {
    return true;
  }
  
  // Parent category mappings
  const parentMappings: Record<string, string[]> = {
    "snacking": ["crisps-savoury", "chocolate-confectionery"],
    "drinks": ["soft-drinks-better", "coffee-tea-hot-drinks"],
    "food-cupboard": ["sauces-pastes", "table-sauces-condiments"],
  };
  
  // Check if product's category is a child of the requested category
  if (parentMappings[categorySlug]?.includes(productCategory)) {
    return true;
  }
  
  return false;
};

// Get all products that belong to a category
export const filterProductsByCategory = <T extends { name: string }>(
  products: T[],
  categorySlug: string
): T[] => {
  return products.filter(product => productBelongsToCategory(product.name, categorySlug));
};
