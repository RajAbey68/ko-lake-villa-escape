// Self-contained Contact Page
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useContacts } from "@/hooks/useContacts";

const FAQ_ITEMS = [
  { q: "What's the best way to contact you?", a: "WhatsApp is fastest - we usually respond within 1 hour!" },
  { q: "Do you offer airport pickup?", a: "Yes! Contact us for rates and scheduling." },
  { q: "Can I book directly?", a: "Absolutely! Direct bookings save 5-12% compared to booking platforms." },
  { q: "What languages do you speak?", a: "English, Sinhala, and Tamil. Some staff also speak German and French." }
];

export default function ContactPageSimple() {
  const { data: contacts, isLoading: contactsLoading } = useContacts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+94",
    phone: "",
    subject: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [emailError, setEmailError] = useState("");
  const [phoneWarning, setPhoneWarning] = useState("");
  
  const handleBookingClick = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{7,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);
    setEmailError("");
    setPhoneWarning("");
    
    // Validate email
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Validate phone (warn but don't block)
    if (!validatePhone(formData.phone)) {
      setPhoneWarning("Phone number format may be incorrect");
    }
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: `${formData.countryCode}${formData.phone}`,
          message: `Subject: ${formData.subject}\n\n${formData.message}`
        }]);

      if (error) throw error;

      setFormStatus({type: 'success', message: "Message sent successfully! We'll get back to you within 24 hours."});
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
      setFormStatus({type: 'error', message: "Error sending message. Please try WhatsApp instead."});
    }
    
    setIsSubmitting(false);
  };

  return (
    <>
      <style>{`
        :root{--bg:#fff;--ink:#0f172a;--muted:#475569;--line:#e2e8f0;--brand:#d26a1b;--brand-ink:#fff;--wash:#f8fafc}
        *{box-sizing:border-box}html,body{height:100%;margin:0;background:var(--bg);color:var(--ink);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial}
        a{color:inherit;text-decoration:none}.container{max-width:1120px;margin:0 auto;padding:0 16px}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border-radius:12px;padding:12px 16px;font-weight:600;border:1px solid transparent;cursor:pointer}
        .btn-primary{background:var(--brand);color:var(--brand-ink)}
        header.sticky{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.82);backdrop-filter:saturate(180%) blur(8px);border-bottom:1px solid var(--line)}
        .nav{display:flex;gap:20px;align-items:center}.nav a{font-size:14px;opacity:.9}
        .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:32px}
        @media(max-width:768px){.contact-grid{grid-template-columns:1fr}}
        .contact-card{padding:32px;background:var(--wash);border-radius:16px;border:1px solid var(--line)}
        .contact-item{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid var(--line)}
        .contact-item:last-child{border:none}
        .field{width:100%;padding:12px;border:1px solid var(--line);border-radius:8px;font-size:14px}
        .field:focus{outline:none;border-color:var(--brand)}
        select.field{cursor:pointer}
        textarea.field{resize:vertical;min-height:120px;font-family:inherit}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        @media(max-width:640px){.form-grid{grid-template-columns:1fr}}
        .alert{padding:12px;border-radius:8px;margin-bottom:16px}
        .alert-success{background:#d1fae5;border:1px solid #10b981;color:#065f46}
        .alert-error{background:#fee2e2;border:1px solid #ef4444;color:#991b1b}
        .alert-warning{background:#fef3c7;border:1px solid #f59e0b;color:#92400e}
        .faq-item{padding:20px;background:var(--wash);border-radius:12px;border:1px solid var(--line);margin-bottom:16px}
        .faq-q{font-weight:600;margin-bottom:8px;font-size:16px}
        .faq-a{color:var(--muted);font-size:14px}
        .emergency-banner{background:linear-gradient(135deg,#fef3c7 0%,#fed7aa 100%);padding:24px;border-radius:16px;border:2px solid #f59e0b;text-align:center;margin-top:48px}
      `}</style>

      <Navigation onBookingClick={handleBookingClick} />

      <section style={{background:"linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)",padding:"64px 0"}}>
        <div className="container" style={{textAlign:"center"}}>
          <h1 style={{fontSize:48,margin:"0 0 16px",fontWeight:700}}>Get in Touch</h1>
          <p style={{fontSize:20,color:"var(--muted)",maxWidth:700,margin:"0 auto"}}>WhatsApp us for best rates and instant responses</p>
        </div>
      </section>

      <main className="container" style={{padding:"64px 16px"}}>
        <div className="contact-grid">
          <div>
            <h2 style={{fontSize:28,margin:"0 0 24px"}}>Contact Information</h2>
            <div className="contact-card">
              <div className="contact-item">
                <div style={{fontSize:32}}>📱</div>
                <div>
                  <div style={{fontWeight:600,marginBottom:4}}>WhatsApp (Best)</div>
                  <a href="https://wa.me/94711730345" style={{color:"var(--brand)",fontSize:18}}>+94 71 173 0345</a>
                  <div style={{fontSize:14,color:"var(--muted)",marginTop:4}}>Direct bookings 5-12% cheaper</div>
                </div>
              </div>
              <div className="contact-item">
                <div style={{fontSize:32}}>✉️</div>
                <div>
                  <div style={{fontWeight:600,marginBottom:4}}>Email</div>
                  <a href="mailto:contact@KoLakeHouse.com" style={{color:"var(--brand)"}}>contact@KoLakeHouse.com</a>
                </div>
              </div>
              <div className="contact-item">
                <div style={{fontSize:32}}>📍</div>
                <div>
                  <div style={{fontWeight:600,marginBottom:4}}>Location</div>
                  <div>Mirissane Ovita</div>
                  <div>Madolduwa Road</div>
                  <div>Kathaluwa West</div>
                  <div>Ahangama 80650</div>
                  <div style={{fontSize:14,color:"var(--muted)",marginTop:4}}>Southern Province, Sri Lanka</div>
                </div>
              </div>
              <div className="contact-item">
                <div style={{fontSize:32}}>🕐</div>
                <div>
                  <div style={{fontWeight:600,marginBottom:4}}>Response Time</div>
                  <div>Usually within 1 hour</div>
                  <div style={{fontSize:14,color:"var(--muted)"}}>7 days a week</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{fontSize:28,margin:"0 0 24px"}}>Quick Booking</h2>
            <div className="contact-card">
              <p style={{margin:"0 0 24px",color:"var(--muted)"}}>For the best rates and personalized service, contact us directly via WhatsApp.</p>
              <a href="https://wa.me/94711730345?text=Hi! I'd like to book Ko Lake Villa" className="btn btn-primary" style={{width:"100%",fontSize:18,padding:"16px"}}>
                💬 WhatsApp Us Now
              </a>
            </div>
          </div>
        </div>

        {/* WhatsApp Group Join */}
        <div style={{marginTop:64,textAlign:"center"}}>
          <div className="contact-card" style={{maxWidth:600,margin:"0 auto",background:"linear-gradient(135deg,#dcfce7 0%,#bbf7d0 100%)"}}>
            <div style={{fontSize:48,marginBottom:16}}>💬</div>
            <h3 style={{fontSize:24,fontWeight:700,marginBottom:8}}>Join Our WhatsApp Group</h3>
            <p style={{color:"var(--muted)",marginBottom:20}}>Get instant updates, special offers, and 24/7 support from our team</p>
            <a 
              href="https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK" 
              className="btn" 
              style={{background:"#25D366",color:"white",border:"none",fontSize:18,padding:"16px 32px"}}
            >
              💬 Join WhatsApp Group
            </a>
          </div>
        </div>

        {/* WhatsApp Contact Cards - Data Driven */}
        <div style={{marginTop:64}}>
          <h2 style={{fontSize:28,margin:"0 0 24px",textAlign:"center"}}>Direct Contact</h2>
          {contactsLoading ? (
            <div style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Loading contacts...</div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
              {contacts?.map((contact) => {
                const bgColor = contact.role === 'manager' ? '#dcfce7' : 
                               contact.role === 'team_leader' ? '#dbeafe' : 
                               contact.role === 'owner' ? '#fef3c7' : '#f3f4f6';
                const whatsappNumber = contact.whatsapp?.replace(/[^0-9]/g, '') || contact.phone.replace(/[^0-9]/g, '');
                const hasWhatsApp = contact.whatsapp || contact.role === 'manager' || contact.role === 'owner';
                
                return (
                  <div key={contact.id} className="contact-card">
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                      <div style={{width:48,height:48,borderRadius:12,background:bgColor,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:24}}>{contact.icon || '📞'}</span>
                      </div>
                      <div style={{fontWeight:600,fontSize:18}}>{contact.title}</div>
                    </div>
                    <div style={{marginBottom:12}}>
                      <a 
                        href={hasWhatsApp ? `https://wa.me/${whatsappNumber}` : `tel:${contact.phone}`}
                        style={{color:"var(--brand)",fontSize:16,fontWeight:600}}
                      >
                        {contact.phone}
                      </a>
                      <div style={{fontSize:14,color:"var(--muted)",marginTop:4}}>
                        {contact.description}
                      </div>
                      {contact.languages && contact.languages.length > 0 && (
                        <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>
                          🗣️ {contact.languages.join(', ')}
                        </div>
                      )}
                      {contact.location && (
                        <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>
                          📍 {contact.location}
                        </div>
                      )}
                    </div>
                    {hasWhatsApp ? (
                      <a 
                        href={`https://wa.me/${whatsappNumber}?text=Hi! I'd like to inquire about Ko Lake Villa`}
                        className="btn" 
                        style={{width:"100%",background:"#25D366",color:"white",border:"none"}}
                      >
                        💬 WhatsApp {contact.name || contact.title}
                      </a>
                    ) : (
                      <a 
                        href={`tel:${contact.phone}`}
                        className="btn btn-primary" 
                        style={{width:"100%"}}
                      >
                        📞 Call {contact.name || contact.title}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div style={{marginTop:64}}>
          <h2 style={{fontSize:28,margin:"0 0 24px",textAlign:"center"}}>Frequently Asked Questions</h2>
          <div style={{maxWidth:800,margin:"0 auto"}}>
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="faq-item">
                <div className="faq-q">{item.q}</div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginTop:64}}>
          <h2 style={{fontSize:28,margin:"0 0 16px",textAlign:"center"}}>Find Us on the Map</h2>
          <div style={{border:"1px solid var(--line)",borderRadius:16,overflow:"hidden"}}>
            <iframe
              title="Ko Lake Villa Location"
              src="https://maps.google.com/maps?q=Koggala%20Lake%20Sri%20Lanka&t=&z=12&ie=UTF8&iwloc=&output=embed"
              style={{width:"100%",height:400,border:0}}
              loading="lazy"
            />
          </div>
        </div>

        {/* Travel Times */}
        <div style={{marginTop:64}}>
          <h2 style={{fontSize:28,margin:"0 0 24px",textAlign:"center"}}>Travel Times to Ko Lake</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20,maxWidth:1000,margin:"0 auto"}}>
            
            <div className="contact-card" style={{textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>✈️</div>
              <div style={{fontWeight:600,fontSize:18,marginBottom:8}}>Colombo Airport</div>
              <div style={{fontSize:24,fontWeight:700,color:"var(--brand)"}}>2:30 hours</div>
            </div>

            <div className="contact-card" style={{textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>🏙️</div>
              <div style={{fontWeight:600,fontSize:18,marginBottom:8}}>Colombo</div>
              <div style={{fontSize:24,fontWeight:700,color:"var(--brand)"}}>2 hours</div>
            </div>

            <div className="contact-card" style={{textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>🏰</div>
              <div style={{fontWeight:600,fontSize:18,marginBottom:8}}>Galle</div>
              <div style={{fontSize:24,fontWeight:700,color:"var(--brand)"}}>30 minutes</div>
            </div>

            <div className="contact-card" style={{textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>🏄</div>
              <div style={{fontWeight:600,fontSize:18,marginBottom:8}}>Ahangama</div>
              <div style={{fontSize:24,fontWeight:700,color:"var(--brand)"}}>15 minutes</div>
            </div>

            <div className="contact-card" style={{textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>🐘</div>
              <div style={{fontWeight:600,fontSize:18,marginBottom:8}}>Yala</div>
              <div style={{fontSize:24,fontWeight:700,color:"var(--brand)"}}>2:30 hours</div>
            </div>

          </div>
        </div>

        {/* Contact Form */}
        <div id="contact-form" style={{marginTop:64}}>
          <h2 style={{fontSize:28,margin:"0 0 16px",textAlign:"center"}}>Send us a Message</h2>
          <p style={{textAlign:"center",color:"var(--muted)",marginBottom:32}}>Have a question or special request? We'd love to hear from you.</p>
          
          <div className="contact-card" style={{maxWidth:800,margin:"0 auto"}}>
            {formStatus && (
              <div className={`alert alert-${formStatus.type}`}>
                {formStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{marginBottom:16}}>
                <div>
                  <label style={{display:"block",marginBottom:8,fontWeight:600,fontSize:14}}>First Name *</label>
                  <input 
                    type="text" 
                    className="field" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <label style={{display:"block",marginBottom:8,fontWeight:600,fontSize:14}}>Last Name *</label>
                  <input 
                    type="text" 
                    className="field" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div style={{marginBottom:16}}>
                <label style={{display:"block",marginBottom:8,fontWeight:600,fontSize:14}}>Email *</label>
                <input 
                  type="email" 
                  className="field" 
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    setEmailError("");
                  }}
                  style={{borderColor: emailError ? "#ef4444" : "var(--line)"}}
                  required 
                />
                {emailError && (
                  <div className="alert alert-error" style={{marginTop:8}}>
                    {emailError}
                  </div>
                )}
              </div>

              <div style={{marginBottom:16}}>
                <label style={{display:"block",marginBottom:8,fontWeight:600,fontSize:14}}>Phone Number *</label>
                <div style={{display:"flex",gap:8}}>
                  <select 
                    className="field" 
                    style={{width:180}}
                    value={formData.countryCode}
                    onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                    required
                  >
                    <option value="+94">🇱🇰 Sri Lanka +94</option>
                    <option value="+91">🇮🇳 India +91</option>
                    <option value="+1">🇺🇸 USA +1</option>
                    <option value="+44">🇬🇧 UK +44</option>
                    <option value="+61">🇦🇺 Australia +61</option>
                    <option value="+65">🇸🇬 Singapore +65</option>
                    <option value="+60">🇲🇾 Malaysia +60</option>
                    <option value="+66">🇹🇭 Thailand +66</option>
                    <option value="+62">🇮🇩 Indonesia +62</option>
                    <option value="+81">🇯🇵 Japan +81</option>
                    <option value="+86">🇨🇳 China +86</option>
                    <option value="+82">🇰🇷 South Korea +82</option>
                    <option value="+33">🇫🇷 France +33</option>
                    <option value="+49">🇩🇪 Germany +49</option>
                    <option value="+39">🇮🇹 Italy +39</option>
                    <option value="+34">🇪🇸 Spain +34</option>
                    <option value="+64">🇳🇿 New Zealand +64</option>
                    <option value="+27">🇿🇦 South Africa +27</option>
                    <option value="+971">🇦🇪 UAE +971</option>
                    <option value="+966">🇸🇦 Saudi Arabia +966</option>
                  </select>
                  <input 
                    type="tel" 
                    className="field" 
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({...formData, phone: e.target.value});
                      setPhoneWarning("");
                    }}
                    style={{flex:1,borderColor: phoneWarning ? "#f59e0b" : "var(--line)"}}
                    required 
                  />
                </div>
                {phoneWarning && (
                  <div className="alert alert-warning" style={{marginTop:8}}>
                    ⚠️ {phoneWarning}
                  </div>
                )}
              </div>

              <div style={{marginBottom:16}}>
                <label style={{display:"block",marginBottom:8,fontWeight:600,fontSize:14}}>Subject *</label>
                <select 
                  className="field"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="reservation">Reservation Inquiry</option>
                  <option value="general">General Information</option>
                  <option value="special-requests">Special Requests</option>
                  <option value="group-booking">Group Booking</option>
                  <option value="wedding-events">Wedding & Events</option>
                  <option value="spa-wellness">Spa & Wellness</option>
                  <option value="dining">Dining Arrangements</option>
                  <option value="activities">Activities & Experiences</option>
                  <option value="transportation">Transportation</option>
                  <option value="feedback">Feedback & Reviews</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{marginBottom:24}}>
                <label style={{display:"block",marginBottom:8,fontWeight:600,fontSize:14}}>Message *</label>
                <textarea 
                  className="field"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell us about your inquiry or special requests..."
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{width:"100%",fontSize:16,padding:"14px"}}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "📤 Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* 24/7 Emergency Contact */}
        <div className="emergency-banner">
          <div style={{fontSize:40,marginBottom:12}}>🚨</div>
          <h3 style={{fontSize:24,fontWeight:700,marginBottom:8,color:"#92400e"}}>24/7 Emergency Contact</h3>
          <p style={{color:"#92400e",marginBottom:16}}>For urgent matters outside business hours</p>
          <a 
            href="https://wa.me/94711730345?text=EMERGENCY:%20" 
            style={{color:"#d26a1b",fontWeight:700,fontSize:20}}
          >
            📱 +94 71 173 0345
          </a>
          <div style={{fontSize:14,color:"#92400e",marginTop:8}}>Available 24/7 via WhatsApp</div>
        </div>
      </main>
    </>
  );
}
