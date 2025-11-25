import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { mockProducts, categories } from "@/data/mockData";
import { SlidersHorizontal } from "lucide-react";

const Shop = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = selectedCategories.length > 0
    ? mockProducts.filter(p => selectedCategories.includes(p.category))
    : mockProducts;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">Browse our complete range of wholesale food products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="font-semibold text-lg">Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.filter(cat => !cat.parentId).map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.slug}
                          checked={selectedCategories.includes(category.slug)}
                          onCheckedChange={(checked) => {
                            setSelectedCategories(
                              checked
                                ? [...selectedCategories, category.slug]
                                : selectedCategories.filter(c => c !== category.slug)
                            );
                          }}
                        />
                        <Label
                          htmlFor={category.slug}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {category.name} ({category.productCount})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Stock Status */}
                <div>
                  <h3 className="font-semibold mb-3">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="in-stock" defaultChecked />
                      <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                        In Stock
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="out-of-stock" />
                      <Label htmlFor="out-of-stock" className="text-sm font-normal cursor-pointer">
                        Out of Stock
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6" onClick={() => setSelectedCategories([])}>
                Clear Filters
              </Button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {sortedProducts.length} products
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">No products found matching your filters.</p>
                <Button variant="link" onClick={() => setSelectedCategories([])} className="mt-4">
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
