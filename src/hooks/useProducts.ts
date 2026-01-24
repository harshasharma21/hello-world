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
      let query = supabase
        .from("products")
        .select("*")
        .order("name");

      if (options?.groupCode) {
        query = query.eq("group_code", options.groupCode);
      }

      if (options?.search) {
        query = query.ilike("name", `%${options.search}%`);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
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