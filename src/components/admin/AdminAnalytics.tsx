import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Users, DollarSign, MessageSquare, TrendingUp, Star } from 'lucide-react';

export const AdminAnalytics = () => {
  // Booking stats
  const { data: bookingStats } = useQuery({
    queryKey: ['booking-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('booking_status, total_amount, created_at, guests_count');
      
      if (error) throw error;
      
      const total = data.length;
      const confirmed = data.filter(b => b.booking_status === 'confirmed').length;
      const pending = data.filter(b => b.booking_status === 'pending').length;
      const cancelled = data.filter(b => b.booking_status === 'cancelled').length;
      const totalRevenue = data
        .filter(b => b.booking_status === 'confirmed' && b.total_amount)
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);
      const totalGuests = data
        .filter(b => b.booking_status === 'confirmed')
        .reduce((sum, b) => sum + b.guests_count, 0);

      return {
        total,
        confirmed,
        pending,
        cancelled,
        totalRevenue,
        totalGuests,
        conversionRate: total > 0 ? (confirmed / total * 100).toFixed(1) : '0'
      };
    },
  });

  // Contact submissions
  const { data: contactStats } = useQuery({
    queryKey: ['contact-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('created_at');
      
      if (error) throw error;
      
      return data.length;
    },
  });

  // Room types data
  const { data: roomStats } = useQuery({
    queryKey: ['room-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('room_types')
        .select('name, is_available');
      
      if (error) throw error;
      
      return {
        total: data.length,
        available: data.filter(r => r.is_available).length
      };
    },
  });

  // Amenities data
  const { data: amenityStats } = useQuery({
    queryKey: ['amenity-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('amenities')
        .select('is_active, is_featured');
      
      if (error) throw error;
      
      return {
        total: data.length,
        active: data.filter(a => a.is_active).length,
        featured: data.filter(a => a.is_featured).length
      };
    },
  });

  // Monthly booking trends
  const { data: monthlyBookings } = useQuery({
    queryKey: ['monthly-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('created_at, booking_status')
        .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      
      const monthlyData = data.reduce((acc: any, booking) => {
        const month = new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
          acc[month] = { month, total: 0, confirmed: 0 };
        }
        acc[month].total++;
        if (booking.booking_status === 'confirmed') {
          acc[month].confirmed++;
        }
        return acc;
      }, {});

      return Object.values(monthlyData);
    },
  });

  const bookingStatusData = bookingStats ? [
    { name: 'Confirmed', value: bookingStats.confirmed, color: '#22c55e' },
    { name: 'Pending', value: bookingStats.pending, color: '#f59e0b' },
    { name: 'Cancelled', value: bookingStats.cancelled, color: '#ef4444' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{bookingStats?.total || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${bookingStats?.totalRevenue?.toLocaleString() || 0}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Guests</p>
                <p className="text-2xl font-bold">{bookingStats?.totalGuests || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{bookingStats?.conversionRate || 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Booking Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Bookings" />
                <Line type="monotone" dataKey="confirmed" stroke="#22c55e" name="Confirmed" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Submissions</p>
                <p className="text-2xl font-bold">{contactStats || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Rooms</p>
                <p className="text-2xl font-bold">{roomStats?.available || 0}/{roomStats?.total || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Featured Amenities</p>
                <p className="text-2xl font-bold">{amenityStats?.featured || 0}/{amenityStats?.total || 0}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};