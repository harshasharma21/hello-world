import { useState, useMemo, useEffect } from "react";
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
import { SlidersHorizontal, Grid3x3, List, Search, ChevronRight, ChevronDown, ShoppingCart } from "lucide-react";
import { useProductsByCategory, ProductWithCategory } from "@/hooks/useNewProducts";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categories } from "@/data/mockData";
import { useCart } from "@/context/CartContext";

// Helper functions for category navigation
const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);
const getSubcategories = (parentId: string) => categories.filter(c => c.parentId === parentId);
const getRootCategories = () => categories.filter(c => !c.parentId);

const getAllDescendantSlugs = (categoryId: string): string[] => {
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return [];
  const slugs = [cat.slug];
  const children = categories.filter(c => c.parentId === categoryId);
  children.forEach(child => {
    slugs.push(...getAllDescendantSlugs(child.id));
  });
  return slugs;
};

const getAllDescendantNames = (categoryId: string): string[] => {
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return [];
  const names = [cat.name];
  const children = categories.filter(c => c.parentId === categoryId);
  children.forEach(child => {
    names.push(...getAllDescendantNames(child.id));
  });
  return names;
};

const buildCategoryPath = (slug: string): string => {
  const cat = getCategoryBySlug(slug);
  if (!cat) return "/shop";
  
  const chain: string[] = [];
  let current = cat;
  
  while (current) {
    chain.unshift(current.slug);
    if (current.parentId) {
      current = categories.find(c => c.id === current.parentId);
    } else {
      break;
    }
  }
  
  return `/shop/${chain.join("/")}`;
};

// Format barcode properly (handle scientific notation)
const formatBarcode = (barcode: number | null): string => {
  if (!barcode) return "";
  return barcode.toLocaleString("fullwide", { useGrouping: false });
};

// Get Open Food Facts image URL
const getProductImageUrl = (barcode: number | null): string => {
  if (!barcode) return "/placeholder.svg";
  const barcodeStr = formatBarcode(barcode);
  
  if (barcodeStr.length >= 13) {
    return `https://images.openfoodfacts.org/images/products/${barcodeStr.slice(0, 3)}/${barcodeStr.slice(3, 6)}/${barcodeStr.slice(6, 9)}/${barcodeStr.slice(9)}/front_en.3.400.jpg`;
  }
  return `https://images.openfoodfacts.org/images/products/${barcodeStr}/front_en.3.400.jpg`;
};

