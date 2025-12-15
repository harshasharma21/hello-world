import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { categories, tags } from "@/data/mockData";
import { ChevronRight, ChevronDown, SlidersHorizontal, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useProducts, getProductImageUrl, DbProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import {
  getCategorySlugFromGroupCode,
  getCategoryBySlug,
  getCategoryById,
  buildCategoryPath,
  buildProductPath,
  getAllDescendantSlugs,
  getSubcategories,
} from "@/utils/categoryMapping";

// Reverse mapping: category slug to GroupCodes
const categorySlugToGroupCodes: Record<string, string[]> = {
  "fruit-veg-salad-pulses": ["FRUIT & VEG"],
  "food-cupboard": ["GROCERY", "GENERAL", "FROZEN"],
  "soft-drinks-better": ["SOFT DRINKS"],
  "crisps-savoury": ["SNACKS"],
  "coffee-tea-hot-drinks": ["TEA & COFFEE", "COFFEE & TEA"],
  "chocolate-confectionery": ["CHOCOLATE & SWEETS"],
  "dairy": ["DAIRY"],
  "bakery": ["BAKERY"],
  "drinks": ["DRINKS", "SOFT DRINKS"],
  "snacking": ["SNACKS", "CHOCOLATE & SWEETS"],
  "meat-fish": ["MEAT & FISH"],
  "table-sauces-condiments": ["CONDIMENTS"],
  "oils-vinegar": ["OILS"],
  "pasta-rice-noodles": ["PASTA"],
  "sauces-pastes": ["SAUCES"],
  "syrup-honey": ["HONEY"],
  "breakfast-cereals": ["CEREALS"],
  "baby-child": ["BABY"],
  "hygiene-health-pets": ["HEALTH"],
};

// Get all GroupCodes for a category and its descendants
const getGroupCodesForCategory = (categorySlug: string): string[] => {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];

  const descendantSlugs = getAllDescendantSlugs(category.id);
  const groupCodes = new Set<string>();

  descendantSlugs.forEach((slug) => {
    const codes = categorySlugToGroupCodes[slug] || [];
    codes.forEach((code) => groupCodes.add(code));
  });

  // Also add direct mapping
  const directCodes = categorySlugToGroupCodes[categorySlug] || [];
  directCodes.forEach((code) => groupCodes.add(code));

  return Array.from(groupCodes);
};

