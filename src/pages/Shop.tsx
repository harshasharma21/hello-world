import { useState } from "react";
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
import { SlidersHorizontal, ChevronDown, ChevronRight, Grid3x3, List, Search } from "lucide-react";
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 32;

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
        <h2 className="font-semibold text-lg mb-4">Categories</h2>
        <div className="space-y-1">
          {/* All Products option */}
          <div 
            className={`flex items-center space-x-2 py-1.5 px-2 rounded cursor-pointer transition-colors ${
              selectedCategory === null ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
            }`}
            onClick={() => {
              setSelectedCategory(null);
              setCurrentPage(1);
            }}
          >
            <div className={`w-2 h-2 rounded-full ${selectedCategory === null ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
            <span className="text-sm font-medium">All Products</span>
          </div>

          {categories.filter(cat => !cat.parentId).map((category) => {
            const level2Categories = getSubcategories(category.id);
            const hasSubcategories = level2Categories.length > 0;
            const isSelected = selectedCategory === category.slug;
            const descendantSlugs = getAllDescendantSlugs(category.id);
            const isChildSelected = selectedCategory && descendantSlugs.includes(selectedCategory);
            
            return (
              <div key={category.id} className="space-y-0.5">
                <div className="flex items-center">
                  <div 
                    className={`flex items-center space-x-2 flex-1 py-1.5 px-2 rounded cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => handleCategorySelect(category.slug)}
                  >
                    <div className={`w-2 h-2 rounded-full ${isSelected || isChildSelected ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  {hasSubcategories && (
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {openCategories.includes(category.id) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>

                {/* Level 2 Subcategories */}
                {hasSubcategories && openCategories.includes(category.id) && (
                  <div className="ml-5 space-y-0.5">
                    {level2Categories.map((subcat) => {
                      const level3Categories = getSubcategories(subcat.id);
                      const hasLevel3 = level3Categories.length > 0;
                      const isSubSelected = selectedCategory === subcat.slug;
                      const subDescendantSlugs = getAllDescendantSlugs(subcat.id);
                      const isSubChildSelected = selectedCategory && subDescendantSlugs.includes(selectedCategory);
                      
                      return (
                        <div key={subcat.id} className="space-y-0.5">
                          <div className="flex items-center">
                            <div 
                              className={`flex items-center space-x-2 flex-1 py-1 px-2 rounded cursor-pointer transition-colors ${
                                isSubSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                              }`}
                              onClick={() => handleCategorySelect(subcat.slug)}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${isSubSelected || isSubChildSelected ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                              <span className="text-sm text-muted-foreground">{subcat.name}</span>
                            </div>
                            {hasLevel3 && (
                              <button
                                onClick={() => toggleCategory(subcat.id)}
                                className="p-1 hover:bg-muted rounded"
                              >
                                {openCategories.includes(subcat.id) ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Level 3 Sub-subcategories */}
                          {hasLevel3 && openCategories.includes(subcat.id) && (
                            <div className="ml-5 space-y-0.5">
                              {level3Categories.map((subsubcat) => {
                                const isSubSubSelected = selectedCategory === subsubcat.slug;
                                return (
                                  <div 
                                    key={subsubcat.id} 
                                    className={`flex items-center space-x-2 py-1 px-2 ml-5 rounded cursor-pointer transition-colors ${
                                      isSubSubSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                                    }`}
                                    onClick={() => handleCategorySelect(subsubcat.slug)}
                                  >
                                    <div className={`w-1.5 h-1.5 rounded-full ${isSubSubSelected ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                    <span className="text-sm text-muted-foreground">{subsubcat.name}</span>
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

      <Separator className="my-6" />

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
            <div className="sticky top-24">
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
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
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
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
