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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      amenities: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_requests: {
        Row: {
          booking_status: string | null
          check_in: string
          check_out: string
          created_at: string
          guest_email: string
          guest_name: string
          guest_phone: string | null
          guests_count: number
          id: string
          nights: number | null
          room_type_id: string | null
          savings_amount: number | null
          special_requests: string | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          booking_status?: string | null
          check_in: string
          check_out: string
          created_at?: string
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          guests_count?: number
          id?: string
          nights?: number | null
          room_type_id?: string | null
          savings_amount?: number | null
          special_requests?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          booking_status?: string | null
          check_in?: string
          check_out?: string
          created_at?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          guests_count?: number
          id?: string
          nights?: number | null
          room_type_id?: string | null
          savings_amount?: number | null
          special_requests?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_status: string | null
          check_in: string
          check_out: string
          created_at: string
          guest_email: string
          guest_name: string
          guest_phone: string | null
          guests_count: number
          guesty_booking_id: string | null
          id: string
          special_requests: string | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          booking_status?: string | null
          check_in: string
          check_out: string
          created_at?: string
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          guests_count?: number
          guesty_booking_id?: string | null
          id?: string
          special_requests?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          booking_status?: string | null
          check_in?: string
          check_out?: string
          created_at?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          guests_count?: number
          guesty_booking_id?: string | null
          id?: string
          special_requests?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          media_type: string
          media_url: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          media_type: string
          media_url: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          media_type?: string
          media_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          id: string
          filename: string
          title: string | null
          description: string | null
          alt_text: string | null
          seo_description: string | null
          keywords: Json | null
          category: string
          media_type: string
          object_path: string
          thumbnail_path: string | null
          file_size: number | null
          mime_type: string | null
          width: number | null
          height: number | null
          duration: number | null
          is_hero: boolean | null
          is_featured: boolean | null
          display_order: number | null
          confidence_score: number | null
          analysis_status: string
          uploaded_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          filename: string
          title?: string | null
          description?: string | null
          alt_text?: string | null
          seo_description?: string | null
          keywords?: Json | null
          category: string
          media_type: string
          object_path: string
          thumbnail_path?: string | null
          file_size?: number | null
          mime_type?: string | null
          width?: number | null
          height?: number | null
          duration?: number | null
          is_hero?: boolean | null
          is_featured?: boolean | null
          display_order?: number | null
          confidence_score?: number | null
          analysis_status?: string
          uploaded_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          filename?: string
          title?: string | null
          description?: string | null
          alt_text?: string | null
          seo_description?: string | null
          keywords?: Json | null
          category?: string
          media_type?: string
          object_path?: string
          thumbnail_path?: string | null
          file_size?: number | null
          mime_type?: string | null
          width?: number | null
          height?: number | null
          duration?: number | null
          is_hero?: boolean | null
          is_featured?: boolean | null
          display_order?: number | null
          confidence_score?: number | null
          analysis_status?: string
          uploaded_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hero_content: {
        Row: {
          created_at: string
          cta_action: string | null
          cta_text: string | null
          description: string | null
          display_order: number | null
          id: string
          image_alt: string | null
          image_url: string
          is_active: boolean | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_action?: string | null
          cta_text?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_alt?: string | null
          image_url: string
          is_active?: boolean | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_action?: string | null
          cta_text?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_alt?: string | null
          image_url?: string
          is_active?: boolean | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_videos: {
        Row: {
          id: string
          title: string
          description: string | null
          video_path: string
          thumbnail_path: string | null
          duration: number | null
          file_size: number | null
          mime_type: string
          is_active: boolean | null
          display_order: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          video_path: string
          thumbnail_path?: string | null
          duration?: number | null
          file_size?: number | null
          mime_type?: string
          is_active?: boolean | null
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          video_path?: string
          thumbnail_path?: string | null
          duration?: number | null
          file_size?: number | null
          mime_type?: string
          is_active?: boolean | null
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      location_info: {
        Row: {
          address: string | null
          contact_info: Json | null
          coordinates: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          nearby_attractions: Json | null
          title: string
          transport_options: Json | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_info?: Json | null
          coordinates?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          nearby_attractions?: Json | null
          title: string
          transport_options?: Json | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_info?: Json | null
          coordinates?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          nearby_attractions?: Json | null
          title?: string
          transport_options?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      pricing_updates: {
        Row: {
          created_at: string
          effective_date: string
          failed_extractions: number | null
          id: string
          notes: string | null
          source: string | null
          successful_extractions: number | null
          total_rooms_updated: number | null
          update_date: string
        }
        Insert: {
          created_at?: string
          effective_date: string
          failed_extractions?: number | null
          id?: string
          notes?: string | null
          source?: string | null
          successful_extractions?: number | null
          total_rooms_updated?: number | null
          update_date: string
        }
        Update: {
          created_at?: string
          effective_date?: string
          failed_extractions?: number | null
          id?: string
          notes?: string | null
          source?: string | null
          successful_extractions?: number | null
          total_rooms_updated?: number | null
          update_date?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_admin: boolean
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      room_types: {
        Row: {
          airbnb_price: number | null
          airbnb_url: string | null
          amenities: string[] | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          description: string | null
          direct_price: number | null
          display_order: number | null
          id: string
          images: string[] | null
          is_available: boolean | null
          max_guests: number | null
          name: string
          updated_at: string
        }
        Insert: {
          airbnb_price?: number | null
          airbnb_url?: string | null
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          direct_price?: number | null
          display_order?: number | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          max_guests?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          airbnb_price?: number | null
          airbnb_url?: string | null
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          direct_price?: number | null
          display_order?: number | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          max_guests?: number | null
          name?: string
          updated_at?: string
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
