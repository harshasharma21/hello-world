import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ShopRouter from "./components/ShopRouter";
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
import ImportData from "./pages/ImportData";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function InactivityLogoutWrapper({ children }: { children: React.ReactNode }) {
  useInactivityLogout();
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WishlistProvider>
          <CartProvider>
            <InactivityLogoutWrapper>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            {/* ShopRouter handles both category and product routes */}
            <Route path="/shop/*" element={<ShopRouter />} />
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
            <Route path="/import-data" element={<ImportData />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
            </InactivityLogoutWrapper>
          </CartProvider>
        </WishlistProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
