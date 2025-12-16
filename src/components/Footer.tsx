import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import natureliaLogo from "@/assets/naturelia-logo.jpg";

export const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-100 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img src={natureliaLogo} alt="Naturelia" className="h-12 mb-4" />
            <p className="text-sm text-neutral-400 mb-4">
              Your trusted B2B wholefood supplier delivering quality organic and natural products to businesses across the UK.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-primary transition-smooth">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-smooth">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-smooth">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-smooth">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="text-neutral-400 hover:text-primary transition-smooth">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/fast-order" className="text-neutral-400 hover:text-primary transition-smooth">
                  Fast Order
                </Link>
              </li>
              <li>
                <Link to="/liked" className="text-neutral-400 hover:text-primary transition-smooth">
                  My Wishlist
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-primary transition-smooth">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact-us" className="text-neutral-400 hover:text-primary transition-smooth">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="mailto:inquiries@natureliawholefood.com" className="text-neutral-400 hover:text-primary transition-smooth">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-primary transition-smooth">
                  Returns Policy
                </a>
              </li>
              <li>
                <a href="mailto:jobs@natureliawholefood.com" className="text-neutral-400 hover:text-primary transition-smooth">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">Contact Us</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <p>308–312 Chiswick High Road, London, W4 1NP</p>
              {/* <li className="pt-2">
                <a href="tel:+44123456789" className="hover:text-primary transition-smooth">
                  +44 123 456 789
                </a>
              </li> */}
              <li>
                <a href="mailto:sales@natureliawholefood.com" className="hover:text-primary transition-smooth">
                  sales@natureliawholefood.com
                </a>
              </li>
                <li>
                <a href="mailto:inquiries@natureliawholefood.com" className="hover:text-primary transition-smooth">
                   inquiries@natureliawholefood.com
                </a>
                </li>
                <li>
                <a href="mailto:jobs@natureliawholefood.com" className="hover:text-primary transition-smooth">
                  jobs@natureliawholefood.com
                </a>
                </li>
              
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-sm text-neutral-400 text-center">
          <p>&copy; {new Date().getFullYear()} Naturelia Wholefood. All rights reserved. | Privacy Policy | Terms & Conditions</p>
        </div>
      </div>
    </footer>
  );
};