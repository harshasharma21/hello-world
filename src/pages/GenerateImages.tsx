import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const GenerateImages = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentProduct, setCurrentProduct] = useState("");
  const [generatedCount, setGeneratedCount] = useState(0);
  const [results, setResults] = useState<Array<{ name: string; success: boolean; error?: string }>>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchProductsCount();
  }, []);

  const fetchProductsCount = async () => {
    // Count products from newProducts table
    const { count } = await supabase
      .from('newProducts')
      .select('*', { count: 'exact', head: true });
    
    setTotalProducts(count || 0);
  };

  const generateAllImages = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedCount(0);
    setResults([]);

    try {
      setCurrentProduct("Generating images...");
      
      const { data, error } = await supabase.functions.invoke('generate-missing-images', {
        body: {}
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      // Update results
      if (data?.results) {
        setResults(data.results.map((r: any) => ({
          name: r.productName,
          success: r.success,
          error: r.error
        })));
        setGeneratedCount(data.successCount || 0);
      }

      setProgress(100);
      toast.success(`Completed! Generated ${data.successCount} images`);
      
      // Refresh count
      await fetchProductsCount();
      
    } catch (error: any) {
      console.error('Failed to generate images:', error);
      toast.error(`Failed: ${error.message}`);
    }

    setIsGenerating(false);
    setCurrentProduct("");
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
                <Button 
                  onClick={fetchProductsCount}
                  variant="outline"
                  className="w-full mb-4"
                >
                  Check Products Count
                </Button>
                
                <p className="text-muted-foreground mb-4">
                  {totalProducts > 0 
                    ? `${totalProducts} products in database` 
                    : 'Click "Check Products" to see product count'
                  }
                </p>
                
                <Button 
                  onClick={generateAllImages}
                  disabled={isGenerating || totalProducts === 0}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Images...
                    </>
                  ) : (
                    `Generate Images (Batch of 10)`
                  )}
                </Button>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                  {currentProduct && (
                    <p className="text-sm text-muted-foreground">
                      {currentProduct}
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
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Generates AI images using Nano banana model for products without images</li>
              <li>Automatically uploads images to Supabase storage bucket</li>
              <li>Updates product records with the new image URLs</li>
              <li>Processes 10 products at a time to avoid timeouts</li>
              <li>Run multiple times until all products have images</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GenerateImages;
