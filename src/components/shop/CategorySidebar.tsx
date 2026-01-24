import { Link, useLocation } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Category,
  getRootCategories,
  buildCategoryPath,
} from "@/data/categories";

interface CategoryItemProps {
  category: Category;
  level: number;
  currentPath: string;
}

const CategoryItem = ({ category, level, currentPath }: CategoryItemProps) => {
  const categoryPath = buildCategoryPath(category);
  const isActive = currentPath === categoryPath;
  const hasChildren = category.children.length > 0;
  const isExpanded = currentPath.startsWith(categoryPath) && hasChildren;
  const [isOpen, setIsOpen] = useState(isExpanded);

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-md text-sm transition-colors",
          isActive
            ? "bg-primary text-primary-foreground font-medium"
            : "hover:bg-muted text-foreground"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren && (
          <button
            onClick={handleToggle}
            className="p-0.5 hover:bg-muted-foreground/10 rounded"
          >
            {isOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        <Link
          to={categoryPath}
          className={cn("flex-1", !hasChildren && "ml-5")}
        >
          {category.name}
        </Link>
      </div>
      {hasChildren && isOpen && (
        <div>
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              currentPath={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CategorySidebar = () => {
  const location = useLocation();
  const rootCategories = getRootCategories();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border bg-card">
      <div className="sticky top-0 p-4">
        <h2 className="font-semibold text-lg mb-4 px-2">Categories</h2>
        <nav className="space-y-0.5">
          <Link
            to="/shop"
            className={cn(
              "block py-1.5 px-2 rounded-md text-sm transition-colors",
              location.pathname === "/shop"
                ? "bg-primary text-primary-foreground font-medium"
                : "hover:bg-muted text-foreground"
            )}
          >
            All Products
          </Link>
          {rootCategories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              level={0}
              currentPath={location.pathname}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default CategorySidebar;
