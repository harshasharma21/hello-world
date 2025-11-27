import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Liked from "./pages/Liked";
import FastOrder from "./pages/FastOrder";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NewCustomerSignup from "./pages/NewCustomerSignup";
import NewSupplierSignup from "./pages/NewSupplierSignup";
import ContactUs from "./pages/ContactUs";
import CustomerServices from "./pages/CustomerServices";
import GenerateImages from "./pages/GenerateImages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WishlistProvider>
          <CartProvider>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category1/product/:id" element={<ProductDetail />} />
            <Route path="/shop/:category1/:category2/product/:id" element={<ProductDetail />} />
            <Route path="/shop/:category1/:category2/:category3/product/:id" element={<ProductDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/shop/*" element={<Category />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/liked" element={<Liked />} />
            <Route path="/fast-order" element={<FastOrder />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new-customer-signup" element={<NewCustomerSignup />} />
            <Route path="/new-supplier-signup" element={<NewSupplierSignup />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/customer-services" element={<CustomerServices />} />
            <Route path="/generate-images" element={<GenerateImages />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
