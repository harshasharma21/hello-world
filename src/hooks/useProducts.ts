import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbProduct {
  id: string;
  name: string;
  barcode: string;
  base_unit: string | null;
  price: number | null;
  group_code: string | null;
  category_id: string | null;
  is_valid_barcode: boolean | null;
  created_at: string;
  updated_at: string;
  "Category Level 1"?: string | null;
  "Category Level 2"?: string | null;
  "Category Level 3"?: string | null;
  "Category Level 4"?: string | null;
}

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  image: string | null;
  created_at: string;
}



export const useProducts = (options?: { 
  categorySlug?: string; 
  groupCode?: string;
  search?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["products", options],
    queryFn: async () => {
      // When searching, we need to fetch ALL products to search across the entire dataset
      // Build query without limits first if searching
      let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .order("name");

      if (options?.groupCode) {
        query = query.eq("group_code", options.groupCode);
      }

      // Fetch data
      const { data, error, count } = await query;

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Total products fetched:", data?.length || 0, "Total count:", count);

      // If search is provided, filter client-side
      if (options?.search && options.search.trim()) {
        const searchTerm = options.search.trim();
        console.log("Searching for:", searchTerm);
        
        const filtered = data?.filter(product => 
          (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
        ) || [];

        console.log("Search results:", filtered.length, "for search:", searchTerm);
        
        if (options?.limit) {
          return filtered.slice(0, options.limit);
        }
        return filtered;
      }

      // If no search but limit is provided, apply limit to non-search results
      if (options?.limit) {
        return data?.slice(0, options.limit) || [];
      }

      return data as DbProduct[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as DbProduct | null;
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as DbCategory[];
    },
  });
};

export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as DbCategory | null;
    },
    enabled: !!slug,
  });
};

// Get unique group codes from products (for category filtering)
export const useGroupCodes = () => {
  return useQuery({
    queryKey: ["groupCodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("group_code")
        .not("group_code", "is", null);

      if (error) throw error;
      
      // Get unique group codes
      const uniqueCodes = [...new Set(data.map(p => p.group_code?.trim()).filter(Boolean))];
      return uniqueCodes.sort();
    },
  });
};