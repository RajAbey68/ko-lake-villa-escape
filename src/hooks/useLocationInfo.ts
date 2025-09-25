import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LocationInfo {
  id: string;
  title: string;
  description: string | null;
  address: string | null;
  coordinates: string | null;
  transport_options: any;
  nearby_attractions: any;
  contact_info: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useLocationInfo = () => {
  return useQuery({
    queryKey: ["location-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_info")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .single();
      
      if (error) {
        console.error("Error fetching location info:", error);
        throw error;
      }
      
      return data as LocationInfo;
    },
  });
};