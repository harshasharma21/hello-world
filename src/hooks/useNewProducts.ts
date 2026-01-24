import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NewProduct {
  id: number;
  name: string | null;
  Barcode: number | null;
  information_taglines: string | null;
  updated_price_website: number | null;
}

export interface ProductWithCategory extends NewProduct {
  categoryLevel1: string | null;
  categoryLevel2: string | null;
  categoryLevel3: string | null;
  categoryLevel4: string | null;
}

interface UseNewProductsOptions {
  categoryName?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

export const useNewProducts = (options: UseNewProductsOptions = {}) => {
  const { categoryName, searchQuery, limit = 50, offset = 0 } = options;

  return useQuery({
    queryKey: ["newProducts", categoryName, searchQuery, limit, offset],
    queryFn: async (): Promise<{ items: ProductWithCategory[]; total: number }> => {
      // Join newProducts with latestCategories on Product Name
      let query = supabase
        .from("newProducts")
        .select(`
          id,
          name,
          Barcode,
          information_taglines,
          updated_price_website
        `)
        .not("name", "is", null);

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      query = query.range(offset, offset + limit - 1);

      const { data: products, error: productsError } = await query;

      if (productsError) {
        console.error("Error fetching products:", productsError);
        throw productsError;
      }

      if (!products || products.length === 0) {
        return [];
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
      let productsWithCategories: ProductWithCategory[] = products.map(product => {
        const catInfo = product.name ? categoryMap.get(product.name) : null;
        return {
          ...product,
          categoryLevel1: catInfo?.level1 || null,
          categoryLevel2: catInfo?.level2 || null,
          categoryLevel3: catInfo?.level3 || null,
          categoryLevel4: catInfo?.level4 || null,
        };
      });

      // Filter by category if specified (client-side filtering of this page)
      if (categoryName) {
        const normalizedCategoryName = categoryName.trim().toLowerCase();
        productsWithCategories = productsWithCategories.filter(product => {
          const levels = [
            product.categoryLevel1,
            product.categoryLevel2,
            product.categoryLevel3,
            product.categoryLevel4,
          ];
          return levels.some(
            level => level && level.trim().toLowerCase() === normalizedCategoryName
          );
        });
      }

      // For this hook we return items + a total placeholder (total is best-effort)
      // Total will be determined by separate count queries in useProductsByCategory below when needed.
      return { items: productsWithCategories, total: productsWithCategories.length };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get a single product by ID
export const useNewProduct = (productId: number | null) => {
  return useQuery({
    queryKey: ["newProduct", productId],
    queryFn: async (): Promise<ProductWithCategory | null> => {
      if (!productId) return null;

      const { data: product, error: productError } = await supabase
        .from("newProducts")
        .select(`
          id,
          name,
          Barcode,
          information_taglines,
          updated_price_website
        `)
        .eq("id", productId)
        .single();

      if (productError) {
        console.error("Error fetching product:", productError);
        throw productError;
      }

      if (!product) return null;

      // Get category info
      let categoryInfo = null;
      if (product.name) {
        const { data: categories } = await supabase
          .from("latestCategories")
          .select(`
            "Category Level 1",
            "Category Level 2",
            "Category Level 3",
            "Category Level 4"
          `)
          .eq("Product Name", product.name)
          .single();

        if (categories) {
          categoryInfo = {
            level1: categories["Category Level 1"],
            level2: categories["Category Level 2"],
            level3: categories["Category Level 3"],
            level4: categories["Category Level 4"],
          };
        }
      }

      return {
        ...product,
        categoryLevel1: categoryInfo?.level1 || null,
        categoryLevel2: categoryInfo?.level2 || null,
        categoryLevel3: categoryInfo?.level3 || null,
        categoryLevel4: categoryInfo?.level4 || null,
      };
    },
    enabled: !!productId,
  });
};

// Hook to get products by category with all descendants
export const useProductsByCategory = (categoryName: string | null, limit = 50, offset = 0) => {
  return useQuery({
    queryKey: ["productsByCategory", categoryName, limit, offset],
    queryFn: async (): Promise<{ items: ProductWithCategory[]; total: number }> => {
      // If a category name is provided, find matching product names from latestCategories (query per level)
      if (categoryName) {
        const normalized = categoryName.trim();
        const levels = [
          "Category Level 1",
          "Category Level 2",
          "Category Level 3",
          "Category Level 4",
        ];

        // Build a single OR filter to run on latestCategories so we can page results there
        // This avoids building a giant `.in(...)` array in the newProducts request.
        const orConditions = levels
          .map((l) => `"${l}".ilike.%${normalized}%`)
          .join(",");

        // Get total matching rows (best-effort). This counts matching latestCategories rows;
        // if your latestCategories table has one row per product this is exact.
        const countRes = await supabase
          .from("latestCategories")
          .select("\"Product Name\"", { head: true, count: "exact" })
          .or(orConditions);
        const total = countRes.count || 0;

        if (total === 0) return { items: [], total };

        // Fetch a page of product names directly from latestCategories using the same OR filter.
        const namesRes = await supabase
          .from("latestCategories")
          .select(`"Product Name"`)
          .or(orConditions)
          .range(offset, offset + limit - 1);

        if (namesRes.error) {
          console.error("Error fetching product names from latestCategories:", namesRes.error);
          throw namesRes.error;
        }

        const matchingNames = (namesRes.data || []).map((d: any) => d["Product Name"]).filter(Boolean);
        if (matchingNames.length === 0) return { items: [], total };

        // Now fetch the actual product records for this small page of names
        let productsQuery: any = supabase
          .from("newProducts")
          .select(`
            id,
            name,
            Barcode,
            information_taglines,
            updated_price_website
          `)
          .in("name", matchingNames);

        const { data: products, error: productsError } = await productsQuery;
        if (productsError) {
          console.error("Error fetching products:", productsError);
          throw productsError;
        }

        // Fetch category mappings for this page of matching names
        const { data: categories } = await supabase
          .from("latestCategories")
          .select(`
            "Product Name",
            "Category Level 1",
            "Category Level 2",
            "Category Level 3",
            "Category Level 4"
          `)
          .in("Product Name", matchingNames);

        const categoryMap = new Map<string, { level1: string | null; level2: string | null; level3: string | null; level4: string | null }>();
        (categories || []).forEach((cat: any) => {
          if (cat["Product Name"]) {
            categoryMap.set(cat["Product Name"], {
              level1: cat["Category Level 1"] || null,
              level2: cat["Category Level 2"] || null,
              level3: cat["Category Level 3"] || null,
              level4: cat["Category Level 4"] || null,
            });
          }
        });

        const items = (products || []).map((p: any) => ({
          ...p,
          categoryLevel1: categoryMap.get(p.name)?.level1 || null,
          categoryLevel2: categoryMap.get(p.name)?.level2 || null,
          categoryLevel3: categoryMap.get(p.name)?.level3 || null,
          categoryLevel4: categoryMap.get(p.name)?.level4 || null,
        }));

        return { items, total };
      }

      // No category filter: fetch paginated products and total count
      const countRes = await supabase
        .from("newProducts")
        .select("id", { count: "exact", head: true })
        .not("name", "is", null);
      const total = countRes.count || 0;

      let query: any = supabase
        .from("newProducts")
        .select(`
          id,
          name,
          Barcode,
          information_taglines,
          updated_price_website
        `)
        .not("name", "is", null)
        .range(offset, offset + limit - 1);

      const { data: products, error } = await query;
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      if (!products || products.length === 0) return { items: [], total };

      // Fetch category mappings for these products
      const productNames = products.map((p: any) => p.name).filter(Boolean);
      const { data: categories } = await supabase
        .from("latestCategories")
        .select(`
          "Product Name",
          "Category Level 1",
          "Category Level 2",
          "Category Level 3",
          "Category Level 4"
        `)
        .in("Product Name", productNames);

      const categoryMap = new Map<string, { level1: string | null; level2: string | null; level3: string | null; level4: string | null }>();
      (categories || []).forEach((cat: any) => {
        if (cat["Product Name"]) {
          categoryMap.set(cat["Product Name"], {
            level1: cat["Category Level 1"] || null,
            level2: cat["Category Level 2"] || null,
            level3: cat["Category Level 3"] || null,
            level4: cat["Category Level 4"] || null,
          });
        }
      });

      const items = (products || []).map((p: any) => ({
        ...p,
        categoryLevel1: categoryMap.get(p.name)?.level1 || null,
        categoryLevel2: categoryMap.get(p.name)?.level2 || null,
        categoryLevel3: categoryMap.get(p.name)?.level3 || null,
        categoryLevel4: categoryMap.get(p.name)?.level4 || null,
      }));

      return { items, total };
    },
    staleTime: 5 * 60 * 1000,
  });
};
