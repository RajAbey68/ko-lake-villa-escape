import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface KoLakeContactProps {
  onBookingClick?: () => void;
}

export function KoLakeContact({ onBookingClick }: KoLakeContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneWarning, setPhoneWarning] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+94", // Default to Sri Lanka
    phone: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string, countryCode: string) => {
    // Basic phone validation - warn but don't block
    const phoneRegex = /^\d{7,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEmailError("");
    setPhoneWarning("");
    
    // Validate email format
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.message.trim() || !formData.subject) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.countryCode || !formData.phone) {
      toast({
        title: "Phone number required",
        description: "Please select country and enter phone number.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Check phone format but don't block
    if (!validatePhone(formData.phone, formData.countryCode)) {
      setPhoneWarning("Phone number format may be incorrect for the selected country");
    }
    
    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: `${formData.countryCode}${formData.phone}`,
            message: `Subject: ${formData.subject}\n\n${formData.message}`
          }
        ]);

      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "+94",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error sending message",
        description: error instanceof Error ? error.message : "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (field === "email") {
      setEmailError("");
    }
    if (field === "phone") {
      setPhoneWarning("");
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Manager WhatsApp",
      details: ["PLACEHOLDER: Manager WhatsApp", "Available 24/7"],
      action: null,
      isWhatsApp: true
    },
    {
      icon: Phone,
      title: "Villa Team Leader",
      details: ["PLACEHOLDER: Team Leader Phone", "On-site assistance"],
      action: null,
      isPhone: true
    },
    {
      icon: Mail,
      title: "Email",
      details: ["contact@koLakeHouse.com", "General inquiries"],
      action: "mailto:contact@koLakeHouse.com"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Group",
      details: ["Join our guest group", "Instant support & updates"],
      action: null,
      isGroup: true
    },
    {
      icon: Phone,
      title: "Owner Contact",
      details: ["PLACEHOLDER: Owner contact", "Direct line"],
      action: null
    },
    {
      icon: MapPin,
      title: "Address", 
      details: ["Koggala Lake", "Ahangama", "Southern Province, Sri Lanka"],
      action: null
    }
  ];

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Contact Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch for reservations, inquiries, or any assistance you need
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div className="space-y-6">
            
            {/* Quick Booking CTA */}
            <Card className="card-lake bg-gradient-to-r from-primary to-primary-glow text-white border-none">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Ready to Book?</CardTitle>
                <CardDescription className="text-white/80">
                  Reserve your stay at Ko Lake Villa today
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={onBookingClick}
                  variant="secondary" 
                  size="lg"
                  className="w-full"
                >
                  Book Your Stay Now
                </Button>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="card-lake">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        info.isWhatsApp ? 'bg-green-100' : 
                        info.isGroup ? 'bg-blue-100' : 
                        'bg-primary/10'
                      }`}>
                        <info.icon className={`w-5 h-5 ${
                          info.isWhatsApp ? 'text-green-600' : 
                          info.isGroup ? 'text-blue-600' : 
                          'text-primary'
                        }`} />
                      </div>
                      <CardTitle className="text-lg">{info.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-sm text-muted-foreground">
                          {info.action && detailIndex === 0 ? (
                            <a 
                              href={info.action} 
                              className="text-primary hover:underline"
                            >
                              {detail}
                            </a>
                          ) : (
                            detail
                          )}
                        </p>
                      ))}
                    </div>
                    {(info.isWhatsApp || info.isGroup) && (
                      <Button 
                        size="sm" 
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                        disabled
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {info.isGroup ? 'Join Group' : 'WhatsApp'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <Card className="card-lake">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Have a question or special request? We'd love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required 
                    className={emailError ? "border-destructive" : ""}
                  />
                  {emailError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">{emailError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Required)</Label>
                  <div className="flex gap-2">
                    <Select 
                      value={formData.countryCode} 
                      onValueChange={(value) => handleInputChange("countryCode", value)}
                      required
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        <SelectItem value="+94">🇱🇰 Sri Lanka +94</SelectItem>
                        <SelectItem value="+91">🇮🇳 India +91</SelectItem>
                        <SelectItem value="+1">🇺🇸 USA +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 UK +44</SelectItem>
                        <SelectItem value="+61">🇦🇺 Australia +61</SelectItem>
                        <SelectItem value="+65">🇸🇬 Singapore +65</SelectItem>
                        <SelectItem value="+60">🇲🇾 Malaysia +60</SelectItem>
                        <SelectItem value="+66">🇹🇭 Thailand +66</SelectItem>
                        <SelectItem value="+62">🇮🇩 Indonesia +62</SelectItem>
                        <SelectItem value="+81">🇯🇵 Japan +81</SelectItem>
                        <SelectItem value="+86">🇨🇳 China +86</SelectItem>
                        <SelectItem value="+82">🇰🇷 South Korea +82</SelectItem>
                        <SelectItem value="+33">🇫🇷 France +33</SelectItem>
                        <SelectItem value="+49">🇩🇪 Germany +49</SelectItem>
                        <SelectItem value="+39">🇮🇹 Italy +39</SelectItem>
                        <SelectItem value="+34">🇪🇸 Spain +34</SelectItem>
                        <SelectItem value="+64">🇳🇿 New Zealand +64</SelectItem>
                        <SelectItem value="+27">🇿🇦 South Africa +27</SelectItem>
                        <SelectItem value="+971">🇦🇪 UAE +971</SelectItem>
                        <SelectItem value="+966">🇸🇦 Saudi Arabia +966</SelectItem>
                        <SelectItem value="+7">🇷🇺 Russia +7</SelectItem>
                        <SelectItem value="+55">🇧🇷 Brazil +55</SelectItem>
                        <SelectItem value="+52">🇲🇽 Mexico +52</SelectItem>
                        <SelectItem value="+54">🇦🇷 Argentina +54</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`flex-1 ${phoneWarning ? "border-orange-400" : ""}`}
                      required 
                    />
                  </div>
                  {phoneWarning && (
                    <Alert className="py-2 border-orange-400 bg-orange-50">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-sm text-orange-700">{phoneWarning}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => handleInputChange("subject", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reservation">Reservation Inquiry</SelectItem>
                      <SelectItem value="general">General Information</SelectItem>
                      <SelectItem value="special-requests">Special Requests</SelectItem>
                      <SelectItem value="group-booking">Group Booking</SelectItem>
                      <SelectItem value="wedding-events">Wedding & Events</SelectItem>
                      <SelectItem value="spa-wellness">Spa & Wellness</SelectItem>
                      <SelectItem value="dining">Dining Arrangements</SelectItem>
                      <SelectItem value="activities">Activities & Experiences</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="feedback">Feedback & Reviews</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    rows={5} 
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required 
                    placeholder="Tell us about your inquiry or special requests..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="btn-lake w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contact */}
        <div className="mt-16 text-center bg-white/50 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-2">24/7 Emergency Contact</h3>
          <p className="text-muted-foreground mb-4">
            For urgent matters outside business hours
          </p>
          <div className="inline-flex items-center gap-2 text-primary font-medium">
            <Phone className="w-4 h-4" />
            PLACEHOLDER: Emergency contact number
          </div>
        </div>
      </div>
    </section>
  );
}