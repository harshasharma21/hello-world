import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, ShoppingCart, CheckCircle2, XCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { mockProducts } from "@/data/mockData";

interface ParsedItem {
  sku: string;
  quantity: number;
  status: 'valid' | 'invalid' | 'not-found';
  product?: typeof mockProducts[0];
  message?: string;
}

const FastOrder = () => {
  const [pastedText, setPastedText] = useState("");
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);

  const handleParse = () => {
    const lines = pastedText.trim().split('\n');
    const items: ParsedItem[] = [];

    lines.forEach(line => {
      const parts = line.trim().split(/[\s,\t]+/);
      if (parts.length < 2) return;

      const [sku, quantityStr] = parts;
      const quantity = parseInt(quantityStr);

      if (isNaN(quantity) || quantity < 1) {
        items.push({
          sku,
          quantity: 0,
          status: 'invalid',
          message: 'Invalid quantity'
        });
        return;
      }

      const product = mockProducts.find(p => p.sku === sku);

      if (!product) {
        items.push({
          sku,
          quantity,
          status: 'not-found',
          message: 'SKU not found'
        });
        return;
      }

      items.push({
        sku,
        quantity,
        status: 'valid',
        product
      });
    });

    setParsedItems(items);
    
    if (items.length === 0) {
      toast.error("No valid items found. Please check your format.");
    } else {
      toast.success(`Parsed ${items.filter(i => i.status === 'valid').length} valid items`);
    }
  };

  const handleAddToCart = () => {
    const validItems = parsedItems.filter(i => i.status === 'valid');
    if (validItems.length === 0) {
      toast.error("No valid items to add to cart");
      return;
    }
    toast.success(`Added ${validItems.length} items to cart`);
    setParsedItems([]);
    setPastedText("");
  };

  const downloadTemplate = () => {
    const template = "SKU,Quantity\nPAS-001,5\nPAS-002,10\nBEV-001,3";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fast-order-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Fast Order</h1>
            <p className="text-muted-foreground">
              Quickly add multiple items to your cart by entering SKU and quantity
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  How to Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Format:</h4>
                  <code className="block bg-neutral-100 p-3 rounded-md text-sm">
                    SKU QUANTITY<br/>
                    PAS-001 5<br/>
                    PAS-002 10<br/>
                    BEV-001 3
                  </code>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Accepted Formats:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Space separated: <code>SKU quantity</code></li>
                    <li>• Comma separated: <code>SKU,quantity</code></li>
                    <li>• Tab separated</li>
                  </ul>
                </div>

                <Button variant="outline" className="w-full" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </CardContent>
            </Card>

            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Enter Your Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your order list here...&#10;Example:&#10;PAS-001 5&#10;PAS-002 10&#10;BEV-001 3"
                  className="min-h-[200px] font-mono text-sm"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                />
                
                <Button className="w-full" onClick={handleParse} disabled={!pastedText.trim()}>
                  Parse & Validate
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Table */}
          {parsedItems.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Validation Results</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {parsedItems.filter(i => i.status === 'valid').length} Valid
                    </Badge>
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      {parsedItems.filter(i => i.status !== 'valid').length} Invalid
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell>
                            {item.product ? item.product.name : '-'}
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {item.product ? `£${item.product.price.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {item.product ? `£${(item.product.price * item.quantity).toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell>
                            {item.status === 'valid' ? (
                              <Badge variant="secondary">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Valid
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                {item.message}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {parsedItems.filter(i => i.status === 'valid').length > 0 && (
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-lg">
                      <span className="text-muted-foreground">Total: </span>
                      <span className="font-bold text-primary">
                        £{parsedItems
                          .filter(i => i.status === 'valid' && i.product)
                          .reduce((sum, i) => sum + (i.product!.price * i.quantity), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <Button size="lg" onClick={handleAddToCart}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add Valid Items to Cart
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FastOrder;
