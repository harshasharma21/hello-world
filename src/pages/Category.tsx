import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts, categories } from "@/data/mockData";
import { ChevronRight } from "lucide-react";

const Category = () => {
  const { slug } = useParams();
  
  // Extract ID from slug (format: category-name-123)
  const categoryId = slug?.split('-').pop() || '';
  const category = categories.find(c => c.id === categoryId);
  
  const categoryProducts = mockProducts.filter(p => {
    if (category?.slug) {
      return p.category === category.slug || p.subcategory === category.slug;
    }
    return false;
  });

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

  // Find parent category if exists
  const parentCategory = category.parentId 
    ? categories.find(c => c.id === category.parentId)
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-neutral-50 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-smooth">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-smooth">
                Shop
              </Link>
              {parentCategory && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    to={`/shop/category/${parentCategory.slug}-${parentCategory.id}`}
                    className="text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {parentCategory.name}
                  </Link>
                </>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{category.name}</span>
            </nav>
          </div>
        </div>

        {/* Category Header */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-muted-foreground">
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
