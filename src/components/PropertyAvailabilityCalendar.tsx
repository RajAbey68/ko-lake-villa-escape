import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGuestyCalendar } from '@/hooks/useGuestyCalendar';
import { format, addDays, startOfMonth, endOfMonth } from 'date-fns';

interface PropertyAvailabilityCalendarProps {
  property_id?: string;
  onDateSelect?: (date: Date | undefined) => void;
}

export function PropertyAvailabilityCalendar({ 
  property_id, 
  onDateSelect 
}: PropertyAvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data, loading, error, fetchCalendar } = useGuestyCalendar();

  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    fetchCalendar(
      format(monthStart, 'yyyy-MM-dd'),
      format(monthEnd, 'yyyy-MM-dd'),
      property_id
    );
  }, [currentMonth, property_id, fetchCalendar]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const getDateInfo = (date: Date) => {
    if (!data?.calendar) return null;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    return data.calendar.find(day => day.date === dateStr);
  };

  const isDateDisabled = (date: Date) => {
    const dateInfo = getDateInfo(date);
    return !dateInfo?.available || date < new Date();
  };

  const selectedDateInfo = selectedDate ? getDateInfo(selectedDate) : null;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Availability Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Availability Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading calendar: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Calendar</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select dates to check availability and pricing
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border"
          />
        </div>
        
        <div className="flex gap-2 text-xs justify-center flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Unavailable</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span>Past Date</span>
          </div>
        </div>

        {selectedDateInfo && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">
              {format(selectedDate!, 'MMMM d, yyyy')}
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <Badge variant={selectedDateInfo.available ? "default" : "destructive"}>
                  {selectedDateInfo.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              {selectedDateInfo.available && (
                <>
                  <div className="flex justify-between items-center">
                    <span>Price:</span>
                    <span className="font-semibold">
                      {selectedDateInfo.currency} {selectedDateInfo.price}/night
                    </span>
                  </div>
                  {selectedDateInfo.minimum_stay && (
                    <div className="flex justify-between items-center">
                      <span>Minimum Stay:</span>
                      <span>{selectedDateInfo.minimum_stay} nights</span>
                    </div>
                  )}
                </>
              )}
              {selectedDateInfo.blocked_reason && (
                <div className="flex justify-between items-center">
                  <span>Reason:</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedDateInfo.blocked_reason}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}