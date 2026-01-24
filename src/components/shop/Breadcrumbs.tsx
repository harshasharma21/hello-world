import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Category, getCategoryBreadcrumb, buildCategoryPath } from "@/data/categories";

interface BreadcrumbsProps {
  categoryId?: string;
  productName?: string;
}

export const Breadcrumbs = ({ categoryId, productName }: BreadcrumbsProps) => {
  const breadcrumb = categoryId ? getCategoryBreadcrumb(categoryId) : [];

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4 flex-wrap">
      <Link
        to="/"
        className="hover:text-foreground transition-colors flex items-center gap-1"
      >
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link to="/shop" className="hover:text-foreground transition-colors">
        Shop
      </Link>
      {breadcrumb.map((cat, index) => (
        <span key={cat.id} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4" />
          {index === breadcrumb.length - 1 && !productName ? (
            <span className="text-foreground font-medium">{cat.name}</span>
          ) : (
            <Link
              to={buildCategoryPath(cat)}
              className="hover:text-foreground transition-colors"
            >
              {cat.name}
            </Link>
          )}
        </span>
      ))}
      {productName && (
        <span className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium line-clamp-1">
            {productName}
          </span>
        </span>
      )}
    </nav>
  );
};

export default Breadcrumbs;
