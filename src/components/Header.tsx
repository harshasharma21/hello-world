import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Search, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+44123456789" className="flex items-center gap-2 hover:opacity-80 transition-smooth">
                <Phone className="h-4 w-4" />
                <span>+44 123 456 789</span>
              </a>
              <a href="mailto:sales@cnfoods.com" className="flex items-center gap-2 hover:opacity-80 transition-smooth">
                <Mail className="h-4 w-4" />
                <span>sales@cnfoods.com</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="text-2xl font-bold text-primary">CN Foods</div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, SKU, categories..."
                className="pl-10 pr-4 h-11"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/liked">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-border">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1">
            <li>
              <Button variant="ghost" className="rounded-none h-12" asChild>
                <Link to="/shop">All Products</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="rounded-none h-12" asChild>
                <Link to="/shop/category/food-cupboard-15">Food Cupboard</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="rounded-none h-12" asChild>
                <Link to="/shop/category/beverages-16">Beverages</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="rounded-none h-12" asChild>
                <Link to="/shop/category/frozen-foods-17">Frozen Foods</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="rounded-none h-12" asChild>
                <Link to="/shop/category/fresh-produce-18">Fresh Produce</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="rounded-none h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                <Link to="/fast-order">Fast Order</Link>
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};