// Product Card component
const ShopProductCard = ({ product }: { product: ProductWithCategory }) => {
  const { addItem } = useCart();
  const imageUrl = getProductImageUrl(product.Barcode);
  const price = product.updated_price_website || 0;
  const taglines = product.information_taglines?.split("   ").filter(Boolean) || [];

  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id.toString(),
      sku: formatBarcode(product.Barcode),
      name: product.name || "Unknown",
      description: product.information_taglines || "",
      price: price,
      images: [imageUrl],
      category: product.categoryLevel1 || "",
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
            alt={product.name || "Product"}
            loading="lazy"
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/shop/product/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors mb-1">
            {product.name || "Unknown Product"}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-2">{formatBarcode(product.Barcode)}</p>
        {taglines.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {taglines.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
        {product.categoryLevel1 && (
          <p className="text-xs text-primary mb-2">{product.categoryLevel1}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">
            £{price.toFixed(2)}
          </span>
          <Button size="sm" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
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
  const itemsPerPage = 20;

  // Parse category from URL path
  const pathParts = fullPath?.split("/").filter(Boolean) || [];
  let selectedCategory = null;
  
  if (pathParts.length > 0 && pathParts[0] !== "product") {
    const lastPart = pathParts[pathParts.length - 1];
    selectedCategory = getCategoryBySlug(lastPart);
  }

  // Get category name for query
  const categoryNameForQuery = selectedCategory ? selectedCategory.name : null;

  // Fetch products (paginated) from newProducts table with latestCategories
  const startIndex = (currentPage - 1) * itemsPerPage;
  const { data: productsData = { items: [], total: 0 }, isLoading: productsLoading } = useProductsByCategory(
    categoryNameForQuery,
    itemsPerPage,
    startIndex
  );
  const products = productsData.items;
  const totalCount = productsData.total;
  const queryClient = useQueryClient();
  // Cache totals in sessionStorage to show instant counts while server requests complete
  const cacheKey = categoryNameForQuery ? `shop_total_${categoryNameForQuery}` : `shop_total_all`;
  const [cachedTotal, setCachedTotal] = useState<number | null>(() => {
    try {
      const v = sessionStorage.getItem(cacheKey);
      return v ? parseInt(v, 10) : null;
    } catch (e) {
      return null;
    }
  });

  // Update cache when server returns a non-zero total
  useEffect(() => {
    if (typeof totalCount === "number" && totalCount > 0) {
      try {
        sessionStorage.setItem(cacheKey, String(totalCount));
      } catch (e) {}
      setCachedTotal(totalCount);
    }
  }, [totalCount, cacheKey]);
  // When category changes, read cached value for new key
  useEffect(() => {
    try {
      const v = sessionStorage.getItem(cacheKey);
      setCachedTotal(v ? parseInt(v, 10) : null);
    } catch (e) {
      setCachedTotal(null);
    }
  }, [cacheKey]);

  // Filter products by search query (client-side within current page)
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name?.toLowerCase().includes(query) ||
      formatBarcode(p.Barcode).includes(query)
    );
  }, [products, searchQuery]);

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
    setCurrentPage(1);
    navigate(buildCategoryPath(slug));
  };

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.updated_price_website || 0) - (b.updated_price_website || 0);
        case "price-high":
          return (b.updated_price_website || 0) - (a.updated_price_website || 0);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  // Pagination (server-driven)
  const totalPages = Math.ceil((totalCount || 0) / itemsPerPage);
  const currentProducts = sortedProducts;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateParams({ page: page > 1 ? page.toString() : null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rootCategories = getRootCategories();
  
  // Build breadcrumb path from URL
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }];
    
    const pathParts = location.split('/').filter(Boolean);
    
    if (pathParts.length > 1 && pathParts[0] === 'shop') {
      const categoryParts = pathParts.slice(1);
      
      let currentPath = '/shop';
      categoryParts.forEach((part) => {
        if (part === 'product') return;
        currentPath += `/${part}`;
        
        const category = categories.find(c => c.slug === part);
        const categoryName = category?.name || part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
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
              setCurrentPage(1);
              navigate("/shop");
            }}
          >
            <div className={`w-2 h-2 rounded-full mr-3 ${!selectedCategory ? "bg-primary" : "bg-muted-foreground/30"}`} />
            <span className="text-sm">All Products</span>
            <span className="ml-auto text-xs text-muted-foreground">{!selectedCategory ? (cachedTotal ?? totalCount ?? products.length) : (products.length)}</span>
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
                                const level4Categories = getSubcategories(subsubcat.id);
                                const hasLevel4 = level4Categories.length > 0;
                                const isSubSubSelected = selectedCategory?.id === subsubcat.id;
                                const subSubDescendantSlugs = getAllDescendantSlugs(subsubcat.id);
                                const isSubSubChildSelected = selectedCategory && subSubDescendantSlugs.includes(selectedCategory.slug);

                                return (
                                  <div key={subsubcat.id} className="space-y-0.5">
                                    <div
                                      className={`flex items-center py-1 px-2 ml-3 rounded cursor-pointer transition-colors ${
                                        isSubSubSelected || isSubSubChildSelected
                                          ? "bg-primary/10 text-primary"
                                          : "hover:bg-muted"
                                      }`}
                                      onClick={() => {
                                        handleCategoryClick(subsubcat.slug);
                                        if (hasLevel4) toggleCategory(subsubcat.id);
                                      }}
                                    >
                                      <div className={`w-1.5 h-1.5 rounded-full ${isSubSubSelected || isSubSubChildSelected ? "bg-primary" : "bg-muted-foreground/30"}`} />
                                      <span className="text-sm text-muted-foreground ml-2 flex-1">
                                        {subsubcat.name}
                                      </span>
                                      {hasLevel4 && (
                                        <div className="ml-auto">
                                          {openCategories.includes(subsubcat.id) ? (
                                            <ChevronDown className="h-3 w-3" />
                                          ) : (
                                            <ChevronRight className="h-3 w-3" />
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {/* Level 4 */}
                                    {hasLevel4 && openCategories.includes(subsubcat.id) && (
                                      <div className="ml-8 space-y-0.5">
                                        {level4Categories.map((level4cat) => {
                                          const isLevel4Selected = selectedCategory?.id === level4cat.id;
                                          return (
                                            <div
                                              key={level4cat.id}
                                              className={`flex items-center py-1 px-2 rounded cursor-pointer transition-colors ${
                                                isLevel4Selected
                                                  ? "bg-primary/10 text-primary"
                                                  : "hover:bg-muted"
                                              }`}
                                              onClick={() => handleCategoryClick(level4cat.slug)}
                                            >
                                              <div className={`w-1 h-1 rounded-full ${isLevel4Selected ? "bg-primary" : "bg-muted-foreground/30"}`} />
                                              <span className="text-sm text-muted-foreground ml-2">
                                                {level4cat.name}
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
              {cachedTotal ?? totalCount ?? sortedProducts.length} products available
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
                  Showing {currentProducts.length} of {cachedTotal ?? totalCount ?? sortedProducts.length} products
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

                  {/* Pagination */}
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