// Product Card for category page
const CategoryProductCard = ({ product }: { product: DbProduct }) => {
  const { addItem } = useCart();
  const imageUrl = getProductImageUrl(product.barcode);
  const categorySlug = getCategorySlugFromGroupCode(product.group_code);
  const productPath = buildProductPath(product.id, categorySlug);

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
        <Link to={productPath}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-2">{product.barcode}</p>
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

const Category = () => {
  const { "*": fullPath } = useParams();
  const navigate = useNavigate();

  // Parse the path
  const pathParts = fullPath?.split("/").filter(Boolean) || [];

  // Check if this is a product detail page
  const productIndex = pathParts.indexOf("product");
  if (productIndex !== -1) {
    return null; // ProductDetail will handle this
  }

  // Get the last part to find current category
  const lastSlug = pathParts[pathParts.length - 1];
  const category = getCategoryBySlug(lastSlug);

  // State
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>(() => {
    if (category) {
      const expandedIds: string[] = [category.id];
      let current = category;
      while (current?.parentId) {
        expandedIds.push(current.parentId);
        current = getCategoryById(current.parentId);
      }
      return expandedIds;
    }
    return [];
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch all products
  const { data: allProducts = [], isLoading } = useProducts({
    search: searchQuery || undefined,
  });

  // Filter products by category's GroupCodes
  const categoryProducts = useMemo(() => {
    if (!category) return [];

    const validGroupCodes = getGroupCodesForCategory(category.slug);
    if (validGroupCodes.length === 0) return allProducts;

    return allProducts.filter((p) => {
      const productGroupCode = p.group_code?.trim().toUpperCase();
      return validGroupCodes.some(
        (code) => code.toUpperCase() === productGroupCode
      );
    });
  }, [allProducts, category]);

  // Build breadcrumb chain
  const buildBreadcrumbChain = () => {
    if (!category) return [];

    const chain: typeof categories = [];
    let current = category;

    while (current) {
      chain.unshift(current);
      if (current.parentId) {
        current = getCategoryById(current.parentId);
      } else {
        break;
      }
    }

    return chain;
  };

  const breadcrumbChain = buildBreadcrumbChain();

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (cat: typeof category) => {
    if (cat) {
      navigate(buildCategoryPath(cat.slug));
    }
  };

  const FilterContent = () => (
    <>
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-4">Categories</h2>
        <div className="space-y-1">
          <Link
            to="/shop"
            className="flex items-center space-x-2 py-1.5 px-2 rounded cursor-pointer transition-colors hover:bg-muted"
          >
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <span className="text-sm font-medium">All Products</span>
          </Link>

          {categories
            .filter((cat) => !cat.parentId)
            .map((cat) => {
              const level2Categories = getSubcategories(cat.id);
              const hasSubcategories = level2Categories.length > 0;
              const isSelected = category?.id === cat.id;
              const descendantSlugs = getAllDescendantSlugs(cat.id);
              const isChildSelected =
                category && descendantSlugs.includes(category.slug);

              return (
                <div key={cat.id} className="space-y-0.5">
                  <div
                    className={`flex items-center py-1.5 px-2 rounded cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      handleCategoryClick(cat);
                      if (hasSubcategories) toggleCategory(cat.id);
                    }}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isSelected || isChildSelected
                          ? "bg-primary"
                          : "bg-muted-foreground/30"
                      }`}
                    />
                    <span className="text-sm ml-2 flex-1">{cat.name}</span>
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
                        const isSubSelected = category?.id === subcat.id;
                        const subDescendantSlugs = getAllDescendantSlugs(subcat.id);
                        const isSubChildSelected =
                          category && subDescendantSlugs.includes(category.slug);

                        return (
                          <div key={subcat.id} className="space-y-0.5">
                            <div
                              className={`flex items-center py-1 px-2 rounded cursor-pointer transition-colors ${
                                isSubSelected
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => {
                                handleCategoryClick(subcat);
                                if (hasLevel3) toggleCategory(subcat.id);
                              }}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isSubSelected || isSubChildSelected
                                    ? "bg-primary"
                                    : "bg-muted-foreground/30"
                                }`}
                              />
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
                                  const isSubSubSelected =
                                    category?.id === subsubcat.id;
                                  return (
                                    <div
                                      key={subsubcat.id}
                                      className={`flex items-center space-x-2 py-1 px-2 ml-5 rounded cursor-pointer transition-colors ${
                                        isSubSubSelected
                                          ? "bg-primary/10 text-primary"
                                          : "hover:bg-muted"
                                      }`}
                                      onClick={() => handleCategoryClick(subsubcat)}
                                    >
                                      <div
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          isSubSubSelected
                                            ? "bg-primary"
                                            : "bg-muted-foreground/30"
                                        }`}
                                      />
                                      <span className="text-sm text-muted-foreground">
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
                    setSelectedTags(selectedTags.filter((t) => t !== tag.id));
                  }
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
          setSelectedTags([]);
          setSearchQuery("");
        }}
      >
        Clear Filters
      </Button>
    </>
  );

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <Link to="/shop" className="text-primary hover:underline">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-neutral-50 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm flex-wrap">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link
                to="/shop"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Shop
              </Link>
              {breadcrumbChain.map((cat, index) => (
                <span key={cat.id} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  {index === breadcrumbChain.length - 1 ? (
                    <span className="font-medium text-foreground">{cat.name}</span>
                  ) : (
                    <Link
                      to={buildCategoryPath(cat.slug)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {cat.name}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>

        {/* Category Header */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-sm text-muted-foreground">
              {categoryProducts.length} products available
            </p>
          </div>
        </section>

        {/* Products with Sidebar */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {selectedTags.length > 0 && (
                      <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        {selectedTags.length}
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
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search in this category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 h-11 w-full"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              ) : categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <CategoryProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">
                    No products available in this category
                    {searchQuery ? ` matching "${searchQuery}"` : ""}.
                  </p>
                  {searchQuery ? (
                    <Button variant="link" onClick={() => setSearchQuery("")} className="mt-4">
                      Clear search
                    </Button>
                  ) : (
                    <Link to="/shop" className="text-primary hover:underline">
                      Browse all products
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Category;
