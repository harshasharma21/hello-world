import { categories } from "@/data/mockData";
import { Product } from "@/types/product";

// Build the full category path for a product
export const buildProductPath = (product: Product): string => {
  const pathSegments: string[] = [];
  
  // Get subcategory if exists
  if (product.subcategory) {
    const subcat = categories.find(c => c.slug === product.subcategory);
    if (subcat) {
      // Build path up the hierarchy
      const buildHierarchy = (categoryId: string): string[] => {
        const cat = categories.find(c => c.id === categoryId);
        if (!cat) return [];
        
        const segments = cat.parentId ? buildHierarchy(cat.parentId) : [];
        segments.push(cat.slug);
        return segments;
      };
      
      pathSegments.push(...buildHierarchy(subcat.id));
    }
  } 
  // Otherwise use category
  else if (product.category) {
    const cat = categories.find(c => c.slug === product.category);
    if (cat) {
      const buildHierarchy = (categoryId: string): string[] => {
        const cat = categories.find(c => c.id === categoryId);
        if (!cat) return [];
        
        const segments = cat.parentId ? buildHierarchy(cat.parentId) : [];
        segments.push(cat.slug);
        return segments;
      };
      
      pathSegments.push(...buildHierarchy(cat.id));
    }
  }
  
  // Build the final path: /shop/category/subcategory/product/id
  return `/shop/${pathSegments.join('/')}/product/${product.id}`;
};
