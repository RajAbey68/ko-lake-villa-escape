import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Contact {
  id: string;
  role: string;
  title: string;
  name: string | null;
  phone: string;
  whatsapp: string | null;
  languages: string[] | null;
  location: string | null;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  display_order: number;
}

export const useContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts" as any)
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as unknown as Contact[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
