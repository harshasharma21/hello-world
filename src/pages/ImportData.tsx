import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ImportData = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImport = async () => {
    setIsImporting(true);
    setResult(null);

    try {
      // Fetch the CSV from the public folder
      const response = await fetch("/data/products.csv");
      const csvData = await response.text();

      // Call the edge function to import
      const { data, error } = await supabase.functions.invoke("import-data", {
        body: { csvData },
      });

      if (error) throw error;

      setResult(data);
      toast.success(`Import completed: ${data.message}`);
    } catch (error: any) {
      console.error("Import error:", error);
      toast.error(error.message || "Failed to import data");
      setResult({ error: error.message });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Import Product Data</h1>

        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>CSV Import</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This will import products from the CSV file into the database.
              Categories will be automatically created from the GroupCode column.
            </p>

            <Button
              onClick={handleImport}
              disabled={isImporting}
              size="lg"
              className="w-full"
            >
              {isImporting ? "Importing..." : "Start Import"}
            </Button>

            {result && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ImportData;