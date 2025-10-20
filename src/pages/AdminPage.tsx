import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navigation } from '@/components/Navigation';
import { AdminBookings } from '@/components/admin/AdminBookings';
import { AdminRoomTypes } from '@/components/admin/AdminRoomTypes';
import { AdminAmenities } from '@/components/admin/AdminAmenities';
import { AdminGallery } from '@/components/admin/AdminGallery';
import { AdminDatabaseSeed } from '@/components/admin/AdminDatabaseSeed';
import { AdminHeroContent } from '@/components/admin/AdminHeroContent';
import { AdminLocationInfo } from '@/components/admin/AdminLocationInfo';
import { AdminContactSubmissions } from '@/components/admin/AdminContactSubmissions';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { AdminGuestyTest } from '@/components/admin/AdminGuestyTest';
import { AdminAIAssistant } from '@/components/admin/AdminAIAssistant';
import { Shield, Users, Bed, Star, Image, MessageSquare, MapPin, BarChart, Settings, Sparkles } from 'lucide-react';

const AdminPage = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isE2E = (import.meta as any).env?.VITE_E2E === 'true';
  
  // TESTING MODE: Bypass authentication completely
  const BYPASS_AUTH = true;

  useEffect(() => {
    // Allow admin access during E2E tests or when BYPASS_AUTH is enabled
    if (!BYPASS_AUTH && !isE2E && !loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, loading, isAdmin, navigate, isE2E]);

  // Skip loading screen when bypassing auth
  if (!BYPASS_AUTH && loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Skip auth check when bypassing
  if (!BYPASS_AUTH && !isE2E && (!user || !isAdmin)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Ko Lake Villa Admin Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Welcome to the admin panel. Manage your resort's content, bookings, and settings.
            </p>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                🔓 <strong>Testing Mode:</strong> Authentication bypassed. Direct access enabled.
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="gallery" className="space-y-4">
          <TabsList className="grid grid-cols-4 lg:grid-cols-10 w-full">
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Setup</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              <span className="hidden sm:inline">Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="amenities" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Amenities</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Hero</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Location</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="guesty" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Guesty</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI Test</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle>Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertDescription>
                    Use this to seed the database with placeholder content for testing.
                  </AlertDescription>
                </Alert>
                <AdminDatabaseSeed />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="bookings">
            <AdminBookings />
          </TabsContent>

          <TabsContent value="rooms">
            <AdminRoomTypes />
          </TabsContent>

          <TabsContent value="amenities">
            <AdminAmenities />
          </TabsContent>

          <TabsContent value="gallery">
            <AdminGallery />
          </TabsContent>

          <TabsContent value="hero">
            <AdminHeroContent />
          </TabsContent>

          <TabsContent value="location">
            <AdminLocationInfo />
          </TabsContent>

          <TabsContent value="contacts">
            <AdminContactSubmissions />
          </TabsContent>

          <TabsContent value="guesty">
            <AdminGuestyTest />
          </TabsContent>

          <TabsContent value="ai">
            <AdminAIAssistant />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;