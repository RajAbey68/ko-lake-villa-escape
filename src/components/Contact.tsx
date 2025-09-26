import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";

interface ContactProps {
  onBookingClick?: () => void;
}

export const Contact = ({ onBookingClick }: ContactProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }]);

      if (error) throw error;

      toast("Message sent successfully! We'll get back to you within 24 hours.");

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast("Error sending message. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      content: "+94 77 123 4567",
      description: "Available 24/7 for reservations",
      action: "tel:+94771234567"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@kolakevilla.com",
      description: "We respond within 2 hours",
      action: "mailto:info@kolakevilla.com"
    },
    {
      icon: MapPin,
      title: "Address",
      content: "Ahangama, Sri Lanka",
      description: "Central Province, 20000",
      action: "https://maps.google.com/?q=Ahangama,+Sri+Lanka"
    },
    {
      icon: Clock,
      title: "Check-in/out",
      content: "3:00 PM / 11:00 AM",
      description: "Flexible timing available",
      action: null
    },
  ];

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about your stay? We're here to help make your Ko Lake Villa experience unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="p-6 hover:shadow-medium smooth-transition">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{info.title}</h4>
                        {info.action ? (
                          <a 
                            href={info.action}
                            className="text-primary hover:underline font-medium"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="font-medium">{info.content}</p>
                        )}
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <Button 
                  onClick={onBookingClick}
                  className="w-full justify-start bg-primary hover:bg-primary/90"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Make a Reservation
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open("tel:+94771234567")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call for Immediate Assistance
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open("https://wa.me/94771234567")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Chat
                </Button>
              </div>
            </Card>

            {/* Operating Hours */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Reception Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Sunday</span>
                  <span className="font-medium">24/7 Available</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in</span>
                  <span className="font-medium">3:00 PM onwards</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out</span>
                  <span className="font-medium">Until 11:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Concierge Service</span>
                  <span className="font-medium">24/7 Available</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll respond within 2 hours during business hours
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+94 77 123 4567"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell us about your inquiry, preferred dates, special requests, or any questions you have..."
                      rows={5}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our privacy policy. 
                    We'll only use your information to respond to your inquiry.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6">
              <h4 className="font-semibold mb-2">What's included in the room rate?</h4>
              <p className="text-sm text-muted-foreground">
                All rooms include WiFi, parking, air conditioning, kitchen access, and daily housekeeping. 
                Breakfast and airport transfers are available for an additional charge.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">Do you offer airport transfers?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, we provide airport transfer services from Bandaranaike International Airport. 
                Please contact us to arrange this service in advance.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">Is the property family-friendly?</h4>
              <p className="text-sm text-muted-foreground">
                Absolutely! We welcome families and offer child-friendly amenities, 
                extra beds, and can arrange babysitting services upon request.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">What's your cancellation policy?</h4>
              <p className="text-sm text-muted-foreground">
                Free cancellation up to 48 hours before check-in. 
                For last-minute changes, please contact us directly to discuss options.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};