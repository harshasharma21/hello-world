import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Phone,
  Mail,
  LogOut,
} from "lucide-react";
import natureliaLogo from "@/assets/naturelia-logo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { MobileMenu } from "@/components/MobileMenu";

export const Header = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { totalItems } = useCart();
  const { totalItems: wishlistTotal } = useWishlist();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN") navigate("/");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Detect scroll to hide only the top bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md transition-all duration-300 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      {/* Top Bar (Hides on scroll) */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isScrolled ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
        }`}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs md:text-sm">
            {/* Phone + Mail */}
            <div className="flex items-center gap-3 md:gap-6">
              <a
                href="tel:+44123456789"
                className="flex items-center gap-2 hover:opacity-80"
              >
                {/* <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">+44 123 456 789</span> */}
              </a>
              <a
                href="mailto:sales@natureliawholefood.com"
                className="flex items-center gap-2 hover:opacity-80"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">sales@natureliawholefood.com</span>
              </a>
            </div>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img 
                src={natureliaLogo} 
                alt="Naturelia Wholefood" 
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8"
                asChild
              >
                <Link to="/liked">
                  <Heart className="h-4 w-4" />
                  {wishlistTotal > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] font-medium">
                      {wishlistTotal}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
                asChild
              >
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] font-medium">
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">My Profile</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/auth")}
                >
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 md:py-2 ">
        <div className="flex items-center justify-between gap-4 md:gap-8"></div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 pr-4 h-10 text-sm"
              />
            </div>
            <MobileMenu user={user} />
          </div>
        </div>
      </div>

      {/* Navigation Menu (always visible, sticky) */}
      <nav className="hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-wrap justify-center items-center gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Button variant="ghost" asChild>
                      <Link to="/">Home</Link>
                    </Button>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Button variant="ghost" asChild>
                      <Link to="/shop">Shop</Link>
                    </Button>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Button variant="ghost" asChild>
                      <Link to="/fast-order">Fast Order</Link>
                    </Button>
                  </NavigationMenuLink>
                </NavigationMenuItem> */}

                {!user && (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Button variant="ghost" asChild>
                          <Link to="/new-customer-signup">
                            New Customer Signup
                          </Link>
                        </Button>
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Button variant="ghost" asChild>
                          <Link to="/new-supplier-signup">
                            New Supplier Signup
                          </Link>
                        </Button>
                      </NavigationMenuLink>
                    </NavigationMenuItem> */}
                  </>
                )}

                {/* Get in Touch dropdown aligned to the button */}
                <NavigationMenuItem className="relative group/getintouch">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-semibold"
                  >
                    Get in Touch
                  </button>

                  {/* Hover Box */}
                  <div className="absolute md:right-0 top-full flex justify-center min-w-[200px] bg-background shadow-md rounded-md mt-1 opacity-0 invisible group-hover/getintouch:opacity-100 group-hover/getintouch:visible transition-all duration-200">
                    <div className="p-2 space-y-1 w-full">
                      <Link
                        to="/contact-us"
                        className="block px-4 py-2 hover:bg-muted rounded-sm"
                      >
                        Contact Us
                      </Link>

                      <Link
                        to="/customer-services"
                        className="block px-4 py-2 hover:bg-muted rounded-sm"
                      >
                        Customer Services
                      </Link>
                    </div>
                  </div>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </nav>
    </header>
  );
};