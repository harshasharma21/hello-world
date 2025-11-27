import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { productImages } from "@/utils/imageHelper";
import { buildProductPath } from "@/utils/productRoutes";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const isLiked = isInWishlist(product.id);

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
    if (isLiked) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-elegant-hover transition-smooth">
      <Link to={buildProductPath(product)} className="block">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <img
            src={productImage}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-smooth"
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background ${
              isLiked ? "text-destructive" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleToggleLike();
            }}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          {product.stock < 50 && product.inStock && (
            <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
              Low Stock
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
            {product.brand && (
              <p className="text-xs text-muted-foreground mt-1">{product.brand}</p>
            )}
          </div>

          <h3 className="font-semibold text-base mb-1 line-clamp-2 min-h-[3rem] hover:text-primary transition-smooth">
            {product.name}
          </h3>

          {product.shortDescription && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-primary">£{product.price.toFixed(2)}</p>
              {product.packSize && (
                <p className="text-xs text-muted-foreground">{product.packSize} {product.unit}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Link>

      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-none"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
              disabled={!product.inStock}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              onClick={(e) => e.stopPropagation()}
              className="w-12 text-center border-0 outline-none"
              disabled={!product.inStock}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-none"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(quantity + 1);
              }}
              disabled={!product.inStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={!product.inStock}
          >
            Add to
            <ShoppingCart className="h-4 w-4 mr-2" />
            
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
