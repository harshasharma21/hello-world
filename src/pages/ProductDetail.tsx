import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts, categories } from "@/data/mockData";
import { ChevronRight, ShoppingCart, Heart, Plus, Minus, Package, Truck, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { productImages } from "@/utils/imageHelper";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const product = mockProducts.find(p => p.id === id);

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

  const productImage = product.images[0] ? productImages[product.images[0]] || "/placeholder.svg" : "/placeholder.svg";
  
  const category = categories.find(c => c.slug === product.category);
  const subcategory = product.subcategory ? categories.find(c => c.slug === product.subcategory) : null;

  const relatedProducts = mockProducts
    .filter(p => 
      p.id !== product.id && 
      (p.category === product.category || p.subcategory === product.subcategory)
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
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
        <div className="bg-neutral-50 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm flex-wrap">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-smooth">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-smooth">
                Shop
              </Link>
              {category && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    to={`/shop/category/${category.slug}-${category.id}`}
                    className="text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {category.name}
                  </Link>
                </>
              )}
              {subcategory && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    to={`/shop/category/${subcategory.slug}-${subcategory.id}`}
                    className="text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {subcategory.name}
                  </Link>
                </>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.stock < 50 && product.inStock && (
                  <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                    Low Stock
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge variant="destructive" className="absolute top-4 left-4">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground font-mono mb-2">SKU: {product.sku}</p>
                {product.brand && (
                  <p className="text-sm text-muted-foreground mb-2">Brand: {product.brand}</p>
                )}
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
                {product.shortDescription && (
                  <p className="text-lg text-muted-foreground mb-4">{product.shortDescription}</p>
                )}
              </div>

              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-bold text-primary">£{product.price.toFixed(2)}</p>
                {product.packSize && (
                  <p className="text-muted-foreground">per {product.packSize} {product.unit}</p>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
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
                      disabled={!product.inStock}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 outline-none text-lg"
                      disabled={!product.inStock}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-none"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={!product.inStock}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.inStock ? `${product.stock} units in stock` : "Currently unavailable"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 h-12 text-base"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
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
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">Related Products</h2>
                <Button variant="outline" asChild>
                  <Link to="/shop">View All</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
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
