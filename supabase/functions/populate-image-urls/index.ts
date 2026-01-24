import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get optional batch parameters from request
    const { startId = 0, batchSize = 500 } = await req.json().catch(() => ({}));

    // Storage bucket name (with space as per user's bucket)
    const bucketName = "products images";
    
    // Folders in the bucket
    const folders = ["1-500", "501-1000", "1001-1500", "1501-2000", "2001-2500", "2501-3000"];
    
    // Collect all image files from all folders
    const imageMap = new Map<string, string>(); // key: normalized name -> value: full path
    
    for (const folder of folders) {
      console.log(`Scanning folder: ${folder}`);
      
      const { data: files, error: listError } = await supabase.storage
        .from(bucketName)
        .list(folder, { limit: 1000 });
      
      if (listError) {
        console.error(`Error listing folder ${folder}:`, listError);
        continue;
      }
      
      if (files) {
        for (const file of files) {
          if (file.name && !file.id?.includes("folder")) {
            // Remove file extension to get the base name
            const baseName = file.name.replace(/\.[^/.]+$/, "").toLowerCase().trim();
            const fullPath = `${folder}/${file.name}`;
            imageMap.set(baseName, fullPath);
          }
        }
      }
    }
    
    console.log(`Found ${imageMap.size} images in storage`);

    // Fetch products in batches starting from startId
    const { data: products, error: productsError } = await supabase
      .from("newProducts")
      .select("id, name, Barcode")
      .not("name", "is", null)
      .gte("id", startId)
      .order("id", { ascending: true })
      .limit(batchSize);

    if (productsError) {
      throw productsError;
    }

    console.log(`Processing batch of ${products?.length || 0} products starting from ID ${startId}`);

    let updatedCount = 0;
    let notFoundCount = 0;
    let lastProcessedId = startId;
    const updates: { id: number; image_url: string }[] = [];

    // For each product, find matching image
    for (const product of products || []) {
      if (!product.name) continue;
      lastProcessedId = product.id;

      // Create the expected image name pattern: "{name} {barcode}"
      const expectedName = `${product.name} ${product.Barcode}`.toLowerCase().trim();
      
      // Try to find matching image
      let imagePath = imageMap.get(expectedName);
      
      // If not found, try alternative patterns
      if (!imagePath) {
        // Try just the name
        imagePath = imageMap.get(product.name.toLowerCase().trim());
      }
      
      if (!imagePath) {
        // Try partial match with name
        for (const [key, path] of imageMap) {
          if (key.includes(product.name.toLowerCase().trim()) || 
              product.name.toLowerCase().trim().includes(key)) {
            imagePath = path;
            break;
          }
        }
      }

      if (imagePath) {
        // Generate public URL
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(imagePath);
        
        if (urlData?.publicUrl) {
          updates.push({ id: product.id, image_url: urlData.publicUrl });
          updatedCount++;
        }
      } else {
        notFoundCount++;
      }
    }

    // Batch update all products with found images
    console.log(`Updating ${updates.length} products with image URLs`);
    
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from("newProducts")
        .update({ image_url: update.image_url })
        .eq("id", update.id);

      if (updateError) {
        console.error(`Error updating product ${update.id}:`, updateError);
      }
    }

    const hasMore = (products?.length || 0) === batchSize;
    const nextStartId = lastProcessedId + 1;

    const result = {
      success: true,
      message: `Processed batch of ${products?.length || 0} products`,
      updatedCount,
      notFoundCount,
      totalImagesFound: imageMap.size,
      hasMore,
      nextStartId: hasMore ? nextStartId : null,
      lastProcessedId,
    };

    console.log("Result:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
