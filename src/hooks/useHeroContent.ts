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

const FALLBACK_HERO_CONTENT: HeroContent[] = [
  {
    id: "1",
    title: "Lakeside Holiday Rental in Sri Lanka",
    subtitle: "Ko Lake • Ahangama",
    description: "7-room luxury villa on Koggala Lake. Perfect for families, surfers & digital nomads. Private chef, pool, near surf breaks.",
    image_url: "/src/assets/KoLakeSunset.jpeg",
    image_alt: "Ko Lake Villa Sunset View",
    cta_text: "Book Now",
    cta_action: "booking",
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

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
        return FALLBACK_HERO_CONTENT;
      }
      
      return (data && data.length > 0) ? data as HeroContent[] : FALLBACK_HERO_CONTENT;
    },
  });
};