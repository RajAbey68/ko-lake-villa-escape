// Self-contained Contact Page
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

export default function ContactPageSimple() {
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
  
  const handleBookingClick = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);
    
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
              <div style={{marginTop:24,padding:20,background:"#fffbeb",borderRadius:12,border:"1px solid #fbbf24"}}>
                <div style={{fontWeight:600,marginBottom:8}}>💰 Direct Booking Benefits:</div>
                <ul style={{margin:0,paddingLeft:20,fontSize:14}}>
                  <li>5-12% lower than OTAs</li>
                  <li>Flexible check-in/out times</li>
                  <li>Free airport pickup (3+ nights)</li>
                  <li>Complimentary welcome drinks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Contact Cards */}
        <div style={{marginTop:64}}>
          <h2 style={{fontSize:28,margin:"0 0 24px",textAlign:"center"}}>Direct Contact</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
            
            {/* Manager WhatsApp */}
            <div className="contact-card">
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:48,height:48,borderRadius:12,background:"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:24}}>📱</span>
                </div>
                <div style={{fontWeight:600,fontSize:18}}>Manager WhatsApp</div>
              </div>
              <div style={{marginBottom:12}}>
                <a href="https://wa.me/94711730345" style={{color:"var(--brand)",fontSize:16,fontWeight:600}}>+94 71 173 0345</a>
                <div style={{fontSize:14,color:"var(--muted)",marginTop:4}}>Available 24/7</div>
              </div>
              <a 
                href="https://wa.me/94711730345?text=Hi! I'd like to inquire about Ko Lake Villa" 
                className="btn" 
                style={{width:"100%",background:"#25D366",color:"white",border:"none"}}
              >
                💬 WhatsApp Manager
              </a>
            </div>

            {/* Villa Team Leader */}
            <div className="contact-card">
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:48,height:48,borderRadius:12,background:"#dbeafe",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:24}}>👨‍💼</span>
                </div>
                <div style={{fontWeight:600,fontSize:18}}>Villa Team Leader</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{color:"var(--ink)",fontSize:16,fontWeight:600}}>+94 71 173 0345</div>
                <div style={{fontSize:14,color:"var(--muted)",marginTop:4}}>On-site assistance</div>
              </div>
              <a 
                href="tel:+94711730345" 
                className="btn btn-primary" 
                style={{width:"100%"}}
              >
                📞 Call Team Leader
              </a>
            </div>

            {/* Owner Contact */}
            <div className="contact-card">
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:48,height:48,borderRadius:12,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:24}}>👤</span>
                </div>
                <div style={{fontWeight:600,fontSize:18}}>Owner Contact</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{color:"var(--ink)",fontSize:16,fontWeight:600}}>+94 71 173 0345</div>
                <div style={{fontSize:14,color:"var(--muted)",marginTop:4}}>Direct line</div>
              </div>
              <a 
                href="https://wa.me/94711730345?text=Hello, I'd like to speak with the owner about Ko Lake Villa" 
                className="btn" 
                style={{width:"100%",background:"#25D366",color:"white",border:"none"}}
              >
                💬 WhatsApp Owner
              </a>
            </div>

            {/* WhatsApp Group */}
            <div className="contact-card">
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:48,height:48,borderRadius:12,background:"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:24}}>👥</span>
                </div>
                <div style={{fontWeight:600,fontSize:18}}>WhatsApp Group</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:14,color:"var(--muted)"}}>Join our guest group</div>
                <div style={{fontSize:14,color:"var(--muted)",marginTop:4}}>Instant support & updates</div>
              </div>
              <button 
                className="btn" 
                style={{width:"100%",background:"#25D366",color:"white",border:"none"}}
                disabled
              >
                💬 Join Group (Coming Soon)
              </button>
            </div>

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
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
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
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{flex:1}}
                    required 
                  />
                </div>
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
      </main>
    </>
  );
}
