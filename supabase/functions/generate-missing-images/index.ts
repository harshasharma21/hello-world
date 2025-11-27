import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching products without images...');
    
    // Get products that need images
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, description, category, subcategory')
      .or('images.is.null,images.eq.{},images.eq.{/placeholder.svg}')
      .limit(10); // Process 10 at a time to avoid timeouts

    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      throw fetchError;
    }

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No products need images', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`Found ${products.length} products needing images`);
    
    const results = [];
    
    for (const product of products as Product[]) {
      try {
        console.log(`Generating image for: ${product.name}`);
        
        // Generate image using Lovable AI Gateway
        const imagePrompt = `A professional product photo of ${product.name}. ${product.description || ''} High quality, clean white background, commercial photography style, well-lit, professional e-commerce product image.`;
        
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              {
                role: 'user',
                content: imagePrompt
              }
            ],
            modalities: ['image', 'text']
          })
        });

        if (!aiResponse.ok) {
          console.error(`AI API error for ${product.name}:`, await aiResponse.text());
          continue;
        }

        const aiData = await aiResponse.json();
        const base64Image = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (!base64Image) {
          console.error(`No image generated for ${product.name}`);
          continue;
        }

        // Convert base64 to blob
        const base64Data = base64Image.split(',')[1];
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        // Create filename from product SKU/ID
        const filename = `products/${product.id}.jpg`;
        
        console.log(`Uploading image for ${product.name} to storage...`);
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filename, binaryData, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${product.name}:`, uploadError);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filename);
        
        const imageUrl = urlData.publicUrl;
        
        console.log(`Updating product ${product.name} with image URL...`);
        
        // Update product with image URL
        const { error: updateError } = await supabase
          .from('products')
          .update({ images: [imageUrl] })
          .eq('id', product.id);

        if (updateError) {
          console.error(`Update error for ${product.name}:`, updateError);
          continue;
        }

        results.push({
          productId: product.id,
          productName: product.name,
          imageUrl,
          success: true
        });
        
        console.log(`✓ Successfully processed ${product.name}`);
        
      } catch (error) {
        console.error(`Error processing product ${product.name}:`, error);
        results.push({
          productId: product.id,
          productName: product.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} products`,
        results,
        successCount: results.filter(r => r.success).length,
        failureCount: results.filter(r => !r.success).length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
