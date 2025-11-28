export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: string
          image: string | null
          name: string
          parent_id: string | null
          product_count: number | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          id: string
          image?: string | null
          name: string
          parent_id?: string | null
          product_count?: number | null
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          name?: string
          parent_id?: string | null
          product_count?: number | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          category_id: string | null
          created_at: string | null
          filename: string
          id: string
          product_id: string | null
          storage_path: string
          type: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          filename: string
          id?: string
          product_id?: string | null
          storage_path: string
          type: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          filename?: string
          id?: string
          product_id?: string | null
          storage_path?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          in_stock: boolean | null
          name: string
          pack_size: string | null
          price: number
          short_description: string | null
          sku: string
          stock: number | null
          subcategory: string | null
          tags: string[] | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id: string
          images?: string[] | null
          in_stock?: boolean | null
          name: string
          pack_size?: string | null
          price: number
          short_description?: string | null
          sku: string
          stock?: number | null
          subcategory?: string | null
          tags?: string[] | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          in_stock?: boolean | null
          name?: string
          pack_size?: string | null
          price?: number
          short_description?: string | null
          sku?: string
          stock?: number | null
          subcategory?: string | null
          tags?: string[] | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: string | null
          address_line_1: string | null
          address_line_2: string | null
          brand_name: string | null
          business_address: string | null
          business_type: string | null
          city: string | null
          company_name: string | null
          contact_name: string | null
          country: string | null
          county: string | null
          created_at: string | null
          field_sales_team: string | null
          full_name: string | null
          hear_about_us: string | null
          id: string
          job_title: string | null
          marketing_plans: string | null
          mobile: string | null
          ordering_method: string | null
          payment_method: string | null
          phone: string | null
          postcode: string | null
          role: string | null
          routes_to_market: string | null
          samples_sent: string | null
          stockists_in_london: string | null
          team_info: string | null
          trade_marketing_investment: string | null
          trading_name: string | null
          updated_at: string | null
          vat_number: string | null
          website: string | null
        }
        Insert: {
          account_type?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          brand_name?: string | null
          business_address?: string | null
          business_type?: string | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          country?: string | null
          county?: string | null
          created_at?: string | null
          field_sales_team?: string | null
          full_name?: string | null
          hear_about_us?: string | null
          id: string
          job_title?: string | null
          marketing_plans?: string | null
          mobile?: string | null
          ordering_method?: string | null
          payment_method?: string | null
          phone?: string | null
          postcode?: string | null
          role?: string | null
          routes_to_market?: string | null
          samples_sent?: string | null
          stockists_in_london?: string | null
          team_info?: string | null
          trade_marketing_investment?: string | null
          trading_name?: string | null
          updated_at?: string | null
          vat_number?: string | null
          website?: string | null
        }
        Update: {
          account_type?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          brand_name?: string | null
          business_address?: string | null
          business_type?: string | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          country?: string | null
          county?: string | null
          created_at?: string | null
          field_sales_team?: string | null
          full_name?: string | null
          hear_about_us?: string | null
          id?: string
          job_title?: string | null
          marketing_plans?: string | null
          mobile?: string | null
          ordering_method?: string | null
          payment_method?: string | null
          phone?: string | null
          postcode?: string | null
          role?: string | null
          routes_to_market?: string | null
          samples_sent?: string | null
          stockists_in_london?: string | null
          team_info?: string | null
          trade_marketing_investment?: string | null
          trading_name?: string | null
          updated_at?: string | null
          vat_number?: string | null
          website?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
