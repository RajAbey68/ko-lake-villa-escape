import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AvailabilityData {
  available: boolean;
  price_per_night?: number;
  total_price?: number;
  currency?: string;
  restrictions?: string[];
}

interface AvailabilityState {
  data: AvailabilityData | null;
  loading: boolean;
  error: string | null;
}

export const useRealTimeAvailability = () => {
  const [state, setState] = useState<AvailabilityState>({
    data: null,
    loading: false,
    error: null
  });

  const checkAvailability = useCallback(async (
    room_type_id: string,
    check_in: string,
    check_out: string
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('guesty-availability', {
        body: {
          room_type_id,
          check_in,
          check_out
        }
      });

      if (error) throw error;

      if (data.success) {
        setState({
          data: data.data,
          loading: false,
          error: null
        });
      } else {
        throw new Error(data.error || 'Failed to check availability');
      }
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to check availability'
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
    checkAvailability,
    reset
  };
};