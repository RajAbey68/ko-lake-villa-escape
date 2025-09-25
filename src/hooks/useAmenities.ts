import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Amenity {
  id: string;
  title: string;
  description: string | null;
  category: 'resort_facilities' | 'comfort' | 'activities';
  icon_name: string | null;
  image_url: string | null;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAmenities = () => {
  return useQuery({
    queryKey: ["amenities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("amenities")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (error) {
        console.error("Error fetching amenities:", error);
        throw error;
      }
      
      return data as Amenity[];
    },
  });
};

export const useAmenitiesByCategory = (category?: string) => {
  return useQuery({
    queryKey: ["amenities", category],
    queryFn: async () => {
      let query = supabase
        .from("amenities")
        .select("*")
        .eq("is_active", true);
      
      if (category) {
        query = query.eq("category", category);
      }
      
      const { data, error } = await query.order("display_order", { ascending: true });
      
      if (error) {
        console.error("Error fetching amenities by category:", error);
        throw error;
      }
      
      return data as Amenity[];
    },
  });
};

export const useFeaturedAmenities = () => {
  return useQuery({
    queryKey: ["amenities", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("amenities")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("display_order", { ascending: true });
      
      if (error) {
        console.error("Error fetching featured amenities:", error);
        throw error;
      }
      
      return data as Amenity[];
    },
  });
};