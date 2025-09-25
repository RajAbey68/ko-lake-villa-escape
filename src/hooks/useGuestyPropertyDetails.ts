import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PropertyDetails {
  id: string;
  title: string;
  description: string;
  images: string[];
  amenities: string[];
  house_rules: string[];
  check_in_time: string;
  check_out_time: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  pricing: {
    base_price: number;
    currency: string;
  };
}

interface PropertyDetailsState {
  data: PropertyDetails | null;
  loading: boolean;
  error: string | null;
}

export const useGuestyPropertyDetails = () => {
  const [state, setState] = useState<PropertyDetailsState>({
    data: null,
    loading: false,
    error: null
  });

  const fetchPropertyDetails = useCallback(async (property_id?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('guesty-property-details', {
        body: { property_id }
      });

      if (error) throw error;

      if (data.success) {
        setState({
          data: data.data,
          loading: false,
          error: null
        });
      } else {
        throw new Error(data.error || 'Failed to fetch property details');
      }
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch property details'
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    fetchPropertyDetails,
    reset
  };
};