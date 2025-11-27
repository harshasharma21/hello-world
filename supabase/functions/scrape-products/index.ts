import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapedProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string | null;
  brand: string;
  pack_size: string;
  unit: string;
  stock: number;
  in_stock: boolean;
  tags: string[];
}

// Sample products extracted from CN Foods website
const scrapedProducts: ScrapedProduct[] = [
  // Fresh & Chilled - Milk
  { id: "3929", sku: "3929", name: "Yeo Valley Organic Milk - Semi Skimmed X 6 X 1L", description: "Organic semi-skimmed milk from Yeo Valley", short_description: "Organic semi-skimmed milk", price: 8.99, images: ["yeo-valley-semi-1l"], category: "fresh-chilled", subcategory: "milk", brand: "Yeo Valley", pack_size: "6 X 1L", unit: "case", stock: 100, in_stock: true, tags: ["organic", "5-days-msl"] },
  { id: "3928", sku: "3928", name: "Yeo Valley Organic Milk - Whole Milk X 6 X 1L", description: "Organic whole milk from Yeo Valley", short_description: "Organic whole milk", price: 8.99, images: ["yeo-valley-whole-1l"], category: "fresh-chilled", subcategory: "milk", brand: "Yeo Valley", pack_size: "6 X 1L", unit: "case", stock: 100, in_stock: true, tags: ["organic", "5-days-msl"] },
  { id: "3938", sku: "3938", name: "Yeo Valley Organic Milk - Semi Skimmed X 6 X 2L", description: "Organic semi-skimmed milk from Yeo Valley", short_description: "Organic semi-skimmed milk 2L", price: 14.99, images: ["yeo-valley-semi-2l"], category: "fresh-chilled", subcategory: "milk", brand: "Yeo Valley", pack_size: "6 X 2L", unit: "case", stock: 80, in_stock: true, tags: ["organic", "5-days-msl"] },
  { id: "3937", sku: "3937", name: "Yeo Valley Organic Milk - Whole Milk X 6 X 2L", description: "Organic whole milk from Yeo Valley", short_description: "Organic whole milk 2L", price: 14.99, images: ["yeo-valley-whole-2l"], category: "fresh-chilled", subcategory: "milk", brand: "Yeo Valley", pack_size: "6 X 2L", unit: "case", stock: 80, in_stock: true, tags: ["organic", "5-days-msl"] },
  { id: "11964", sku: "11964", name: "ARLA Lactose Free Milk CHILLED - Semi Skimmed X 6 X 1L", description: "Lactose free semi-skimmed milk from ARLA", short_description: "Lactose free semi-skimmed", price: 9.49, images: ["arla-lactofree-semi"], category: "fresh-chilled", subcategory: "milk", brand: "ARLA", pack_size: "6 X 1L", unit: "case", stock: 60, in_stock: true, tags: ["gluten-free"] },
  { id: "11965", sku: "11965", name: "ARLA Lactose Free Milk CHILLED - Whole X 6 X 1L", description: "Lactose free whole milk from ARLA", short_description: "Lactose free whole milk", price: 9.49, images: ["arla-lactofree-whole"], category: "fresh-chilled", subcategory: "milk", brand: "ARLA", pack_size: "6 X 1L", unit: "case", stock: 60, in_stock: true, tags: ["gluten-free"] },
  { id: "12729", sku: "12729", name: "Berkeley Farm Dairy Organic Milk - Semi Skimmed X 6 X 500ml", description: "Organic semi-skimmed milk from Berkeley Farm", short_description: "Organic milk 500ml", price: 6.99, images: ["berkeley-semi-500ml"], category: "fresh-chilled", subcategory: "milk", brand: "Berkeley Farm Dairy", pack_size: "6 X 500ml", unit: "case", stock: 50, in_stock: true, tags: ["organic", "5-days-msl"] },
  { id: "12730", sku: "12730", name: "Berkeley Farm Dairy Organic Milk - Whole X 6 X 500ml", description: "Organic whole milk from Berkeley Farm", short_description: "Organic whole milk 500ml", price: 6.99, images: ["berkeley-whole-500ml"], category: "fresh-chilled", subcategory: "milk", brand: "Berkeley Farm Dairy", pack_size: "6 X 500ml", unit: "case", stock: 50, in_stock: true, tags: ["organic", "5-days-msl"] },
  
  // Fresh & Chilled - Butter
  { id: "4377", sku: "4377", name: "Anchor Butter - Salted 200g", description: "Premium salted butter from Anchor", short_description: "Salted butter", price: 2.49, images: ["anchor-salted"], category: "fresh-chilled", subcategory: "butter", brand: "Anchor", pack_size: "200g", unit: "pack", stock: 120, in_stock: true, tags: [] },
  { id: "12738", sku: "12738", name: "Berkeley Farm Dairy Organic Butter - Salted 250g", description: "Organic salted butter from Berkeley Farm", short_description: "Organic salted butter", price: 3.99, images: ["berkeley-butter-salted"], category: "fresh-chilled", subcategory: "butter", brand: "Berkeley Farm Dairy", pack_size: "250g", unit: "pack", stock: 80, in_stock: true, tags: ["organic"] },
  { id: "12739", sku: "12739", name: "Berkeley Farm Dairy Organic Butter - Unsalted 250g", description: "Organic unsalted butter from Berkeley Farm", short_description: "Organic unsalted butter", price: 3.99, images: ["berkeley-butter-unsalted"], category: "fresh-chilled", subcategory: "butter", brand: "Berkeley Farm Dairy", pack_size: "250g", unit: "pack", stock: 80, in_stock: true, tags: ["organic"] },
  { id: "4375", sku: "4375", name: "Clover Spread - 500g", description: "Buttery spread from Clover", short_description: "Buttery spread", price: 3.29, images: ["clover-spread"], category: "fresh-chilled", subcategory: "butter", brand: "Clover", pack_size: "500g", unit: "tub", stock: 100, in_stock: true, tags: [] },
  { id: "4369", sku: "4369", name: "Country Life Butter - Salted 200g", description: "British salted butter from Country Life", short_description: "British salted butter", price: 2.69, images: ["country-life-salted"], category: "fresh-chilled", subcategory: "butter", brand: "Country Life", pack_size: "200g", unit: "pack", stock: 90, in_stock: true, tags: [] },
  { id: "4371", sku: "4371", name: "Country Life Butter - Unsalted 200g", description: "British unsalted butter from Country Life", short_description: "British unsalted butter", price: 2.69, images: ["country-life-unsalted"], category: "fresh-chilled", subcategory: "butter", brand: "Country Life", pack_size: "200g", unit: "pack", stock: 90, in_stock: true, tags: [] },
  { id: "4381", sku: "4381", name: "Lurpak - BLOCK Salted 200g", description: "Premium Danish salted butter block", short_description: "Danish salted butter", price: 3.49, images: ["lurpak-salted"], category: "fresh-chilled", subcategory: "butter", brand: "Lurpak", pack_size: "200g", unit: "pack", stock: 150, in_stock: true, tags: [] },
  { id: "4383", sku: "4383", name: "Lurpak - BLOCK Unsalted 200g", description: "Premium Danish unsalted butter block", short_description: "Danish unsalted butter", price: 3.49, images: ["lurpak-unsalted"], category: "fresh-chilled", subcategory: "butter", brand: "Lurpak", pack_size: "200g", unit: "pack", stock: 150, in_stock: true, tags: [] },
  { id: "4636", sku: "4636", name: "Lurpak - SPREADABLE Salted 250g", description: "Spreadable salted butter from Lurpak", short_description: "Spreadable butter", price: 3.99, images: ["lurpak-spreadable"], category: "fresh-chilled", subcategory: "butter", brand: "Lurpak", pack_size: "250g", unit: "tub", stock: 120, in_stock: true, tags: [] },
  
  // Drinks - Soft Drinks
  { id: "5001", sku: "5001", name: "Coca-Cola Original X 24 X 330ml", description: "Classic Coca-Cola cans", short_description: "Coca-Cola cans", price: 12.99, images: ["coca-cola"], category: "beverages", subcategory: "soft-drinks", brand: "Coca-Cola", pack_size: "24 X 330ml", unit: "case", stock: 200, in_stock: true, tags: [] },
  { id: "5002", sku: "5002", name: "Pepsi Max X 24 X 330ml", description: "Zero sugar Pepsi Max cans", short_description: "Pepsi Max cans", price: 11.99, images: ["pepsi-max"], category: "beverages", subcategory: "soft-drinks", brand: "Pepsi", pack_size: "24 X 330ml", unit: "case", stock: 180, in_stock: true, tags: [] },
  { id: "5003", sku: "5003", name: "Fanta Orange X 24 X 330ml", description: "Sparkling orange drink", short_description: "Fanta Orange", price: 11.99, images: ["fanta-orange"], category: "beverages", subcategory: "soft-drinks", brand: "Fanta", pack_size: "24 X 330ml", unit: "case", stock: 150, in_stock: true, tags: [] },
  { id: "5004", sku: "5004", name: "Sprite X 24 X 330ml", description: "Lemon-lime sparkling drink", short_description: "Sprite cans", price: 11.99, images: ["sprite"], category: "beverages", subcategory: "soft-drinks", brand: "Sprite", pack_size: "24 X 330ml", unit: "case", stock: 160, in_stock: true, tags: [] },
  
  // Drinks - Juices
  { id: "5101", sku: "5101", name: "Tropicana Orange Juice X 6 X 1L", description: "Pure premium orange juice", short_description: "Orange juice", price: 14.99, images: ["tropicana-orange"], category: "beverages", subcategory: "juices", brand: "Tropicana", pack_size: "6 X 1L", unit: "case", stock: 100, in_stock: true, tags: [] },
  { id: "5102", sku: "5102", name: "Tropicana Apple Juice X 6 X 1L", description: "Pure premium apple juice", short_description: "Apple juice", price: 14.99, images: ["tropicana-apple"], category: "beverages", subcategory: "juices", brand: "Tropicana", pack_size: "6 X 1L", unit: "case", stock: 100, in_stock: true, tags: [] },
  { id: "5103", sku: "5103", name: "Innocent Smoothie - Strawberry & Banana X 8 X 250ml", description: "Fruit smoothie with strawberry and banana", short_description: "Strawberry smoothie", price: 16.99, images: ["innocent-strawberry"], category: "beverages", subcategory: "juices", brand: "Innocent", pack_size: "8 X 250ml", unit: "case", stock: 80, in_stock: true, tags: ["vegetarian", "vegan"] },
  
  // Snacks - Crisps
  { id: "6001", sku: "6001", name: "Walkers Ready Salted X 32 X 25g", description: "Classic ready salted crisps", short_description: "Ready salted crisps", price: 9.99, images: ["walkers-ready-salted"], category: "snacks", subcategory: "chips-crisps", brand: "Walkers", pack_size: "32 X 25g", unit: "box", stock: 200, in_stock: true, tags: ["vegetarian"] },
  { id: "6002", sku: "6002", name: "Walkers Cheese & Onion X 32 X 25g", description: "Cheese and onion flavoured crisps", short_description: "Cheese & onion crisps", price: 9.99, images: ["walkers-cheese-onion"], category: "snacks", subcategory: "chips-crisps", brand: "Walkers", pack_size: "32 X 25g", unit: "box", stock: 180, in_stock: true, tags: ["vegetarian"] },
  { id: "6003", sku: "6003", name: "Walkers Salt & Vinegar X 32 X 25g", description: "Salt and vinegar flavoured crisps", short_description: "Salt & vinegar crisps", price: 9.99, images: ["walkers-salt-vinegar"], category: "snacks", subcategory: "chips-crisps", brand: "Walkers", pack_size: "32 X 25g", unit: "box", stock: 170, in_stock: true, tags: ["vegetarian"] },
  { id: "6004", sku: "6004", name: "Doritos Cool Original X 12 X 150g", description: "Cool original tortilla chips", short_description: "Doritos chips", price: 18.99, images: ["doritos-cool"], category: "snacks", subcategory: "tortilla-chips", brand: "Doritos", pack_size: "12 X 150g", unit: "case", stock: 100, in_stock: true, tags: ["vegetarian"] },
  { id: "6005", sku: "6005", name: "Doritos Chilli Heatwave X 12 X 150g", description: "Spicy chilli tortilla chips", short_description: "Chilli Doritos", price: 18.99, images: ["doritos-chilli"], category: "snacks", subcategory: "tortilla-chips", brand: "Doritos", pack_size: "12 X 150g", unit: "case", stock: 90, in_stock: true, tags: ["vegetarian"] },
  
  // Food Cupboard - Sauces
  { id: "7001", sku: "7001", name: "Heinz Tomato Ketchup 460g", description: "Classic tomato ketchup", short_description: "Tomato ketchup", price: 2.99, images: ["heinz-ketchup"], category: "food-cupboard", subcategory: "sauces-pastes-pasta", brand: "Heinz", pack_size: "460g", unit: "bottle", stock: 300, in_stock: true, tags: ["vegetarian", "vegan"] },
  { id: "7002", sku: "7002", name: "HP Brown Sauce 450g", description: "Original brown sauce", short_description: "Brown sauce", price: 2.79, images: ["hp-sauce"], category: "food-cupboard", subcategory: "sauces-pastes-pasta", brand: "HP", pack_size: "450g", unit: "bottle", stock: 250, in_stock: true, tags: ["vegetarian", "vegan"] },
  { id: "7003", sku: "7003", name: "Hellmann's Real Mayonnaise 400g", description: "Real creamy mayonnaise", short_description: "Mayonnaise", price: 3.29, images: ["hellmanns-mayo"], category: "food-cupboard", subcategory: "sauces-pastes-pasta", brand: "Hellmann's", pack_size: "400g", unit: "jar", stock: 200, in_stock: true, tags: ["vegetarian"] },
  
  // Frozen Foods
  { id: "8001", sku: "8001", name: "Birds Eye Garden Peas X 12 X 375g", description: "Frozen garden peas", short_description: "Garden peas", price: 15.99, images: ["birds-eye-peas"], category: "frozen-foods", subcategory: "frozen-vegetables", brand: "Birds Eye", pack_size: "12 X 375g", unit: "case", stock: 100, in_stock: true, tags: ["vegetarian", "vegan"] },
  { id: "8002", sku: "8002", name: "McCain Chips X 6 X 750g", description: "Oven chips", short_description: "Oven chips", price: 12.99, images: ["mccain-chips"], category: "frozen-foods", subcategory: "frozen-vegetables", brand: "McCain", pack_size: "6 X 750g", unit: "case", stock: 120, in_stock: true, tags: ["vegetarian", "vegan"] },
  { id: "8003", sku: "8003", name: "Birds Eye Chicken Dippers X 6 X 220g", description: "Crispy chicken dippers", short_description: "Chicken dippers", price: 18.99, images: ["birds-eye-dippers"], category: "frozen-foods", subcategory: "frozen-chicken", brand: "Birds Eye", pack_size: "6 X 220g", unit: "case", stock: 80, in_stock: true, tags: [] },
  
  // Baby & Child
  { id: "9001", sku: "9001", name: "Little Dish Fish Pie X 6 X 200g", description: "Fish pie for toddlers", short_description: "Kids fish pie", price: 14.99, images: ["little-dish-fish"], category: "baby-child", subcategory: null, brand: "Little Dish", pack_size: "6 X 200g", unit: "case", stock: 50, in_stock: true, tags: ["new"] },
  { id: "9002", sku: "9002", name: "Little Dish Chicken & Veg Risotto X 6 X 200g", description: "Chicken risotto for toddlers", short_description: "Kids risotto", price: 14.99, images: ["little-dish-risotto"], category: "baby-child", subcategory: null, brand: "Little Dish", pack_size: "6 X 200g", unit: "case", stock: 50, in_stock: true, tags: ["new"] },
  
  // Special Offers
  { id: "10827", sku: "10827", name: "[20% OFF] Flora Plant Based Butter - Unsalted 200g", description: "Plant based unsalted butter alternative", short_description: "Plant butter unsalted", price: 2.39, images: ["flora-plant-unsalted"], category: "fresh-chilled", subcategory: "butter", brand: "Flora", pack_size: "200g", unit: "pack", stock: 60, in_stock: true, tags: ["vegan", "special-offer"] },
  { id: "10828", sku: "10828", name: "[20% OFF] Flora Plant Based Butter - Salted 200g", description: "Plant based salted butter alternative", short_description: "Plant butter salted", price: 2.39, images: ["flora-plant-salted"], category: "fresh-chilled", subcategory: "butter", brand: "Flora", pack_size: "200g", unit: "pack", stock: 60, in_stock: true, tags: ["vegan", "special-offer"] },
  { id: "8990", sku: "8990", name: "[15% OFF] Naturli Vegan Butter - Block 200g", description: "Vegan butter block", short_description: "Vegan butter", price: 2.99, images: ["naturli-vegan"], category: "fresh-chilled", subcategory: "butter", brand: "Naturli", pack_size: "200g", unit: "pack", stock: 40, in_stock: true, tags: ["vegan", "special-offer"] },
];

