import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockProducts } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const GenerateImages = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentProduct, setCurrentProduct] = useState("");
  const [generatedCount, setGeneratedCount] = useState(0);
  const [results, setResults] = useState<Array<{ name: string; success: boolean; error?: string }>>([]);

  const productsNeedingImages = mockProducts.filter(p => 
    !p.images[0] || p.images[0] === "/placeholder.svg"
  );

  const generateAllImages = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedCount(0);
    setResults([]);

    const total = productsNeedingImages.length;

    for (let i = 0; i < productsNeedingImages.length; i++) {
      const product = productsNeedingImages[i];
      setCurrentProduct(product.name);

      try {
        const { data, error } = await supabase.functions.invoke('generate-product-image', {
          body: {
            productName: product.name,
            category: product.category,
            description: product.shortDescription || product.description
          }
        });

        if (error) throw error;

        if (data?.error) {
          throw new Error(data.error);
        }

        setResults(prev => [...prev, { 
          name: product.name, 
          success: true 
        }]);
        setGeneratedCount(prev => prev + 1);
        
        toast.success(`Generated image for ${product.name}`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error: any) {
        console.error(`Failed to generate image for ${product.name}:`, error);
        setResults(prev => [...prev, { 
          name: product.name, 
          success: false, 
          error: error.message 
        }]);
        
        toast.error(`Failed: ${product.name} - ${error.message}`);
        
        // If rate limited, wait longer
        if (error.message?.includes('Rate limit') || error.message?.includes('429')) {
          toast.info("Rate limited - waiting 10 seconds...");
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      }

      setProgress(((i + 1) / total) * 100);
    }

    setIsGenerating(false);
    setCurrentProduct("");
    toast.success(`Completed! Generated ${generatedCount} images`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Product Image Generator</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Generate AI Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-4">
                  {productsNeedingImages.length} products need images
                </p>
                
                <Button 
                  onClick={generateAllImages}
                  disabled={isGenerating || productsNeedingImages.length === 0}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Images...
                    </>
                  ) : (
                    `Generate ${productsNeedingImages.length} Images`
                  )}
                </Button>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {generatedCount} / {productsNeedingImages.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                  {currentProduct && (
                    <p className="text-sm text-muted-foreground">
                      Currently generating: {currentProduct}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-md flex items-center justify-between ${
                        result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <span className="font-medium">{result.name}</span>
                      <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                        {result.success ? '✓ Success' : `✗ Failed: ${result.error}`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Important Notes:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Images are generated using AI and uploaded to Supabase storage</li>
              <li>The process includes delays to avoid rate limiting</li>
              <li>Generated images will need to be referenced in mockData.ts manually</li>
              <li>Check the product-images bucket in Supabase for uploaded files</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GenerateImages;
