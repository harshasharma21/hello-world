import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { productImages } from "@/utils/imageHelper";
import { buildProductPath } from "@/utils/productRoutes";

interface ProductCardListProps {
  product: Product;
}

export const ProductCardList = ({ product }: ProductCardListProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // Handle both direct URLs and product image keys
  const productImage = product.images[0]
    ? product.images[0].startsWith('/') || product.images[0].startsWith('http')
      ? product.images[0]
      : productImages[product.images[0]] || "/placeholder.svg"
    : "/placeholder.svg";

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`Added ${quantity}x ${product.name} to cart`);
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Card className="group overflow-hidden hover:shadow-elegant-hover transition-smooth">
      <CardContent className="p-4 flex gap-4">
        <Link to={buildProductPath(product)} className="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-neutral-100 rounded-md">
          <img
            src={productImage}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-smooth"
          />
          {product.stock < 50 && product.inStock && (
            <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-xs">
              Low Stock
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 left-2 text-xs">
              Out of Stock
            </Badge>
          )}
        </Link>

        <Link to={buildProductPath(product)} className="flex-1 min-w-0">
          <div className="mb-2">
            <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
            {product.brand && (
              <p className="text-xs text-muted-foreground mt-1">{product.brand}</p>
            )}
          </div>

          <h3 className="font-semibold text-base mb-1 hover:text-primary transition-smooth">
            {product.name}
          </h3>

          {product.shortDescription && (
            <p className="text-sm text-muted-foreground mb-2">
              {product.shortDescription}
            </p>
          )}

          {product.packSize && (
            <p className="text-xs text-muted-foreground mb-2">{product.packSize} {product.unit}</p>
          )}
        </Link>

        <div className="flex flex-col items-end justify-between flex-shrink-0">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`bg-background/80 backdrop-blur-sm hover:bg-background ${
                isLiked ? "text-destructive" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleToggleLike();
              }}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>

          <div className="text-right mb-3">
            <p className="text-2xl font-bold text-primary">£{product.price.toFixed(2)}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-none"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!product.inStock}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center border-0 outline-none"
                disabled={!product.inStock}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-none"
                onClick={() => setQuantity(quantity + 1)}
                disabled={!product.inStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