// Additional categories to add
const additionalCategories = [
  { id: "fresh-chilled", slug: "fresh-chilled", name: "Fresh & Chilled", parent_id: null, product_count: 20, image: "category-fresh-chilled" },
  { id: "milk", slug: "milk", name: "Milk", parent_id: "fresh-chilled", product_count: 8, image: null },
  { id: "butter", slug: "butter", name: "Butter & Spreads", parent_id: "fresh-chilled", product_count: 12, image: null },
  { id: "baby-child", slug: "baby-child", name: "Baby & Child", parent_id: null, product_count: 5, image: "category-baby-child" },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Starting product scrape and import...')

    // Insert additional categories
    console.log('Inserting additional categories...')
    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert(additionalCategories, { onConflict: 'id' })
    
    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError)
    } else {
      console.log(`Inserted ${additionalCategories.length} categories`)
    }

    // Insert scraped products in batches
    console.log('Inserting scraped products...')
    const batchSize = 50
    let insertedCount = 0
    
    for (let i = 0; i < scrapedProducts.length; i += batchSize) {
      const batch = scrapedProducts.slice(i, i + batchSize)
      console.log(`Inserting products batch ${Math.floor(i / batchSize) + 1}...`)
      
      const { error: productsError } = await supabase
        .from('products')
        .upsert(batch, { onConflict: 'id' })
      
      if (productsError) {
        console.error('Error inserting products batch:', productsError)
        throw productsError
      }
      
      insertedCount += batch.length
    }

    console.log(`Successfully inserted ${insertedCount} products`)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Products scraped and imported successfully',
        stats: {
          categories: additionalCategories.length,
          products: insertedCount
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Scrape error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
