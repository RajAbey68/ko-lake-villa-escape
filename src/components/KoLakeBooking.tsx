import { useState } from "react";
import { Calendar, Users, Loader2, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface KoLakeBookingProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KoLakeBooking({ isOpen, onOpenChange }: KoLakeBookingProps) {
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Input validation
    if (!checkIn || !checkOut || !name || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Date validation
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      toast({
        title: "Invalid Date",
        description: "Check-in date cannot be in the past.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast({
        title: "Invalid Date",
        description: "Check-out date must be after check-in date.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Store booking request in database
      const { data, error } = await supabase
        .from('booking_requests')
        .insert([
          {
            check_in: checkIn,
            check_out: checkOut,
            guests_count: parseInt(guests),
            guest_name: name,
            guest_email: email,
            guest_phone: phone || null,
            booking_status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Booking Request Sent!",
        description: "We'll contact you within 24 hours to confirm your reservation.",
      });

      // Reset form
      setCheckIn("");
      setCheckOut("");
      setGuests("2");
      setName("");
      setEmail("");
      setPhone("");
      onOpenChange(false);

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [showGuestyWidget, setShowGuestyWidget] = useState(false);

  const handleGuestyRedirect = () => {
    setShowGuestyWidget(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-primary">
            Book Ko Lake Villa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Booking Options */}
          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={handleGuestyRedirect}
              className="btn-lake w-full"
              size="lg"
              variant="default"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Instant Booking via Guesty
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              or send us a booking request
            </div>
          </div>

          {/* Booking Request Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-700">Booking Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="checkin" className="text-xs">Check-in</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout" className="text-xs">Check-out</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-2">
                  <Label htmlFor="guests" className="text-xs">Guests</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Guest{num > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Contact Details */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="text-sm"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="text-sm"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="text-sm"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-sunset"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      Send Booking Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-600">Need help? Contact us directly:</p>
            <div className="flex justify-center space-x-4 text-xs">
              <a href="tel:+94771234567" className="text-primary hover:underline">
                +94 77 123 4567
              </a>
              <a href="mailto:info@kolakevilla.com" className="text-primary hover:underline">
                info@kolakevilla.com
              </a>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Guesty Widget Modal */}
      {showGuestyWidget && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] relative overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Book Your Stay</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGuestyWidget(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[calc(100%-60px)]">
              <iframe
                src="https://booking.app.guesty.com/properties/YOUR_PROPERTY_ID"
                className="w-full h-full border-0"
                title="Ko Lake Villa Booking"
                allow="payment"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}