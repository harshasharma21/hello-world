import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { useState } from "react";

interface MobileMenuProps {
  user: any;
}

export const MobileMenu = ({ user }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px]">
        <nav className="flex flex-col gap-2 mt-6">
          <Link to="/" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              Home
            </Button>
          </Link>
          <Link to="/shop" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              Shop
            </Button>
          </Link>
          <Link to="/fast-order" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              Fast Order
            </Button>
          </Link>
          {!user && (
            <>
              <Link to="/new-customer-signup" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  New Customer Signup
                </Button>
              </Link>
              <Link to="/new-supplier-signup" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  New Supplier Signup
                </Button>
              </Link>
            </>
          )}
          <div className="border-t pt-2 mt-2">
            <p className="text-sm font-semibold mb-2 px-2 text-muted-foreground">
              Get in Touch
            </p>
            <Link to="/contact-us" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Contact Us
              </Button>
            </Link>
            <Link to="/customer-services" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Customer Services
              </Button>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
