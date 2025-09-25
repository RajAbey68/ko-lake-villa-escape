import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  image_alt: string | null;
  cta_text: string | null;
  cta_action: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useHeroContent = () => {
  return useQuery({
    queryKey: ["hero-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (error) {
        console.error("Error fetching hero content:", error);
        throw error;
      }
      
      return data as HeroContent[];
    },
  });
};