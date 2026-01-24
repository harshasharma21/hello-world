import { useParams } from "react-router-dom";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";

const ShopRouter = () => {
  const { "*": fullPath } = useParams();
  const pathParts = fullPath?.split("/").filter(Boolean) || [];
  
  // Check if this is a product detail page (path contains "product")
  const productIndex = pathParts.indexOf("product");
  
  if (productIndex !== -1 && pathParts[productIndex + 1]) {
    // This is a product page - pass the product ID
    return <ProductDetail productId={pathParts[productIndex + 1]} />;
  }
  
  // This is a category page - Shop component handles it with URL params
  return <Shop />;
};

export default ShopRouter;
