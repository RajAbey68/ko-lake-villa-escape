import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, Phone, Mail, ExternalLink, CreditCard } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookingModal = ({ isOpen, onOpenChange }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    checkIn: "",
    checkOut: "",
    guestsCount: "2",
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const estimatedTotal = () => {
    const nights = calculateNights();
    const basePrice = 199; // Default room price
    return nights * basePrice;
  };

  const handleGuestyRedirect = () => {
    window.open("https://www.airbnb.com/rooms/kolakevilla", "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const nights = calculateNights();
      const totalAmount = estimatedTotal();

      const { error } = await supabase
        .from('booking_requests')
        .insert([{
          guest_name: formData.guestName,
          guest_email: formData.guestEmail,
          guest_phone: formData.guestPhone,
          check_in: formData.checkIn,
          check_out: formData.checkOut,
          guests_count: parseInt(formData.guestsCount),
          nights: nights,
          total_amount: totalAmount,
          special_requests: formData.specialRequests,
          booking_status: 'pending',
        }]);

      if (error) throw error;

      toast("Booking request submitted! We'll confirm your reservation within 2 hours and send payment details.");

      setFormData({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        checkIn: "",
        checkOut: "",
        guestsCount: "2",
        specialRequests: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast("Error submitting booking. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-primary" />
            Book Your Stay at Ko Lake Villa
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Options */}
          <div className="space-y-6">
            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-lg font-semibold">Direct Booking (Recommended)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Book directly with us for the best rates, flexible cancellation, and personalized service.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Best Price Guarantee</span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Free Cancellation (48h)</span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Personal Concierge</span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Welcome Amenities</span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <ExternalLink className="h-5 w-5 text-muted-foreground mr-2" />
                <h3 className="text-lg font-semibold">Book via Airbnb</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Book through Airbnb for instant confirmation (higher rates apply).
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGuestyRedirect}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Airbnb
              </Button>
            </Card>

            {/* Contact Info */}
            <Card className="p-6 bg-muted/50">
              <h3 className="font-semibold mb-4">Need Assistance?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <span>+94 77 123 4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  <span>reservations@kolakevilla.com</span>
                </div>
                <p className="text-muted-foreground">
                  Available 24/7 for reservations and inquiries
                </p>
              </div>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guestName">Full Name *</Label>
                  <Input
                    id="guestName"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="guestEmail">Email Address *</Label>
                  <Input
                    id="guestEmail"
                    name="guestEmail"
                    type="email"
                    value={formData.guestEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guestPhone">Phone Number</Label>
                <Input
                  id="guestPhone"
                  name="guestPhone"
                  type="tel"
                  value={formData.guestPhone}
                  onChange={handleInputChange}
                  placeholder="+94 77 123 4567"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn">Check-in Date *</Label>
                  <Input
                    id="checkIn"
                    name="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    required
                    min={today}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out Date *</Label>
                  <Input
                    id="checkOut"
                    name="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    required
                    min={formData.checkIn || today}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guestsCount">Number of Guests *</Label>
                <Select 
                  value={formData.guestsCount} 
                  onValueChange={(value) => handleSelectChange('guestsCount', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4 Guests</SelectItem>
                    <SelectItem value="5">5 Guests</SelectItem>
                    <SelectItem value="6">6 Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requests, dietary requirements, or preferences..."
                  rows={3}
                />
              </div>

              {/* Booking Summary */}
              {formData.checkIn && formData.checkOut && calculateNights() > 0 && (
                <Card className="p-4 bg-muted/50">
                  <h4 className="font-semibold mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Dates:</span>
                      <span className="font-medium">
                        {new Date(formData.checkIn).toLocaleDateString()} - {new Date(formData.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nights:</span>
                      <span className="font-medium">{calculateNights()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span className="font-medium">{formData.guestsCount}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Estimated Total:</span>
                      <span className="text-primary">${estimatedTotal()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Final price will be confirmed upon availability check
                    </p>
                  </div>
                </Card>
              )}

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 py-3"
              >
                {isSubmitting ? "Submitting..." : "Submit Booking Request"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting this request, you agree to our terms and conditions. 
                No payment is required until we confirm your reservation.
              </p>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};