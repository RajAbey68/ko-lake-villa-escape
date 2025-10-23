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

const FALLBACK_LOCATION: LocationInfo[] = [];

export const useLocationInfo = () => {
  return useQuery({
    queryKey: ["location-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_info")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching location info:", error);
        return FALLBACK_LOCATION;
      }
      return (data && data.length > 0) ? data as LocationInfo[] : FALLBACK_LOCATION;
    },
  });
};