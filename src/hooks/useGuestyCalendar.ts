import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CalendarDay {
  date: string;
  available: boolean;
  price: number;
  currency: string;
  blocked_reason?: string;
  minimum_stay?: number;
}

interface CalendarData {
  property_id: string;
  calendar: CalendarDay[];
}

interface CalendarState {
  data: CalendarData | null;
  loading: boolean;
  error: string | null;
}

export const useGuestyCalendar = () => {
  const [state, setState] = useState<CalendarState>({
    data: null,
    loading: false,
    error: null
  });

  const fetchCalendar = useCallback(async (
    start_date: string,
    end_date: string,
    property_id?: string
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('guesty-calendar', {
        body: {
          property_id,
          start_date,
          end_date
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
        throw new Error(data.error || 'Failed to fetch calendar');
      }
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch calendar'
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
    fetchCalendar,
    reset
  };
};