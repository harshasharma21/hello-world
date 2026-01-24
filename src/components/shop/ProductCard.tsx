import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ProductWithCategory } from "@/hooks/useNewProducts";
import { useProductImage } from "@/hooks/useProductImage";

interface ProductCardProps {
  product: ProductWithCategory;
}

// Format barcode properly (handle scientific notation)
const formatBarcode = (barcode: number | null): string => {
  if (!barcode) return "";
  return barcode.toLocaleString("fullwide", { useGrouping: false });
};

// Product image comes from `newProducts.image_url` via useProductImage

export const ProductCard = ({ product }: ProductCardProps) => {
  const { imageUrl } = useProductImage(formatBarcode(product.Barcode));
  const price = product.updated_price_website || 0;
  const taglines = product.information_taglines?.split("   ").filter(Boolean) || [];

  // Build category breadcrumb for display
  const categoryPath = [
    product.categoryLevel1,
    product.categoryLevel2,
    product.categoryLevel3,
    product.categoryLevel4,
  ].filter(Boolean).join(" › ");

  return (
    <Link
      to={`/shop/product/${product.id}`}
      className="group block bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <div className="aspect-square bg-muted relative overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name || "Product"}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
          {product.name || "Unknown Product"}
        </h3>
        {categoryPath && (
          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
            {categoryPath}
          </p>
        )}
        {taglines.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {taglines.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">
            £{price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // TODO: Add to cart functionality
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
