import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Image URLs from the repository
const images = [
  // Category images
  { filename: 'category-beverages.jpg', type: 'category', categoryId: '16' },
  { filename: 'category-food-cupboard.jpg', type: 'category', categoryId: '15' },
  { filename: 'category-frozen-foods.jpg', type: 'category', categoryId: '17' },
  { filename: 'category-snacks.jpg', type: 'category', categoryId: '19' },
  // Product images
  { filename: 'product-chips.jpg', type: 'product' },
  { filename: 'product-cola.jpg', type: 'product' },
  { filename: 'product-orange-juice.jpg', type: 'product' },
  { filename: 'product-passata.jpg', type: 'product' },
  { filename: 'product-pasta.jpg', type: 'product' },
  { filename: 'product-pesto.jpg', type: 'product' },
  { filename: 'product-water.jpg', type: 'product' },
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Starting image upload...')

    const uploadedImages = []

    for (const image of images) {
      console.log(`Processing ${image.filename}...`)
      
      // Fetch image from GitHub repository
      const imageUrl = `https://raw.githubusercontent.com/harshasharma21/database-connect-pro/main/src/assets/${image.filename}`
      const response = await fetch(imageUrl)
      
      if (!response.ok) {
        console.error(`Failed to fetch ${image.filename}:`, response.statusText)
        continue
      }

      const blob = await response.blob()
      const arrayBuffer = await blob.arrayBuffer()
      const fileData = new Uint8Array(arrayBuffer)

      // Upload to Supabase storage
      const storagePath = `${image.type}s/${image.filename}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(storagePath, fileData, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (uploadError) {
        console.error(`Failed to upload ${image.filename}:`, uploadError)
        continue
      }

      console.log(`Uploaded ${image.filename} to storage`)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(storagePath)

      // Insert into images table
      const { data: imageData, error: insertError } = await supabase
        .from('images')
        .insert({
          filename: image.filename,
          storage_path: storagePath,
          type: image.type,
          product_id: image.type === 'product' ? null : null,
          category_id: image.type === 'category' ? image.categoryId : null,
        })
        .select()
        .single()

      if (insertError) {
        console.error(`Failed to insert image record for ${image.filename}:`, insertError)
        continue
      }

      console.log(`Created image record for ${image.filename}`)
      uploadedImages.push({
        filename: image.filename,
        url: publicUrl,
        id: imageData.id
      })
    }

    console.log('Image upload completed!')

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Images uploaded successfully',
        count: uploadedImages.length,
        images: uploadedImages
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Upload error:', error)
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
