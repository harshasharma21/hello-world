import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, DbProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import {
  getCategorySlugFromGroupCode,
  buildProductPath,
} from "@/utils/categoryMapping";

// Cache for product images from Open Food Facts API
const imageCache = new Map<string, string>();

// Fetch product image URL from Open Food Facts API
const fetchProductImage = async (barcode: string): Promise<string> => {
  // Check cache first
  if (imageCache.has(barcode)) {
    return imageCache.get(barcode)!;
  }

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    const data = await response.json();

    if (data.status === 1 && data.product?.image_url) {
      const imageUrl = data.product.image_url;
      imageCache.set(barcode, imageUrl);
      return imageUrl;
    }
  } catch (error) {
    console.log(`Failed to fetch image for barcode ${barcode}`);
  }

  // Fallback to placeholder
  return "/placeholder.svg";
};

// Product card with API-fetched image
const FeaturedProductCard = ({ product }: { product: DbProduct }) => {
  const { addItem } = useCart();
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg");
  const [imageLoading, setImageLoading] = useState(true);
  const categorySlug = getCategorySlugFromGroupCode(product.group_code);
  const productPath = buildProductPath(product.id, categorySlug);

  useEffect(() => {
    const loadImage = async () => {
      setImageLoading(true);
      const url = await fetchProductImage(product.barcode);
      setImageUrl(url);
      setImageLoading(false);
    };
    loadImage();
  }, [product.barcode]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <Link to={productPath} className="group block">
      <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
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
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1 flex-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">{product.barcode}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold text-primary">
              £{(product.price || 0).toFixed(2)}
            </span>
            <Button size="sm" onClick={handleAddToCart}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useProducts({ limit: 8 });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Featured Products
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our selection of quality organic and natural products
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              Featured Products
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Discover our selection of quality organic and natural products
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
