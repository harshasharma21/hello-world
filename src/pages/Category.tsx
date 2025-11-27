import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts, categories } from "@/data/mockData";
import { ChevronRight } from "lucide-react";

const Category = () => {
  const { "*": fullPath } = useParams();
  const navigate = useNavigate();
  
  // Parse the path - can be category, category/subcategory, or category/subcategory/subsubcategory
  const pathParts = fullPath?.split('/').filter(Boolean) || [];
  
  // Get the last part of the path to find the current category
  const lastSlug = pathParts[pathParts.length - 1];
  
  // Extract ID from slug if it follows the pattern: name-id
  const categoryId = lastSlug?.split('-').pop() || '';
  let category = categories.find(c => c.id === categoryId);
  
  // If not found by ID, try to find by slug directly
  if (!category) {
    category = categories.find(c => c.slug === lastSlug);
  }

  // Build full breadcrumb chain
  const buildBreadcrumbChain = () => {
    if (!category) return [];
    
    const chain: typeof categories = [];
    let current = category;
    
    while (current) {
      chain.unshift(current);
      if (current.parentId) {
        current = categories.find(c => c.id === current.parentId) as typeof category;
      } else {
        break;
      }
    }
    
    return chain;
  };

  const breadcrumbChain = buildBreadcrumbChain();

  // Get all descendant category slugs for filtering products
  const getAllDescendantSlugs = (catId: string): string[] => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return [];
    
    const slugs = [cat.slug];
    const children = categories.filter(c => c.parentId === catId);
    
    children.forEach(child => {
      slugs.push(...getAllDescendantSlugs(child.id));
    });
    
    return slugs;
  };

  const categoryProducts = category 
    ? mockProducts.filter(p => {
        const descendantSlugs = getAllDescendantSlugs(category!.id);
        return descendantSlugs.includes(p.category) || 
               descendantSlugs.includes(p.subcategory || '');
      })
    : [];

  // Build link path for a category in the breadcrumb
  const buildCategoryPath = (targetCategory: typeof category) => {
    if (!targetCategory) return '/shop';
    
    const chain: string[] = [];
    let current = targetCategory;
    
    while (current) {
      chain.unshift(`${current.slug}-${current.id}`);
      if (current.parentId) {
        current = categories.find(c => c.id === current.parentId) as typeof category;
      } else {
        break;
      }
    }
    
    return `/shop/category/${chain.join('/')}`;
  };

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
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
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
                      to={buildCategoryPath(cat)}
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

        {/* Products */}
        <section className="container mx-auto px-4 py-12">
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No products available in this category yet.
              </p>
              <Link to="/shop" className="text-primary hover:underline">
                Browse all products
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Category;
