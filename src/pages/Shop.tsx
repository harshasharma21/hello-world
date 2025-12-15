import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal, Grid3x3, List, Search, ChevronRight } from "lucide-react";
import { useProducts, useGroupCodes, getProductImageUrl, DbProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Simple Product Card for Supabase products
const ShopProductCard = ({ product }: { product: DbProduct }) => {
  const { addItem } = useCart();
  const imageUrl = getProductImageUrl(product.barcode);
  
  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id,
      sku: product.barcode,
      name: product.name,
      description: product.group_code || "",
      price: product.price || 0,
      images: [imageUrl],
      category: product.group_code || "",
      stock: 100,
      inStock: true,
    };
    addItem(cartProduct as any, 1);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all">
      <Link to={`/shop/product/${product.id}`} className="block">
        <div className="aspect-square bg-muted relative overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/shop/product/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-2">
          {product.barcode}
        </p>
        {product.group_code && (
          <Link 
            to={`/shop?category=${encodeURIComponent(product.group_code)}`}
            className="text-xs text-primary hover:underline"
          >
            {product.group_code}
          </Link>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">
            £{(product.price || 0).toFixed(2)}
          </span>
          <Button size="sm" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const itemsPerPage = 32;

  // Fetch products and categories from Supabase
  const { data: products = [], isLoading: productsLoading } = useProducts({
    groupCode: selectedCategory || undefined,
    search: searchQuery || undefined,
  });
  const { data: groupCodes = [], isLoading: categoriesLoading } = useGroupCodes();

  // Update URL params
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params, { replace: true });
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateParams({ category, page: null });
  };

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [products, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateParams({ page: page > 1 ? page.toString() : null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const FilterContent = () => (
    <>
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-4">Categories</h2>
        <div className="space-y-1">
          {/* All Products */}
          <div 
            className={`flex items-center py-2 px-3 rounded cursor-pointer transition-colors ${
              !selectedCategory ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
            }`}
            onClick={() => handleCategorySelect(null)}
          >
            <div className={`w-2 h-2 rounded-full mr-3 ${!selectedCategory ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
            <span className="text-sm">All Products</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {products.length}
            </span>
          </div>

          {categoriesLoading ? (
            <div className="space-y-2 mt-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            groupCodes.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <div 
                  key={category}
                  className={`flex items-center py-2 px-3 rounded cursor-pointer transition-colors ${
                    isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className={`w-2 h-2 rounded-full mr-3 ${isSelected ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                  <span className="text-sm">{category}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full mt-6" 
        onClick={() => {
          setSelectedCategory(null);
          setSearchQuery("");
          setCurrentPage(1);
          updateParams({ category: null, search: null, page: null });
        }}
      >
        Clear Filters
      </Button>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              {selectedCategory ? (
                <>
                  <Link to="/shop" className="text-muted-foreground hover:text-foreground">
                    Shop
                  </Link>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{selectedCategory}</span>
                </>
              ) : (
                <span className="font-medium text-foreground">Shop</span>
              )}
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              {selectedCategory || "All Products"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {selectedCategory 
                ? `Browse products in ${selectedCategory}`
                : "Browse our complete range of products"
              }
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {selectedCategory && (
                      <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        1
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <FilterContent />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
                <FilterContent />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                      updateParams({ search: e.target.value || null, page: null });
                    }}
                    className="pl-10 pr-4 h-11 w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <p className="text-xs text-muted-foreground">
                  Showing {currentProducts.length} of {sortedProducts.length} products
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex border border-border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="rounded-none"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className="rounded-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="price-low">Price - Low to High</SelectItem>
                      <SelectItem value="price-high">Price - High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-card rounded-lg border overflow-hidden">
                      <Skeleton className="aspect-square w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-8 w-full mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    : "space-y-4"
                  }>
                    {currentProducts.map((product) => (
                      <ShopProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {sortedProducts.length === 0 && (
                    <div className="text-center py-12 md:py-16">
                      <p className="text-base md:text-lg text-muted-foreground">
                        No products found{searchQuery ? ` matching "${searchQuery}"` : ""}.
                      </p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSelectedCategory(null);
                          setSearchQuery("");
                          updateParams({ category: null, search: null });
                        }} 
                        className="mt-4"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}

                  {/* Pagination */}
                  {sortedProducts.length > 0 && totalPages > 1 && (
                    <div className="mt-12 space-y-4">
                      <div className="text-center text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                      <Pagination>
                        <PaginationContent className="flex-wrap gap-1">
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            let page: number;
                            if (totalPages <= 5) {
                              page = i + 1;
                            } else if (currentPage <= 3) {
                              page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              page = totalPages - 4 + i;
                            } else {
                              page = currentPage - 2 + i;
                            }
                            
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => handlePageChange(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;