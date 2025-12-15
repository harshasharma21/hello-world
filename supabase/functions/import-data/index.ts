import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Parse CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  
  return values;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { csvData } = await req.json();
    
    if (!csvData) {
      return new Response(
        JSON.stringify({ error: "No CSV data provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Starting CSV import...')

    // Parse CSV
    const lines = csvData.split("\n").filter((line: string) => line.trim());
    const headers = lines[0].split(",").map((h: string) => h.trim());
    
    console.log('Headers:', headers);
    
    // Get unique group codes for categories
    const groupCodes = new Set<string>();
    const products: any[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length < 4) continue;
      
      const name = values[0]?.trim();
      const barcode = values[1]?.trim();
      const baseUnit = values[2]?.trim();
      const price = parseFloat(values[3]) || null;
      const groupCode = values[4]?.trim() || null;
      const isValidBarcode = values[8]?.trim().toLowerCase() === "true";
      
      if (!name || !barcode) continue;
      
      if (groupCode) {
        groupCodes.add(groupCode);
      }
      
      products.push({
        name,
        barcode,
        base_unit: baseUnit || null,
        price,
        group_code: groupCode,
        is_valid_barcode: isValidBarcode,
      });
    }
    
    console.log(`Parsed ${products.length} products and ${groupCodes.size} categories`);
    
    // Insert categories from group codes
    const categoryInserts = Array.from(groupCodes).map(code => ({
      name: code.trim(),
      slug: code.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
    
    if (categoryInserts.length > 0) {
      console.log('Inserting categories...');
      const { error: catError } = await supabase
        .from("categories")
        .upsert(categoryInserts, { onConflict: "slug", ignoreDuplicates: true });
      
      if (catError) {
        console.error("Category insert error:", catError);
      }
    }
    
    // Get category IDs
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("id, slug, name");
    
    const categoryMap = new Map(
      categoriesData?.map(c => [c.name.toLowerCase().trim(), c.id]) || []
    );
    
    // Update products with category IDs
    const productsWithCategories = products.map(p => ({
      ...p,
      category_id: p.group_code ? categoryMap.get(p.group_code.toLowerCase().trim()) || null : null,
    }));
    
    // Insert products in batches
    const batchSize = 100;
    let insertedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < productsWithCategories.length; i += batchSize) {
      const batch = productsWithCategories.slice(i, i + batchSize);
      console.log(`Inserting products batch ${Math.floor(i / batchSize) + 1}...`);
      
      const { error } = await supabase
        .from("products")
        .upsert(batch, { onConflict: "barcode", ignoreDuplicates: false });
      
      if (error) {
        console.error(`Batch ${i / batchSize} error:`, error);
        errorCount += batch.length;
      } else {
        insertedCount += batch.length;
      }
    }

    console.log('Import completed successfully!')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Imported ${insertedCount} products, ${errorCount} errors`,
        categoriesCreated: categoryInserts.length,
        totalProducts: products.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Import error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});