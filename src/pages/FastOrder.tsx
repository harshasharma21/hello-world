import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, HelpCircle, Upload as UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { mockProducts } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

interface OrderRow {
  id: string;
  searchTerm: string;
  selectedProduct: Product | null;
  quantity: number;
  price: number;
}

const FastOrder = () => {
  const { addItem } = useCart();
  const [orderRows, setOrderRows] = useState<OrderRow[]>(() => 
    Array.from({ length: 10 }, (_, i) => ({
      id: `row-${i}`,
      searchTerm: "",
      selectedProduct: null,
      quantity: 0,
      price: 0
    }))
  );
  const [pasteText, setPasteText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const updateRow = (id: string, field: keyof OrderRow, value: any) => {
    setOrderRows(prev => prev.map(row => {
      if (row.id !== id) return row;
      
      const updated = { ...row, [field]: value };
      
      // Auto-search and select product when search term changes
      if (field === 'searchTerm' && value) {
        const product = mockProducts.find(p => 
          p.sku.toLowerCase().includes(value.toLowerCase()) ||
          p.name.toLowerCase().includes(value.toLowerCase())
        );
        if (product) {
          updated.selectedProduct = product;
          updated.price = product.price * (updated.quantity || 1);
        }
      }
      
      // Update price when quantity changes
      if (field === 'quantity' && updated.selectedProduct) {
        updated.price = updated.selectedProduct.price * (value || 0);
      }
      
      return updated;
    }));
  };

  const addMoreRows = () => {
    const newRows = Array.from({ length: 5 }, (_, i) => ({
      id: `row-${Date.now()}-${i}`,
      searchTerm: "",
      selectedProduct: null,
      quantity: 0,
      price: 0
    }));
    setOrderRows(prev => [...prev, ...newRows]);
  };

  const removeRow = (id: string) => {
    setOrderRows(prev => prev.filter(row => row.id !== id));
  };

  const handleAddToCart = () => {
    const validRows = orderRows.filter(row => row.selectedProduct && row.quantity > 0);
    
    if (validRows.length === 0) {
      toast.error("Please add items with quantity to proceed");
      return;
    }

    validRows.forEach(row => {
      if (row.selectedProduct) {
        addItem(row.selectedProduct, row.quantity);
      }
    });

    toast.success(`Added ${validRows.length} items to cart`);
    
    // Reset rows
    setOrderRows(Array.from({ length: 10 }, (_, i) => ({
      id: `row-${i}`,
      searchTerm: "",
      selectedProduct: null,
      quantity: 0,
      price: 0
    })));
  };

  const handleClearAll = () => {
    setOrderRows(Array.from({ length: 10 }, (_, i) => ({
      id: `row-${i}`,
      searchTerm: "",
      selectedProduct: null,
      quantity: 0,
      price: 0
    })));
    toast.success("Cleared all rows");
  };

  const handleProcessPaste = async () => {
    if (!pasteText.trim()) {
      toast.error("Please paste your order");
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-order', {
        body: { text: pasteText }
      });

      if (error) throw error;

      const parsedItems = (data.items || []).map((item: { sku: string; quantity: number }) => {
        const product = mockProducts.find(p => p.sku === item.sku);
        return {
          sku: item.sku,
          quantity: item.quantity,
          product
        };
      });

      // Clear existing rows and add parsed items
      const newRows = parsedItems.map((item: any, i: number) => ({
        id: `row-${i}`,
        searchTerm: item.product?.name || item.sku,
        selectedProduct: item.product || null,
        quantity: item.quantity,
        price: item.product ? item.product.price * item.quantity : 0
      }));

      setOrderRows(newRows);
      setPasteText("");
      toast.success(`Processed ${parsedItems.filter((i: any) => i.product).length} items`);
    } catch (error: any) {
      console.error('Process error:', error);
      toast.error("Failed to process order. Please check format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      setPasteText(text);
      
      // Auto-process
      setTimeout(() => {
        handleProcessPaste();
      }, 500);
      
      toast.success("File uploaded");
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Fast Order</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Order Table */}
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden bg-background">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="w-12 p-3"></th>
                      <th className="text-left p-3 font-semibold">Items #</th>
                      <th className="text-center p-3 font-semibold w-32">Qty</th>
                      <th className="text-right p-3 font-semibold w-32">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderRows.map((row) => (
                      <tr key={row.id} className="border-b hover:bg-muted/30">
                        <td className="p-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRow(row.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                        <td className="p-3">
                          <Input
                            placeholder="Search..."
                            value={row.searchTerm}
                            onChange={(e) => updateRow(row.id, 'searchTerm', e.target.value)}
                            className="h-9"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            placeholder="Qty"
                            min="0"
                            value={row.quantity || ''}
                            onChange={(e) => updateRow(row.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="h-9 text-center"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={row.price.toFixed(2)}
                            readOnly
                            className="h-9 text-right bg-muted"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t bg-muted/20">
                <Button
                  onClick={addMoreRows}
                  variant="outline"
                  className="w-full mb-3 bg-green-600 hover:bg-green-700 text-white border-green-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add more rows
                </Button>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleClearAll}
                    variant="outline"
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Upload and Paste */}
          <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  Upload your order
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/20">
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop a .CSV, .XLS or .ODS file here, or select them from computer...
                  </p>
                  <Input
                    type="file"
                    accept=".csv,.xls,.xlsx,.ods,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button
                      type="button"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </label>
                </div>

                <Button
                  onClick={handleProcessPaste}
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? "Processing..." : "Process Order"}
                </Button>
              </CardContent>
            </Card>

            {/* Paste Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  Paste your order
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your order here..."
                  className="min-h-[200px] font-mono text-sm"
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                />

                <Button
                  onClick={handleProcessPaste}
                  disabled={isProcessing || !pasteText.trim()}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? "Processing..." : "Process Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FastOrder;
