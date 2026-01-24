import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { useNewProduct, useProductsByCategory, ProductWithCategory } from "@/hooks/useNewProducts";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { categories } from "@/data/mockData";

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

// Related product card
const RelatedProductCard = ({ product }: { product: ProductWithCategory }) => {
  const imageUrl = getProductImageUrl(product.Barcode);

  return (
    <Link to={`/shop/product/${product.id}`} className="group">
      <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
        <img
          src={imageUrl}
          alt={product.name || "Product"}
          loading="lazy"
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>
      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
        {product.name || "Unknown Product"}
      </h3>
      <p className="text-primary font-bold mt-1">£{(product.updated_price_website || 0).toFixed(2)}</p>
    </Link>
  );
};

interface ProductDetailProps {
  productId?: string;
}

const ProductDetail = ({ productId }: ProductDetailProps) => {
  const { id: paramId, "*": fullPath } = useParams();
  
  // Parse product ID from path if not provided directly
  let id = productId || paramId;
  if (!id && fullPath) {
    const parts = fullPath.split("/");
    const productIndex = parts.indexOf("product");
    if (productIndex !== -1 && parts[productIndex + 1]) {
      id = parts[productIndex + 1];
    }
  }
  
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const { data: product, isLoading } = useNewProduct(id ? parseInt(id, 10) : null);
  
  // Get related products from same category (server-paginated)
  const { data: relatedPaged = { items: [], total: 0 } } = useProductsByCategory(
    product?.categoryLevel1 || null,
    5,
    0
  );

  const relatedProducts: ProductWithCategory[] = relatedPaged.items || [];

  // Filter out current product from related
  const filteredRelated = relatedProducts
    .filter((p) => p.id.toString() !== id)
    .slice(0, 4);

  // Build breadcrumb from URL path
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { name: "Home", path: "/" },
      { name: "Shop", path: "/shop" },
    ];

    // Add category breadcrumbs from product's category levels
    if (product?.categoryLevel1) {
      const cat1 = categories.find(c => c.name === product.categoryLevel1);
      if (cat1) {
        breadcrumbs.push({ name: cat1.name, path: `/shop/${cat1.slug}` });
      }
    }
    if (product?.categoryLevel2) {
      const cat2 = categories.find(c => c.name === product.categoryLevel2);
      if (cat2) {
        breadcrumbs.push({ name: cat2.name, path: `/shop/${cat2.slug}` });
      }
    }
    if (product?.categoryLevel3) {
      const cat3 = categories.find(c => c.name === product.categoryLevel3);
      if (cat3) {
        breadcrumbs.push({ name: cat3.name, path: `/shop/${cat3.slug}` });
      }
    }
    if (product?.categoryLevel4) {
      const cat4 = categories.find(c => c.name === product.categoryLevel4);
      if (cat4) {
        breadcrumbs.push({ name: cat4.name, path: `/shop/${cat4.slug}` });
      }
    }

    // Add product name at the end
    if (product) {
      breadcrumbs.push({
        name: product.name || "Product",
        path: "",
      });
    }

    return breadcrumbs;
  };

  const handleAddToCart = () => {
    if (!product) return;

    const imageUrl = getProductImageUrl(product.Barcode);
    const cartProduct = {
      id: product.id.toString(),
      sku: formatBarcode(product.Barcode),
      name: product.name || "Unknown",
      description: product.information_taglines || "",
      price: product.updated_price_website || 0,
      images: [imageUrl],
      category: product.categoryLevel1 || "",
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

  const imageUrl = getProductImageUrl(product.Barcode);
  const price = product.updated_price_website || 0;
  const taglines = product.information_taglines?.split("   ").filter(Boolean) || [];

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
            <div className="flex items-center justify-center bg-muted rounded-lg overflow-hidden p-8">
              <img
                src={imageUrl}
                alt={product.name || "Product"}
                className="w-full h-full object-contain max-h-[500px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name || "Unknown Product"}</h1>
                <p className="text-muted-foreground">Barcode: {formatBarcode(product.Barcode)}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary">
                  £{price.toFixed(2)}
                </span>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  In Stock
                </span>
              </div>

              {taglines.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {taglines.map((tag, i) => (
                    <span key={i} className="text-sm bg-muted px-3 py-1 rounded-full text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Category Path */}
              <div className="text-sm text-muted-foreground">
                {product.categoryLevel1 && (
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {[product.categoryLevel1, product.categoryLevel2, product.categoryLevel3, product.categoryLevel4]
                      .filter(Boolean)
                      .join(" > ")}
                  </p>
                )}
              </div>

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
