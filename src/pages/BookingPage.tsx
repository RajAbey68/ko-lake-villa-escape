import { Navigation } from "@/components/Navigation";
import { usePageContent } from "@/hooks/usePageContent";
import { KoLakeBooking } from "@/components/KoLakeBooking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Home } from "lucide-react";

const BookingPage = () => {
  const { getContent, isLoading } = usePageContent('book');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const title = getContent('header', 'title', 'Book Your Stay');
  const subtitle = getContent('header', 'subtitle', 'Check availability and reserve your dates');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground">{subtitle}</p>
        </div>
      </section>

      {/* Booking Widget */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Check Availability & Book
              </CardTitle>
            </CardHeader>
            <CardContent>
              <KoLakeBooking />
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardContent className="pt-6">
                <Calendar className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Flexible Dates</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your check-in and check-out dates
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Group Size</h3>
                <p className="text-sm text-muted-foreground">
                  Accommodates up to 14 guests comfortably
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Home className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">7 Rooms</h3>
                <p className="text-sm text-muted-foreground">
                  Multiple room configurations available
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;
