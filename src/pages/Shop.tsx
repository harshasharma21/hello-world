import { useState, useMemo } from "react";
import { useSearchParams, Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { SlidersHorizontal, Grid3x3, List, Search, ChevronRight, ChevronDown } from "lucide-react";
import { useProducts, DbProduct } from "@/hooks/useProducts";
import { useProductImage } from "@/hooks/useProductImage";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { categories } from "@/data/mockData";
import { 
  getCategorySlugFromGroupCode, 
  buildCategoryPath,
  getSubcategories,
  getRootCategories,
  getCategoryBySlug,
  getAllDescendantSlugs,
  getCategoryById,
} from "@/utils/categoryMapping";
import { buildProductPath } from "@/utils/productRoutes";
import { categorizeProduct } from "@/utils/productCategorizer";

// Product Card component with API-fetched image
const ShopProductCard = ({ product }: { product: DbProduct }) => {
  const { addItem } = useCart();
  const { imageUrl, isLoading: imageLoading } = useProductImage(product.barcode);
  const categorySlug = getCategorySlugFromGroupCode(product.group_code);
  
  const productPath = buildProductPath({
    id: product.id,
    category: categorySlug,
    subcategory: product.group_code,
    name: product.name,
    price: product.price,
    barcode: product.barcode,
  } as any);

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
      <Link to={productPath} className="block">
        <div className="aspect-square bg-muted relative overflow-hidden">
          {imageLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={productPath}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-2">{product.barcode}</p>
        {categorySlug && (
          <Link
            to={buildCategoryPath(categorySlug)}
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
  const { "*": fullPath } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = window.location.pathname;

  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const itemsPerPage = 20; // Changed from 32 to 20 (4 columns × 5 rows)

  // Parse category from URL path
  const pathParts = fullPath?.split("/").filter(Boolean) || [];
  let selectedCategory = null;
  
  if (pathParts.length > 0 && pathParts[0] !== "product") {
    const lastPart = pathParts[pathParts.length - 1];
    selectedCategory = getCategoryBySlug(lastPart);
  }

  // Fetch all products from Supabase
  const { data: products = [], isLoading: productsLoading } = useProducts({
    search: searchQuery || undefined,
  });

  // Filter products by category if selected
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return products;
    }

    // Get all descendant slugs for this category
    const descendantSlugs = getAllDescendantSlugs(selectedCategory.id);
    
    // Filter products that match this category or any of its descendants
    return products.filter((p) => {
      const productCategorySlug = categorizeProduct(p.name);
      return descendantSlugs.includes(productCategorySlug);
    });
  }, [products, selectedCategory]);

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

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (slug: string) => {
    setCurrentPage(1); // Reset to page 1 when changing category
    navigate(buildCategoryPath(slug));
  };

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
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
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateParams({ page: page > 1 ? page.toString() : null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rootCategories = getRootCategories();
  
  // Build breadcrumb path from URL
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }];
    
    // Extract category path from URL
    const pathParts = location.split('/').filter(Boolean);
    
    if (pathParts.length > 1 && pathParts[0] === 'shop') {
      const categoryParts = pathParts.slice(1);
      
      // Build breadcrumb for each category level
      let currentPath = '/shop';
      categoryParts.forEach((part) => {
        currentPath += `/${part}`;
        
        // Find the category name from slug
        const category = categories.find(c => c.slug === part);
        const categoryName = category?.name || part.replace(/-/g, ' ').toUpperCase();
        
        breadcrumbs.push({
          name: categoryName,
          path: currentPath
        });
      });
    }
    
    return breadcrumbs;
  };

  const FilterContent = () => (
    <>
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-4">Categories</h2>
        <div className="space-y-1">
          {/* All Products */}
          <div 
            className={`flex items-center py-2 px-3 rounded cursor-pointer transition-colors ${
              !selectedCategory 
                ? "bg-primary/10 text-primary font-medium" 
                : "hover:bg-muted"
            }`}
            onClick={() => {
              setCurrentPage(1); // Reset page
              navigate("/shop");
            }}
          >
            <div className={`w-2 h-2 rounded-full mr-3 ${!selectedCategory ? "bg-primary" : "bg-muted-foreground/30"}`} />
            <span className="text-sm">All Products</span>
            <span className="ml-auto text-xs text-muted-foreground">{products.length}</span>
          </div>

          {/* Hierarchical Categories */}
          {rootCategories.map((cat) => {
            const level2Categories = getSubcategories(cat.id);
            const hasSubcategories = level2Categories.length > 0;
            const isSelected = selectedCategory?.id === cat.id;
            const descendantSlugs = getAllDescendantSlugs(cat.id);
            const isChildSelected = selectedCategory && descendantSlugs.includes(selectedCategory.slug);

            return (
              <div key={cat.id} className="space-y-0.5">
                <div
                  className={`flex items-center py-2 px-3 rounded cursor-pointer transition-colors ${
                    isSelected || isChildSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => {
                    handleCategoryClick(cat.slug);
                    if (hasSubcategories) toggleCategory(cat.id);
                  }}
                >
                  <div className={`w-2 h-2 rounded-full mr-3 ${isSelected || isChildSelected ? "bg-primary" : "bg-muted-foreground/30"}`} />
                  <span className="text-sm flex-1">{cat.name}</span>
                  {hasSubcategories && (
                    <div className="ml-auto">
                      {openCategories.includes(cat.id) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </div>
                  )}
                </div>

                {/* Level 2 */}
                {hasSubcategories && openCategories.includes(cat.id) && (
                  <div className="ml-5 space-y-0.5">
                    {level2Categories.map((subcat) => {
                      const level3Categories = getSubcategories(subcat.id);
                      const hasLevel3 = level3Categories.length > 0;
                      const isSubSelected = selectedCategory?.id === subcat.id;
                      const subDescendantSlugs = getAllDescendantSlugs(subcat.id);
                      const isSubChildSelected = selectedCategory && subDescendantSlugs.includes(selectedCategory.slug);

                      return (
                        <div key={subcat.id} className="space-y-0.5">
                          <div
                            className={`flex items-center py-1 px-2 rounded cursor-pointer transition-colors ${
                              isSubSelected || isSubChildSelected
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => {
                              handleCategoryClick(subcat.slug);
                              if (hasLevel3) toggleCategory(subcat.id);
                            }}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${isSubSelected || isSubChildSelected ? "bg-primary" : "bg-muted-foreground/30"}`} />
                            <span className="text-sm text-muted-foreground ml-2 flex-1">
                              {subcat.name}
                            </span>
                            {hasLevel3 && (
                              <div className="ml-auto">
                                {openCategories.includes(subcat.id) ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Level 3 */}
                          {hasLevel3 && openCategories.includes(subcat.id) && (
                            <div className="ml-5 space-y-0.5">
                              {level3Categories.map((subsubcat) => {
                                const isSubSubSelected = selectedCategory?.id === subsubcat.id;
                                return (
                                  <div
                                    key={subsubcat.id}
                                    className={`flex items-center py-1 px-2 ml-3 rounded cursor-pointer transition-colors ${
                                      isSubSubSelected
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-muted"
                                    }`}
                                    onClick={() => handleCategoryClick(subsubcat.slug)}
                                  >
                                    <div className={`w-1.5 h-1.5 rounded-full ${isSubSubSelected ? "bg-primary" : "bg-muted-foreground/30"}`} />
                                    <span className="text-sm text-muted-foreground ml-2">
                                      {subsubcat.name}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full mt-6"
        onClick={() => {
          setSearchQuery("");
          setCurrentPage(1);
          updateParams({ search: null, page: null });
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
            <nav className="flex items-center gap-2 text-sm flex-wrap">
              {getBreadcrumbs().map((crumb, index) => (
                <div key={crumb.path} className="flex items-center gap-2">
                  <Link
                    to={crumb.path}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    {crumb.name}
                  </Link>
                  {index < getBreadcrumbs().length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              {selectedCategory ? selectedCategory.name : "All Products"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {sortedProducts.length} products available
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
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="h-full overflow-y-auto p-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-4 border-r border-border">
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
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                        : "space-y-4"
                    }
                  >
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
                          setSearchQuery("");
                          updateParams({ search: null });
                        }}
                        className="mt-4"
                      >
                        Clear search
                      </Button>
                    </div>
                  )}

                  {/* Pagination - Show for all cases when totalPages > 1 */}
                  {totalPages > 1 && sortedProducts.length > 0 && (
                    <div className="mt-12 space-y-4">
                      <div className="text-center text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                      <Pagination>
                        <PaginationContent className="flex-wrap gap-1">
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                              className={
                                currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                              }
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
                              onClick={() =>
                                currentPage < totalPages && handlePageChange(currentPage + 1)
                              }
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
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
