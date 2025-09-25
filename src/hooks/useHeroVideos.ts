import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type HeroVideo = Database["public"]["Tables"]["hero_videos"]["Row"];

export const useHeroVideos = () => {
  return useQuery({
    queryKey: ["/api/hero-videos"],
    queryFn: async (): Promise<HeroVideo[]> => {
      const { data, error } = await supabase
        .from("hero_videos")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch hero videos: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
};