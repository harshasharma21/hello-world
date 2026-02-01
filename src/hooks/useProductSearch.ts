import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductWithCategory } from "./useNewProducts";

interface UseProductSearchOptions {
  searchQuery: string;
  limit?: number;
}

export const useProductSearch = ({ searchQuery, limit = 50 }: UseProductSearchOptions) => {
  return useQuery({
    queryKey: ["productSearch", searchQuery, limit],
    queryFn: async (): Promise<{ items: ProductWithCategory[]; total: number }> => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        return { items: [], total: 0 };
      }

      const trimmedQuery = searchQuery.trim();

      // Search in newProducts table by name (ilike for partial matching)
      const { data: products, error: productsError, count } = await supabase
        .from("newProducts")
        .select(`
          id,
          name,
          Barcode,
          information_taglines,
          updated_price_website
        `, { count: "exact" })
        .not("name", "is", null)
        .ilike("name", `%${trimmedQuery}%`)
        .limit(limit);

      if (productsError) {
        console.error("Error searching products:", productsError);
        throw productsError;
      }

      if (!products || products.length === 0) {
        return { items: [], total: 0 };
      }

      // Get category mappings for these products
      const productNames = products.map(p => p.name).filter(Boolean);
      
      const { data: categories, error: categoriesError } = await supabase
        .from("latestCategories")
        .select(`
          "Product Name",
          "Category Level 1",
          "Category Level 2",
          "Category Level 3",
          "Category Level 4"
        `)
        .in("Product Name", productNames);

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
      }

      // Create a map of product name to category info
      const categoryMap = new Map<string, {
        level1: string | null;
        level2: string | null;
        level3: string | null;
        level4: string | null;
      }>();

      if (categories) {
        for (const cat of categories) {
          const productName = cat["Product Name"];
          if (productName) {
            categoryMap.set(productName, {
              level1: cat["Category Level 1"],
              level2: cat["Category Level 2"],
              level3: cat["Category Level 3"],
              level4: cat["Category Level 4"],
            });
          }
        }
      }

      // Combine products with category info
      const productsWithCategories: ProductWithCategory[] = products.map(product => {
        const catInfo = product.name ? categoryMap.get(product.name) : null;
        return {
          ...product,
          categoryLevel1: catInfo?.level1 || null,
          categoryLevel2: catInfo?.level2 || null,
          categoryLevel3: catInfo?.level3 || null,
          categoryLevel4: catInfo?.level4 || null,
        };
      });

      return { items: productsWithCategories, total: count || productsWithCategories.length };
    },
    enabled: !!searchQuery && searchQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
