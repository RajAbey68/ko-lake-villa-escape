import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Accommodation {
  id: string;
  name: string;
  description: string;
  price: string;
  guests: number;
  features: string[];
  image: string;
  bedrooms: number;
  bathrooms: number;
  direct_price: number | null;
  airbnb_price: number | null;
  airbnb_url: string | null;
}

export const useAccommodations = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .eq('is_available', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Transform database data to match legacy interface
      const transformedData: Accommodation[] = (data || []).map(room => ({
        id: room.id,
        name: room.name,
        description: room.description || '',
        price: room.direct_price ? `$${room.direct_price}/night` : 'Contact for pricing',
        guests: room.max_guests,
        features: room.amenities || [],
        image: room.images?.[0] || '/placeholder.svg',
        bedrooms: room.bedrooms,
        bathrooms: room.bathrooms,
        direct_price: room.direct_price,
        airbnb_price: room.airbnb_price,
        airbnb_url: room.airbnb_url
      }));

      setAccommodations(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accommodations');
      console.error('Error fetching accommodations:', err);
    } finally {
      setLoading(false);
    }
  };

  return { 
    accommodations, 
    loading, 
    error, 
    refetch: fetchAccommodations 
  };
};