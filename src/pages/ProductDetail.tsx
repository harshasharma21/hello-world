import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ShoppingCart, Heart, Plus, Minus, Package, Truck, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useProduct, useProducts, getProductImageUrl, DbProduct } from "@/hooks/useProducts";
import { categories } from "@/data/mockData";
import {
  getCategorySlugFromGroupCode,
  getCategoryBySlug,
  getCategoryById,
  buildCategoryPath,
  buildProductPath,
} from "@/utils/categoryMapping";

// Related product card with proper links
const RelatedProductCard = ({ product }: { product: DbProduct }) => {
  const imageUrl = getProductImageUrl(product.barcode);
  const categorySlug = getCategorySlugFromGroupCode(product.group_code);
  const productPath = buildProductPath(product.id, categorySlug);

  return (
    <Link to={productPath} className="group">
      <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all">
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
        <div className="p-4">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-primary mt-2">
            £{(product.price || 0).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const { data: product, isLoading } = useProduct(id || "");
  const { data: relatedProducts = [] } = useProducts({
    groupCode: product?.group_code || undefined,
    limit: 5,
  });

  // Filter out current product from related
  const filteredRelated = relatedProducts.filter((p) => p.id !== id).slice(0, 4);

  // Build category breadcrumb chain
  const buildBreadcrumbChain = () => {
    if (!product?.group_code) return [];

    const categorySlug = getCategorySlugFromGroupCode(product.group_code);
    if (!categorySlug) return [];

    const category = getCategoryBySlug(categorySlug);
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
  const categorySlug = product ? getCategorySlugFromGroupCode(product.group_code) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/shop")}>Browse All Products</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const productImage = getProductImageUrl(product.barcode);

  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id,
      sku: product.barcode,
      name: product.name,
      description: product.group_code || "",
      price: product.price || 0,
      images: [productImage],
      category: product.group_code || "",
      stock: 100,
      inStock: true,
    };
    addItem(cartProduct as any, quantity);
    toast.success(`Added ${quantity}x ${product.name} to cart`);
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm flex-wrap">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
                Shop
              </Link>
              {breadcrumbChain.map((cat) => (
                <span key={cat.id} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    to={buildCategoryPath(cat.slug)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </span>
              ))}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground font-mono mb-2">
                  Barcode: {product.barcode}
                </p>
                {product.group_code && categorySlug && (
                  <Link to={buildCategoryPath(categorySlug)}>
                    <Badge variant="secondary" className="mb-3 cursor-pointer hover:bg-secondary/80">
                      {product.group_code}
                    </Badge>
                  </Link>
                )}
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
                {product.base_unit && (
                  <p className="text-muted-foreground">Unit: {product.base_unit}</p>
                )}
              </div>

              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-bold text-primary">
                  £{(product.price || 0).toFixed(2)}
                </p>
              </div>

              <Separator />

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-none"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 outline-none text-lg bg-transparent"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-none"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button size="lg" className="flex-1 h-12 text-base" onClick={handleAddToCart}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className={`h-12 w-12 ${isLiked ? "text-destructive" : ""}`}
                    onClick={handleToggleLike}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Bulk Orders</h4>
                    <p className="text-xs text-muted-foreground">Special pricing available</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Fast Delivery</h4>
                    <p className="text-xs text-muted-foreground">Next-day available</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Quality Assured</h4>
                    <p className="text-xs text-muted-foreground">Certified suppliers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {filteredRelated.length > 0 && categorySlug && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">Related Products</h2>
                <Button variant="outline" asChild>
                  <Link to={buildCategoryPath(categorySlug)}>View All</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRelated.map((relatedProduct) => (
                  <RelatedProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
