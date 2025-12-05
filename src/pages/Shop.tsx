import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardList } from "@/components/ProductCardList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { mockProducts, categories, tags } from "@/data/mockData";
import { SlidersHorizontal, ChevronDown, ChevronUp, Grid3x3, List, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [openCategories, setOpenCategories] = useState<string[]>(() => {
    // Auto-expand categories if one is selected from URL
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const category = categories.find(c => c.slug === categoryParam);
      if (category) {
        const expandedIds: string[] = [];
        let current = category;
        while (current?.parentId) {
          expandedIds.push(current.parentId);
          current = categories.find(c => c.id === current?.parentId) as typeof category;
        }
        return expandedIds;
      }
    }
    return [];
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (searchParams.get("view") as "grid" | "list") || "grid"
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const itemsPerPage = 32;

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    if (sortBy !== "featured") params.set("sort", sortBy);
    if (viewMode !== "grid") params.set("view", viewMode);
    if (searchQuery) params.set("search", searchQuery);
    if (currentPage > 1) params.set("page", currentPage.toString());
    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedTags, sortBy, viewMode, searchQuery, currentPage]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parentId === parentId);
  };

  const getAllDescendantSlugs = (categoryId: string): string[] => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    const slugs = [category.slug];
    const children = getSubcategories(categoryId);
    
    children.forEach(child => {
      slugs.push(...getAllDescendantSlugs(child.id));
    });
    
    return slugs;
  };

  const handleCategorySelect = (categorySlug: string) => {
    if (selectedCategory === categorySlug) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categorySlug);
    }
    setCurrentPage(1);
  };

  let filteredProducts = mockProducts;

  // Filter by selected category (includes all descendants)
  if (selectedCategory) {
    const category = categories.find(cat => cat.slug === selectedCategory);
    if (category) {
      const descendantSlugs = getAllDescendantSlugs(category.id);
      filteredProducts = filteredProducts.filter(p => 
        descendantSlugs.includes(p.category) || 
        descendantSlugs.includes(p.subcategory || '')
      );
    }
  }

  // Filter by tags
  if (selectedTags.length > 0) {
    filteredProducts = filteredProducts.filter(p =>
      p.tags?.some(tag => selectedTags.includes(tag))
    );
  }

  // Filter by search query
  if (searchQuery.trim()) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
        return 0; // Would need created_at field
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const FilterContent = () => (
    <>
      <div className="mb-6">
        <div className="space-y-0.5">
          {/* All Products option */}
          <div 
            className="flex items-center py-1.5 cursor-pointer"
            onClick={() => {
              setSelectedCategory(null);
              setCurrentPage(1);
            }}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              selectedCategory === null ? 'border-primary' : 'border-muted-foreground/40'
            }`}>
              {selectedCategory === null && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <span className="text-sm ml-2">All Products</span>
          </div>

          {/* Special categories */}
          {["Special Offers", "Featured Products", "New Products"].map((name) => {
            const slug = name.toLowerCase().replace(/ /g, "-");
            const isSelected = selectedCategory === slug;
            return (
              <div 
                key={slug}
                className="flex items-center py-1.5 cursor-pointer"
                onClick={() => handleCategorySelect(slug)}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-primary' : 'border-muted-foreground/40'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="text-sm ml-2">{name}</span>
              </div>
            );
          })}

          {categories.filter(cat => !cat.parentId).map((category) => {
            const level2Categories = getSubcategories(category.id);
            const hasSubcategories = level2Categories.length > 0;
            const isSelected = selectedCategory === category.slug;
            const isOpen = openCategories.includes(category.id);
            
            return (
              <div key={category.id}>
                <div className="flex items-center py-1.5 cursor-pointer">
                  <div 
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary' : 'border-muted-foreground/40'
                    }`}
                    onClick={() => {
                      handleCategorySelect(category.slug);
                      if (hasSubcategories && !isOpen) toggleCategory(category.id);
                    }}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span 
                    className="text-sm ml-2 flex-1"
                    onClick={() => {
                      handleCategorySelect(category.slug);
                      if (hasSubcategories && !isOpen) toggleCategory(category.id);
                    }}
                  >
                    {category.name}
                  </span>
                  {hasSubcategories && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category.id);
                      }}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  )}
                </div>

                {/* Level 2 Subcategories */}
                {hasSubcategories && isOpen && (
                  <div className="ml-6 space-y-0.5">
                    {level2Categories.map((subcat) => {
                      const level3Categories = getSubcategories(subcat.id);
                      const hasLevel3 = level3Categories.length > 0;
                      const isSubSelected = selectedCategory === subcat.slug;
                      const isSubOpen = openCategories.includes(subcat.id);
                      
                      return (
                        <div key={subcat.id}>
                          <div className="flex items-center py-1 cursor-pointer">
                            <div 
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                isSubSelected ? 'border-primary' : 'border-muted-foreground/40'
                              }`}
                              onClick={() => {
                                handleCategorySelect(subcat.slug);
                                if (hasLevel3 && !isSubOpen) toggleCategory(subcat.id);
                              }}
                            >
                              {isSubSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                            </div>
                            <span 
                              className="text-sm ml-2 flex-1"
                              onClick={() => {
                                handleCategorySelect(subcat.slug);
                                if (hasLevel3 && !isSubOpen) toggleCategory(subcat.id);
                              }}
                            >
                              {subcat.name}
                            </span>
                            {hasLevel3 && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCategory(subcat.id);
                                }}
                                className="p-1 hover:bg-muted rounded"
                              >
                                {isSubOpen ? (
                                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Level 3 Sub-subcategories */}
                          {hasLevel3 && isSubOpen && (
                            <div className="ml-6 space-y-0.5">
                              {level3Categories.map((subsubcat) => {
                                const level4Categories = getSubcategories(subsubcat.id);
                                const hasLevel4 = level4Categories.length > 0;
                                const isSubSubSelected = selectedCategory === subsubcat.slug;
                                const isSubSubOpen = openCategories.includes(subsubcat.id);
                                
                                return (
                                  <div key={subsubcat.id}>
                                    <div className="flex items-center py-1 cursor-pointer">
                                      <div 
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                          isSubSubSelected ? 'border-primary' : 'border-muted-foreground/40'
                                        }`}
                                        onClick={() => {
                                          handleCategorySelect(subsubcat.slug);
                                          if (hasLevel4 && !isSubSubOpen) toggleCategory(subsubcat.id);
                                        }}
                                      >
                                        {isSubSubSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                                      </div>
                                      <span 
                                        className="text-sm ml-2 flex-1"
                                        onClick={() => {
                                          handleCategorySelect(subsubcat.slug);
                                          if (hasLevel4 && !isSubSubOpen) toggleCategory(subsubcat.id);
                                        }}
                                      >
                                        {subsubcat.name}
                                      </span>
                                      {hasLevel4 && (
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCategory(subsubcat.id);
                                          }}
                                          className="p-1 hover:bg-muted rounded"
                                        >
                                          {isSubSubOpen ? (
                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                          ) : (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                          )}
                                        </button>
                                      )}
                                    </div>

                                    {/* Level 4 */}
                                    {hasLevel4 && isSubSubOpen && (
                                      <div className="ml-6 space-y-0.5">
                                        {level4Categories.map((l4cat) => {
                                          const isL4Selected = selectedCategory === l4cat.slug;
                                          return (
                                            <div 
                                              key={l4cat.id}
                                              className="flex items-center py-1 cursor-pointer"
                                              onClick={() => handleCategorySelect(l4cat.slug)}
                                            >
                                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                isL4Selected ? 'border-primary' : 'border-muted-foreground/40'
                                              }`}>
                                                {isL4Selected && <div className="w-2 h-2 rounded-full bg-primary" />}
                                              </div>
                                              <span className="text-sm ml-2">{l4cat.name}</span>
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

      <Separator />

      {/* Tags */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Tags</h3>
        <div className="space-y-2">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox
                id={tag.id}
                checked={selectedTags.includes(tag.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTags([...selectedTags, tag.id]);
                  } else {
                    setSelectedTags(selectedTags.filter(t => t !== tag.id));
                  }
                  setCurrentPage(1);
                }}
              />
              <Label htmlFor={tag.id} className="text-sm font-normal cursor-pointer">
                {tag.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full mt-6" 
        onClick={() => {
          setSelectedCategory(null);
          setSelectedTags([]);
          setSearchQuery("");
          setCurrentPage(1);
        }}
      >
        Clear Filters
      </Button>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">All Products</h1>
          <p className="text-sm md:text-base text-muted-foreground">Browse our complete range of wholesale food products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {(selectedCategory || selectedTags.length > 0) && (
                    <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                      {(selectedCategory ? 1 : 0) + selectedTags.length}
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
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
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
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price-low">Price - Low to High</SelectItem>
                    <SelectItem value="price-high">Price - High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentProducts.map((product) => (
                  <ProductCardList key={product.id} product={product} />
                ))}
              </div>
            )}

            {sortedProducts.length === 0 && (
              <div className="text-center py-12 md:py-16">
                <p className="text-base md:text-lg text-muted-foreground">No products found matching your filters.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedTags([]);
                    setSearchQuery("");
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
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      // Show first page, last page, current page, and pages around current
                      const showPage = 
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2);
                      
                      // Show ellipsis
                      const showEllipsisBefore = page === currentPage - 3 && currentPage > 4;
                      const showEllipsisAfter = page === currentPage + 3 && currentPage < totalPages - 3;
                      
                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      
                      if (!showPage) return null;
                      
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className={`cursor-pointer min-w-[40px] ${
                              currentPage === page 
                                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                : "hover:bg-primary/10"
                            }`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
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
