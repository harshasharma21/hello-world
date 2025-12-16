import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useProductImage } from "@/hooks/useProductImage";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { categories } from "@/data/mockData";
import {
  getCategorySlugFromGroupCode,
  buildCategoryPath,
  getCategoryBySlug,
  getAllDescendantSlugs,
} from "@/utils/categoryMapping";

// Related product card with API-fetched image
const RelatedProductCard = ({ product }: { product: any }) => {
  const { imageUrl, isLoading } = useProductImage(product.barcode);
  const categorySlug = getCategorySlugFromGroupCode(product.group_code);
  const productPath = buildCategoryPath(categorySlug) + `/product/${product.id}`;

  return (
    <Link to={productPath} className="group">
      <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        )}
      </div>
      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
        {product.name}
      </h3>
      <p className="text-primary font-bold mt-1">£{(product.price || 0).toFixed(2)}</p>
    </Link>
  );
};

interface ProductDetailProps {
  productId?: string;
}

const ProductDetail = ({ productId }: ProductDetailProps) => {
  const { id: paramId, "*": fullPath } = useParams();
  const id = productId || paramId;
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const { data: product, isLoading } = useProduct(id || "");
  const { imageUrl: productImage, isLoading: imageLoading } = useProductImage(product?.barcode || "");
  const { data: relatedProducts = [] } = useProducts({
    groupCode: product?.group_code || undefined,
    limit: 5,
  });

  // Filter out current product from related
  const filteredRelated = relatedProducts.filter((p) => p.id !== id).slice(0, 4);

  // Build breadcrumb from URL path
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { name: "Home", path: "/" },
      { name: "Shop", path: "/shop" },
    ];

    // Extract category path from URL
    // URL format: /shop/category1/category2/product/id
    const pathParts = fullPath?.split("/").filter(Boolean) || [];

    if (pathParts.length > 0) {
      const productIndex = pathParts.indexOf("product");

      // Get all parts before "product"
      const categoryParts =
        productIndex !== -1 ? pathParts.slice(0, productIndex) : pathParts;

      // Build breadcrumb for each category level
      let currentPath = "/shop";
      categoryParts.forEach((part) => {
        currentPath += `/${part}`;

        // Find the category name from slug
        const category = categories.find((c) => c.slug === part);
        const categoryName = category?.name || part.replace(/-/g, " ").toUpperCase();

        breadcrumbs.push({
          name: categoryName,
          path: currentPath,
        });
      });
    }

    // Add product name at the end
    if (product) {
      breadcrumbs.push({
        name: product.name,
        path: "",
      });
    }

    return breadcrumbs;
  };

  const handleAddToCart = () => {
    if (!product) return;

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
    toast.success(`Added ${quantity} x ${product.name} to cart`);
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-32 w-full" />
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
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
          </div>
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
        <div className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm flex-wrap">
              {getBreadcrumbs().map((crumb, index) => (
                <div key={crumb.path || crumb.name} className="flex items-center gap-2">
                  {crumb.path ? (
                    <Link
                      to={crumb.path}
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium">{crumb.name}</span>
                  )}
                  {index < getBreadcrumbs().length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-muted rounded-lg overflow-hidden">
              {imageLoading ? (
                <Skeleton className="w-full h-full aspect-square" />
              ) : (
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground">{product.barcode}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary">
                  £{(product.price || 0).toFixed(2)}
                </span>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  In Stock
                </span>
              </div>

              <p className="text-muted-foreground text-lg">
                {product.group_code}
              </p>

              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <label className="text-sm font-medium block mb-2">Quantity</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      −
                    </Button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border border-border rounded px-2 py-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="lg"
                    onClick={handleToggleLike}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {filteredRelated.length > 0 && (
            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRelated.map((product) => (
                  <RelatedProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
