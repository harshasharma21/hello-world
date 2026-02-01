// Keyword-based product categorization with subcategory support
// Products are categorized to the most specific matching subcategory

// Maps keywords to the most specific category slug
// Order matters - more specific categories should come first
const categoryKeywords: { slug: string; keywords: string[] }[] = [
  // ===== CHEESE SUBCATEGORIES (most specific first) =====
  { slug: "cheddar", keywords: ["cheddar", "mature cheese", "mild cheese", "vintage cheese"] },
  { slug: "cheese-spreadable", keywords: ["cream cheese", "philadelphia", "cheese spread", "spreadable cheese"] },
  { slug: "greek-cheese", keywords: ["feta", "halloumi"] },
  { slug: "italian-cheese", keywords: ["mozzarella", "parmesan", "parmigiano", "pecorino", "gorgonzola", "mascarpone", "ricotta", "provolone"] },
  { slug: "french-cheese", keywords: ["brie", "camembert", "roquefort", "comte", "gruyere"] },
  { slug: "south-asian-cheese", keywords: ["paneer", "labneh"] },
  { slug: "sliced-grated", keywords: ["sliced cheese", "grated cheese", "cheese slices", "shredded cheese"] },
  { slug: "other-european", keywords: ["gouda", "edam", "emmental", "swiss cheese", "manchego", "stilton"] },
  { slug: "cheese", keywords: ["cheese", "cottage cheese"] },

  // ===== DAIRY SUBCATEGORIES =====
  { slug: "butter-margarine-ghee", keywords: ["butter", "margarine", "ghee", "lurpak", "anchor butter", "flora", "clover", "bertolli"] },
  { slug: "yoghurt-greek", keywords: ["greek yogurt", "greek yoghurt", "greek style"] },
  { slug: "fruit-flavoured", keywords: ["fruit yogurt", "fruit yoghurt", "flavoured yogurt", "strawberry yogurt", "muller corner"] },
  { slug: "natural-yoghurt", keywords: ["natural yogurt", "natural yoghurt", "plain yogurt"] },
  { slug: "kids-yoghurt", keywords: ["petit filous", "kids yogurt", "fromage frais"] },
  { slug: "drinking-yoghurt", keywords: ["drinking yogurt", "yogurt drink", "actimel", "yakult"] },
  { slug: "yoghurt", keywords: ["yogurt", "yoghurt", "muller", "activia", "danone"] },
  { slug: "single-double", keywords: ["single cream", "double cream", "extra thick"] },
  { slug: "sour-cream", keywords: ["sour cream", "soured cream"] },
  { slug: "creme-fraiche", keywords: ["creme fraiche", "crème fraîche"] },
  { slug: "whipping-cream", keywords: ["whipping cream", "whipped cream"] },
  { slug: "clotted-cream", keywords: ["clotted cream"] },
  { slug: "cream", keywords: ["cream"] },
  { slug: "kefir", keywords: ["kefir"] },
  { slug: "dips", keywords: ["hummus", "guacamole", "tzatziki", "dip"] },
  { slug: "milk", keywords: ["milk", "semi skimmed", "skimmed milk", "whole milk", "cravendale"] },
  { slug: "dairy", keywords: ["dairy"] },

  // ===== DRINKS SUBCATEGORIES =====
  { slug: "beer", keywords: ["beer", "lager", "ale", "stout", "ipa", "pilsner", "heineken", "budweiser", "corona", "stella", "carling", "fosters", "peroni"] },
  { slug: "cider", keywords: ["cider", "strongbow", "magners", "kopparberg", "rekorderlig", "thatchers"] },
  { slug: "red-wine", keywords: ["red wine", "merlot", "cabernet", "pinot noir", "shiraz", "rioja"] },
  { slug: "white-wine", keywords: ["white wine", "chardonnay", "sauvignon blanc", "pinot grigio", "riesling"] },
  { slug: "rose-wine", keywords: ["rose wine", "rosé", "blush wine"] },
  { slug: "champagne-sparkling", keywords: ["champagne", "prosecco", "sparkling wine", "cava", "fizz"] },
  { slug: "wine", keywords: ["wine"] },
  { slug: "alcohol-free-beer", keywords: ["alcohol free beer", "non alcoholic beer", "0% beer", "low alcohol"] },
  { slug: "alcohol-free-drinks", keywords: ["alcohol free", "non alcoholic", "mocktail", "0%"] },
  { slug: "beer-wine-spirits", keywords: ["vodka", "whisky", "whiskey", "gin", "rum", "brandy", "cognac", "tequila", "liqueur", "bourbon", "smirnoff", "absolut", "gordons", "bacardi", "captain morgan"] },
  
  { slug: "juice", keywords: ["juice", "orange juice", "apple juice", "cranberry", "tropicana", "innocent juice"] },
  { slug: "smoothies", keywords: ["smoothie", "innocent smoothie", "naked juice"] },
  { slug: "shots", keywords: ["ginger shot", "wellness shot", "turmeric shot"] },
  
  { slug: "drinks-milk", keywords: ["fresh milk", "whole milk", "semi-skimmed"] },
  { slug: "drinks-kefir", keywords: ["kefir drink", "milk kefir"] },
  { slug: "flavoured-milk", keywords: ["chocolate milk", "strawberry milk", "flavoured milk", "milkshake", "frijj", "yazoo"] },
  { slug: "milk-alts", keywords: ["oat milk", "almond milk", "soya milk", "coconut milk", "oatly", "alpro"] },
  
  { slug: "classic-soft-drinks", keywords: ["cola", "pepsi", "coca cola", "fanta", "sprite", "7up", "7-up", "mirinda", "tango", "dr pepper", "mountain dew", "lemonade", "orangeade", "irn bru", "barr"] },
  { slug: "iced-tea", keywords: ["iced tea", "ice tea", "lipton"] },
  { slug: "kombucha", keywords: ["kombucha", "live soda"] },
  { slug: "prebiotic", keywords: ["prebiotic", "poppi", "olipop"] },
  { slug: "energy", keywords: ["energy drink", "red bull", "monster energy", "relentless", "lucozade", "boost energy"] },
  { slug: "vitamin-protein", keywords: ["vitamin water", "protein water"] },
  { slug: "soft-drinks-better", keywords: ["soft drink", "fizzy", "soda", "pop", "squash", "cordial", "ribena", "vimto", "robinson", "j2o", "appletiser", "schweppes", "tonic", "ginger beer", "ginger ale", "elderflower", "fruit shoot", "capri sun", "oasis", "um bongo", "rubicon", "ting"] },
  
  { slug: "flavoured-water", keywords: ["flavoured water", "vitamin water", "sparkling water"] },
  { slug: "water", keywords: ["water", "mineral water", "still water", "evian", "volvic", "buxton", "highland spring"] },
  
  { slug: "rtd-coffee-tea", keywords: ["iced coffee", "cold brew", "starbucks", "costa coffee"] },
  { slug: "meal-replacements", keywords: ["meal replacement", "huel", "soylent"] },
  { slug: "protein-shakes", keywords: ["protein shake", "protein drink", "whey drink"] },

  // ===== BAKERY SUBCATEGORIES =====
  { slug: "bread", keywords: ["bread", "loaf", "wholemeal bread", "white bread", "brown bread", "sourdough", "seeded bread", "rye bread", "warburtons", "hovis", "kingsmill", "ciabatta"] },
  { slug: "rolls-bagels", keywords: ["roll", "bap", "bun", "bagel", "brioche bun"] },
  { slug: "baguettes", keywords: ["baguette", "french stick"] },
  { slug: "wraps-flatbread", keywords: ["wrap", "tortilla wrap", "flatbread", "focaccia"] },
  { slug: "pitta", keywords: ["pitta", "pita"] },
  { slug: "naan", keywords: ["naan", "naan bread", "garlic naan", "peshwari"] },
  { slug: "breakfast", keywords: ["crumpet", "muffin", "english muffin", "pancake", "waffle", "croissant", "pain au chocolat"] },
  { slug: "brioche", keywords: ["brioche"] },
  { slug: "bakery", keywords: ["pastry", "scone", "donut", "doughnut", "cake"] },

  // ===== SNACKING SUBCATEGORIES =====
  { slug: "chocolate", keywords: ["chocolate", "cadbury", "dairy milk", "galaxy", "mars", "snickers", "twix", "kit kat", "kitkat", "bounty", "milky way", "maltesers", "m&ms", "smarties", "aero", "wispa", "crunchie", "double decker", "boost", "picnic", "turkish delight", "ferrero", "rocher", "lindt", "toblerone", "kinder", "milka"] },
  { slug: "confectionery", keywords: ["sweets", "candy", "haribo", "starburst", "skittles", "fruit pastilles", "wine gums", "jelly babies", "liquorice", "fudge", "toffee", "caramel", "lollipop", "fruit gums", "trebor", "polo", "mints"] },
  { slug: "chewing-gum", keywords: ["chewing gum", "gum", "extra gum", "airwaves", "wrigley", "hubba bubba", "tic tac", "mentos"] },
  { slug: "chocolate-confectionery", keywords: ["nutella"] },
  
  { slug: "crisps", keywords: ["crisps", "chips", "walkers", "lays", "kettle chips", "sensations", "mccoys", "monster munch", "wotsits", "quavers", "skips", "hula hoops", "french fries", "nik naks", "twiglets", "mini cheddars", "pringles", "popchips", "tyrrell"] },
  { slug: "tortillas", keywords: ["doritos", "tortilla chips", "nachos", "corn chips"] },
  { slug: "pretzel", keywords: ["pretzel", "pretzels"] },
  { slug: "veg-asian", keywords: ["prawn crackers", "pappadum", "papadum", "seaweed snack"] },
  { slug: "crisps-savoury", keywords: ["savoury snack"] },
  
  { slug: "popcorn", keywords: ["popcorn", "butterkist", "propercorn", "metcalfe"] },
  { slug: "protein-snacking-bars", keywords: ["protein bar", "energy bar", "cereal bar", "flapjack", "nakd", "trek", "grenade", "kind bar", "clif bar"] },
  { slug: "rice-corn-cakes", keywords: ["rice cake", "corn cake", "rice cracker"] },
  { slug: "dried-fruit", keywords: ["dried fruit", "raisins", "sultanas", "dates", "figs", "apricots dried", "cranberries dried", "mango dried"] },
  { slug: "nuts-pulses", keywords: ["nuts", "peanuts", "cashews", "almonds", "pistachios", "mixed nuts", "walnuts", "hazelnuts", "macadamia", "brazil nuts", "nut mix"] },
  { slug: "meat-snacks", keywords: ["jerky", "beef jerky", "biltong", "pepperami", "peperami", "meat stick"] },

  // ===== FOOD CUPBOARD SUBCATEGORIES =====
  { slug: "olive-oil", keywords: ["olive oil", "extra virgin olive"] },
  { slug: "sunflower-oil", keywords: ["sunflower oil"] },
  { slug: "rapeseed-oil", keywords: ["rapeseed oil"] },
  { slug: "virgin-coconut-oil", keywords: ["coconut oil"] },
  { slug: "toasted-sesame-oil", keywords: ["sesame oil"] },
  { slug: "balsamic-vinegar", keywords: ["balsamic vinegar", "balsamic"] },
  { slug: "wine-vinegar", keywords: ["wine vinegar", "red wine vinegar", "white wine vinegar"] },
  { slug: "cyder-vinegar", keywords: ["cider vinegar", "apple cider vinegar"] },
  { slug: "rice-vinegar", keywords: ["rice vinegar"] },
  { slug: "oils-vinegar", keywords: ["oil", "vinegar", "vegetable oil", "cooking oil"] },

  { slug: "rice-pulses", keywords: ["rice", "basmati", "jasmine rice", "long grain", "risotto rice", "arborio", "wild rice", "lentils", "chickpeas", "kidney beans", "black beans", "cannellini", "borlotti", "pulses"] },
  { slug: "noodles", keywords: ["noodle", "ramen", "udon", "soba", "rice noodle", "egg noodle", "instant noodle", "pot noodle", "super noodles"] },
  { slug: "pasta", keywords: ["pasta", "spaghetti", "penne", "fusilli", "macaroni", "tagliatelle", "linguine", "farfalle", "rigatoni", "lasagne", "orzo", "gnocchi"] },
  
  { slug: "oriental", keywords: ["soy sauce", "teriyaki", "hoisin", "oyster sauce", "fish sauce", "sriracha", "sweet chilli", "thai", "chinese sauce", "stir fry sauce", "black bean sauce", "plum sauce"] },
  { slug: "pasta-passata-pesto", keywords: ["passata", "pesto", "tomato puree", "chopped tomatoes", "pasta sauce", "bolognese", "arrabbiata", "napoli", "dolmio", "loyd grossman"] },
  { slug: "mexican", keywords: ["salsa", "taco", "fajita", "enchilada", "burrito", "mexican", "old el paso", "chipotle"] },
  { slug: "tahini", keywords: ["tahini"] },
  { slug: "harissa", keywords: ["harissa"] },
  { slug: "south-asia-africa", keywords: ["curry paste", "tikka", "korma", "madras", "jalfrezi", "balti", "rogan josh", "pataks", "sharwoods", "massaman", "rendang", "tandoori"] },
  { slug: "sauces-pastes", keywords: ["sauce", "paste", "cooking sauce", "simmer sauce"] },
  
  { slug: "honey", keywords: ["honey", "manuka", "acacia honey", "runny honey", "set honey"] },
  { slug: "syrup", keywords: ["syrup", "golden syrup", "maple syrup", "agave", "treacle", "date syrup"] },
  
  { slug: "ketchup", keywords: ["ketchup", "tomato ketchup", "heinz ketchup"] },
  { slug: "mayo", keywords: ["mayonnaise", "mayo", "hellmanns", "hellmann's"] },
  { slug: "mustard", keywords: ["mustard", "colmans", "dijon", "english mustard", "wholegrain mustard"] },
  { slug: "table-sauces-condiments", keywords: ["brown sauce", "hp sauce", "worcestershire", "salad cream", "dressing", "bbq sauce", "hot sauce", "tabasco", "relish", "pickle", "chutney", "branston", "piccalilli"] },
  
  { slug: "biscuits-cakes", keywords: ["biscuit", "cookie", "digestive", "hobnob", "rich tea", "bourbon", "custard cream", "oreo", "mcvities", "jaffa", "shortbread", "wafer", "brownie", "cake mix"] },
  { slug: "breakfast-cereals", keywords: ["cereal", "porridge", "oats", "muesli", "granola", "weetabix", "cornflakes", "shreddies", "cheerios", "coco pops", "frosties", "special k", "bran flakes", "all bran", "ready brek", "shredded wheat"] },
  { slug: "crackers-crispbreads", keywords: ["cracker", "crispbread", "ryvita", "cream cracker", "water biscuit", "oatcake", "rice cracker", "breadstick"] },
  { slug: "jam-spreads", keywords: ["jam", "marmalade", "peanut butter", "marmite", "spread", "nutella", "biscoff", "chocolate spread", "lemon curd"] },
  
  { slug: "coffee", keywords: ["coffee", "nescafe", "kenco", "lavazza", "espresso", "ground coffee", "coffee beans", "instant coffee", "douwe egberts", "illy", "carte noire", "starbucks coffee"] },
  { slug: "black-tea", keywords: ["tea", "tea bags", "tetley", "pg tips", "twinings", "yorkshire tea", "english breakfast", "earl grey", "breakfast tea"] },
  { slug: "green-tea", keywords: ["green tea", "matcha", "sencha"] },
  { slug: "herbal-tea", keywords: ["herbal tea", "chamomile", "peppermint tea", "fruit tea", "rooibos", "ginger tea", "lemon tea"] },
  { slug: "hot-chocolate", keywords: ["hot chocolate", "cocoa", "drinking chocolate", "horlicks", "ovaltine", "milo", "options hot chocolate"] },
  { slug: "coffee-tea-hot-drinks", keywords: ["coffee mate", "creamer", "decaf"] },

  { slug: "soup", keywords: ["soup", "heinz soup", "cup a soup", "batchelors"] },
  { slug: "canned", keywords: ["canned", "tinned", "tuna", "salmon", "sardines", "mackerel", "spam", "corned beef", "baked beans", "beans"] },

  // ===== BABY & CHILD =====
  { slug: "baby-child", keywords: ["baby", "infant", "toddler", "nappy", "nappies", "diaper", "pampers", "huggies", "pull ups", "baby wipes", "sudocrem", "baby food", "formula", "aptamil", "cow & gate", "sma", "hipp", "ella's kitchen", "organix", "baby milk", "follow on", "growing up milk", "rusks", "baby rice", "baby cereal", "baby snacks", "baby juice", "gripe water", "calpol", "baby powder", "baby oil", "baby lotion", "baby shampoo", "baby bath"] },

  // ===== HYGIENE, HEALTH & PETS =====
  { slug: "hygiene-health-pets", keywords: ["soap", "shampoo", "conditioner", "shower gel", "body wash", "bath", "toothpaste", "toothbrush", "mouthwash", "dental", "floss", "colgate", "oral b", "sensodyne", "aquafresh", "listerine", "deodorant", "antiperspirant", "roll on", "sure", "dove", "lynx", "razor", "shaving", "gillette", "wilkinson", "toilet paper", "toilet roll", "tissues", "kitchen roll", "andrex", "cushelle", "detergent", "washing powder", "fabric softener", "laundry", "persil", "ariel", "bold", "comfort", "lenor", "fairy", "washing up liquid", "bleach", "disinfectant", "cleaner", "dettol", "flash", "mr muscle", "air freshener", "febreze", "glade", "pet food", "dog food", "cat food", "pedigree", "whiskas", "felix", "iams", "purina", "cesar", "dreamies", "cat litter", "pet treats", "vitamins", "supplements", "paracetamol", "ibuprofen", "plasters", "bandage", "medicine", "cold", "flu", "cough", "throat", "pain relief", "antihistamine"] },

  // ===== MEAT & FISH =====
  { slug: "sliced-bacon", keywords: ["bacon rashers", "streaky bacon", "back bacon", "smoked bacon", "unsmoked bacon"] },
  { slug: "diced-bacon", keywords: ["bacon lardons", "diced bacon", "bacon pieces"] },
  { slug: "bacon-pancetta", keywords: ["bacon", "pancetta"] },
  { slug: "fresh-sausages", keywords: ["pork sausage", "cumberland sausage", "lincolnshire", "breakfast sausage", "chipolata"] },
  { slug: "cured-smoked", keywords: ["frankfurter", "hot dog", "bratwurst", "chorizo", "smoked sausage", "kabanos"] },
  { slug: "sausages-frankfurters", keywords: ["sausage", "banger"] },
  { slug: "cooked-cured", keywords: ["ham", "cooked ham", "gammon", "turkey breast", "chicken breast", "sliced meat", "pastrami"] },
  { slug: "fish", keywords: ["fish", "salmon", "cod", "haddock", "prawns", "shrimp", "mackerel", "trout", "sea bass", "tuna steak", "fish fillet"] },
  { slug: "halal", keywords: ["halal"] },
  { slug: "italian-meat", keywords: ["prosciutto", "salami", "mortadella", "bresaola", "parma ham"] },
  { slug: "spanish-meat", keywords: ["serrano", "jamon", "iberico"] },
  { slug: "polish-meat", keywords: ["kielbasa", "krakowska", "polish sausage"] },
  { slug: "greek-meat", keywords: ["gyros", "souvlaki"] },
  { slug: "meat-fish", keywords: ["meat", "beef", "pork", "lamb", "chicken", "turkey", "duck", "mince", "steak"] },

  // ===== FRESH & CHILLED =====
  { slug: "meat-alts-tofu", keywords: ["tofu", "tempeh", "seitan", "quorn", "vegan meat", "plant based", "beyond meat", "impossible", "linda mccartney"] },
  { slug: "desserts", keywords: ["dessert", "mousse", "cheesecake", "tiramisu", "panna cotta", "trifle", "custard pot", "rice pudding"] },
  { slug: "salads-olives", keywords: ["salad", "coleslaw", "olives", "antipasti", "mixed salad", "potato salad"] },
  { slug: "fresh-pasta", keywords: ["fresh pasta", "fresh ravioli", "fresh tortellini", "stuffed pasta"] },
  { slug: "fresh-sauces", keywords: ["fresh pesto", "fresh sauce"] },
  { slug: "broth", keywords: ["broth", "bone broth", "stock pot"] },
  { slug: "soup-broth", keywords: ["fresh soup", "chilled soup"] },
  { slug: "dumplings-noodles", keywords: ["dumpling", "gyoza", "dim sum", "spring roll", "samosa", "wonton"] },
  { slug: "ready-meals", keywords: ["ready meal", "meal kit", "lasagne ready", "curry ready", "pie ready"] },

  // ===== FRUIT & VEG =====
  { slug: "fruit-veg-salad-pulses", keywords: ["apple", "banana", "orange", "grape", "strawberry", "raspberry", "blueberry", "mango", "pineapple", "melon", "watermelon", "kiwi", "pear", "peach", "plum", "cherry", "lemon", "lime", "grapefruit", "avocado", "coconut", "carrot", "potato", "tomato", "onion", "garlic", "pepper", "cucumber", "lettuce", "spinach", "broccoli", "cauliflower", "cabbage", "celery", "mushroom", "courgette", "aubergine", "sweetcorn", "peas", "beans", "vegetable", "fruit", "fresh produce"] },

  // ===== FALLBACK =====
  { slug: "food-cupboard", keywords: ["food", "grocery", "frozen", "ice cream", "fish fingers", "chicken nuggets", "pizza", "chips", "ready meal", "microwave", "frozen veg", "frozen fruit", "flour", "sugar", "salt", "pepper", "spices", "herbs", "stock", "gravy", "baking", "yeast", "baking powder", "bicarbonate", "vanilla", "food colouring", "icing", "marzipan", "sprinkles"] },
];

// Get category for a product based on its name
export const categorizeProduct = (productName: string): string => {
  const nameLower = productName.toLowerCase();
  
  // Check each category's keywords (order matters - more specific first)
  for (const { slug, keywords } of categoryKeywords) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword.toLowerCase())) {
        return slug;
      }
    }
  }
  
  // Default to food-cupboard if no match
  return "food-cupboard";
};

// Check if a product belongs to a specific category (including parent categories)
export const productBelongsToCategory = (productName: string, categorySlug: string): boolean => {
  const productCategory = categorizeProduct(productName);
  return productCategory === categorySlug;
};
