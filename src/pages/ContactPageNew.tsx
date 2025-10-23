// Redesigned Contact Page - Visual-First, Conversion-Focused
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useContacts } from "@/hooks/useContacts";
import PoolSunsetImg from "@/assets/PoolSunset.jpg";

const QUICK_MESSAGES = [
  "I'd like to check availability for my dates",
  "What are your best rates for direct booking?",
  "Can you help arrange airport pickup?",
  "I have questions about your villa"
];

const VALUE_PROPS = [
  { icon: "💰", title: "Save 5-12%", desc: "Direct booking discounts" },
  { icon: "⚡", title: "Instant Response", desc: "Usually within 1 hour" },
  { icon: "🎯", title: "Personalized Service", desc: "Tailored to your needs" },
  { icon: "🏆", title: "Local Expertise", desc: "Insider tips & guidance" }
];

const FAQ_ITEMS = [
  { q: "How do I get the best rate?", a: "Book directly via WhatsApp or our contact form for 5-12% savings compared to booking platforms." },
  { q: "What's included in the rate?", a: "All rates include WiFi, parking, pool access, and basic amenities. Meals and activities can be arranged separately." },
  { q: "Do you offer airport transfers?", a: "Yes! We can arrange comfortable airport pickup from Colombo (2.5 hours). Contact us for rates." },
  { q: "What's your cancellation policy?", a: "Flexible cancellation up to 7 days before arrival. Contact us for specific terms." },
  { q: "Can you help plan activities?", a: "Absolutely! We offer surfing, whale watching, Galle Fort tours, and more. Just ask!" },
  { q: "Is the villa child-friendly?", a: "Yes, we welcome families! The pool area is secure and we can arrange child-friendly activities." }
];

export default function ContactPageNew() {
  const { data: contacts } = useContacts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappSame: true,
    message: ""
  });
  const [formStatus, setFormStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleBookingClick = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickMessage = (msg: string) => {
    setFormData(prev => ({ ...prev, message: msg }));
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
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        }]);

      if (error) throw error;

      setFormStatus({type: 'success', message: "Message sent! We'll respond within 1 hour. Check your email."});
      setFormData({ name: "", email: "", phone: "", whatsappSame: true, message: "" });
    } catch (error) {
      setFormStatus({type: 'error', message: "Error sending message. Please WhatsApp us instead."});
    }
    
    setIsSubmitting(false);
  };

  const primaryContact = contacts?.find(c => c.role === 'manager') || contacts?.[0];
  const whatsappNumber = primaryContact?.whatsapp?.replace(/[^0-9]/g, '') || '94711730345';

  return (
    <>
      <style>{`
        :root{
          --bg:#fff; --ink:#0f172a; --muted:#64748b; --line:#e2e8f0;
          --brand:#d26a1b; --brand-dark:#b85a15; --brand-ink:#fff; --wash:#f8fafc;
          --success:#10b981; --error:#ef4444; --warning:#f59e0b;
        }
        *{box-sizing:border-box; margin:0; padding:0}
        html,body{height:100%; background:var(--bg); color:var(--ink); 
          font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial;
          line-height:1.6; -webkit-font-smoothing:antialiased}
        a{color:inherit; text-decoration:none}
        button{font-family:inherit; cursor:pointer}
        
        .container{max-width:1200px; margin:0 auto; padding:0 20px}
        
        /* Hero Section */
        .hero{
          position:relative; height:85vh; min-height:600px; display:flex; align-items:center; justify-content:center;
          background:linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(${PoolSunsetImg});
          background-size:cover; background-position:center; color:#fff; text-align:center;
        }
        .hero-content{max-width:800px; padding:40px 20px; animation:fadeInUp 0.8s ease-out}
        .hero h1{font-size:clamp(36px, 6vw, 64px); font-weight:800; margin-bottom:20px; line-height:1.1; 
          text-shadow:0 2px 20px rgba(0,0,0,0.3)}
        .hero p{font-size:clamp(18px, 2.5vw, 24px); margin-bottom:40px; opacity:0.95}
        
        /* Buttons */
        .btn{
          display:inline-flex; align-items:center; justify-content:center; gap:10px;
          padding:16px 32px; border-radius:12px; font-weight:600; font-size:18px;
          border:none; transition:all 0.3s ease; text-decoration:none;
        }
        .btn-whatsapp{
          background:#25D366; color:#fff; box-shadow:0 4px 20px rgba(37,211,102,0.4);
        }
        .btn-whatsapp:hover{background:#20BA5A; transform:translateY(-2px); box-shadow:0 6px 30px rgba(37,211,102,0.5)}
        .btn-secondary{
          background:rgba(255,255,255,0.2); color:#fff; border:2px solid rgba(255,255,255,0.5);
          backdrop-filter:blur(10px);
        }
        .btn-secondary:hover{background:rgba(255,255,255,0.3); border-color:#fff}
        .btn-primary{background:var(--brand); color:var(--brand-ink)}
        .btn-primary:hover{background:var(--brand-dark); transform:translateY(-1px)}
        
        /* Contact Cards */
        .contact-cards{
          display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px;
          margin:80px auto; padding:0 20px;
        }
        .contact-card{
          background:#fff; border-radius:16px; padding:32px; text-align:center;
          box-shadow:0 4px 20px rgba(0,0,0,0.08); transition:all 0.3s ease;
          border:2px solid transparent;
        }
        .contact-card:hover{transform:translateY(-4px); box-shadow:0 8px 30px rgba(0,0,0,0.12)}
        .contact-card.featured{border-color:var(--success); background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)}
        .contact-card .icon{font-size:48px; margin-bottom:16px}
        .contact-card h3{font-size:24px; font-weight:700; margin-bottom:8px}
        .contact-card p{color:var(--muted); margin-bottom:20px; font-size:15px}
        
        /* Value Props */
        .value-props{
          background:var(--wash); padding:80px 20px; margin:80px 0;
        }
        .value-grid{
          display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:32px;
          max-width:1200px; margin:40px auto 0;
        }
        .value-item{text-align:center}
        .value-item .icon{font-size:56px; margin-bottom:16px; display:block}
        .value-item h4{font-size:20px; font-weight:700; margin-bottom:8px}
        .value-item p{color:var(--muted); font-size:15px}
        
        /* Form */
        .form-section{max-width:700px; margin:80px auto; padding:0 20px}
        .form-card{background:#fff; border-radius:20px; padding:48px; box-shadow:0 8px 40px rgba(0,0,0,0.1)}
        .field{
          width:100%; padding:14px 16px; border:2px solid var(--line); border-radius:10px;
          font-size:16px; transition:border-color 0.3s ease; margin-bottom:20px;
        }
        .field:focus{outline:none; border-color:var(--brand)}
        textarea.field{min-height:120px; resize:vertical; font-family:inherit}
        .quick-replies{display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px}
        .quick-reply{
          padding:8px 16px; background:var(--wash); border:1px solid var(--line);
          border-radius:20px; font-size:14px; cursor:pointer; transition:all 0.2s;
        }
        .quick-reply:hover{background:var(--brand); color:#fff; border-color:var(--brand)}
        
        /* FAQ */
        .faq-section{max-width:800px; margin:80px auto; padding:0 20px}
        .faq-item{
          background:#fff; border-radius:12px; margin-bottom:12px; overflow:hidden;
          border:1px solid var(--line); transition:all 0.3s ease;
        }
        .faq-item.active{border-color:var(--brand); box-shadow:0 4px 12px rgba(210,106,27,0.1)}
        .faq-q{
          padding:20px 24px; font-weight:600; font-size:17px; cursor:pointer;
          display:flex; justify-content:space-between; align-items:center;
        }
        .faq-q:hover{background:var(--wash)}
        .faq-a{
          padding:0 24px 20px; color:var(--muted); font-size:15px; line-height:1.7;
          display:none;
        }
        .faq-item.active .faq-a{display:block}
        
        /* Trust Signals */
        .trust-bar{
          background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding:24px; text-align:center; border-radius:16px; margin:60px 0;
          border:2px solid var(--warning);
        }
        .trust-bar h3{font-size:24px; font-weight:700; color:#92400e; margin-bottom:8px}
        .trust-bar p{color:#78350f; font-size:16px}
        
        /* Animations */
        @keyframes fadeInUp{from{opacity:0; transform:translateY(30px)} to{opacity:1; transform:translateY(0)}}
        
        /* Responsive */
        @media(max-width:768px){
          .hero{height:70vh; min-height:500px}
          .hero h1{font-size:36px}
          .btn{padding:14px 24px; font-size:16px}
          .form-card{padding:32px 24px}
          .contact-cards{grid-template-columns:1fr}
        }
        
        /* Alert */
        .alert{padding:16px; border-radius:12px; margin-bottom:20px; font-size:15px}
        .alert-success{background:#d1fae5; border:2px solid var(--success); color:#065f46}
        .alert-error{background:#fee2e2; border:2px solid var(--error); color:#991b1b}
      `}</style>

      <Navigation onBookingClick={handleBookingClick} />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Let's Plan Your Perfect Sri Lankan Escape</h1>
          <p>Direct bookings save 5-12% • Instant WhatsApp response • Personalized service</p>
          <div style={{display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap'}}>
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hi! I'd like to inquire about Ko Lake Villa`}
              className="btn btn-whatsapp"
            >
              💬 WhatsApp Us Now
            </a>
            <button onClick={handleBookingClick} className="btn btn-secondary">
              Or Fill the Form
            </button>
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <div className="container">
        <div className="contact-cards">
          <div className="contact-card featured">
            <div className="icon">💬</div>
            <h3>WhatsApp</h3>
            <p>Fastest response • Usually within 1 hour</p>
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hi! I'd like to inquire about Ko Lake Villa`}
              className="btn btn-whatsapp"
              style={{width:'100%'}}
            >
              Chat Now
            </a>
          </div>

          <div className="contact-card">
            <div className="icon">📞</div>
            <h3>Call Us</h3>
            <p>Speak directly with our team</p>
            <a href={`tel:+${whatsappNumber}`} className="btn btn-primary" style={{width:'100%'}}>
              +94 71 173 0345
            </a>
          </div>

          <div className="contact-card">
            <div className="icon">✉️</div>
            <h3>Email</h3>
            <p>For detailed inquiries</p>
            <a href="mailto:contact@KoLakeHouse.com" className="btn btn-primary" style={{width:'100%'}}>
              Send Email
            </a>
          </div>
        </div>
      </div>

      {/* Value Props */}
      <section className="value-props">
        <div className="container" style={{textAlign:'center'}}>
          <h2 style={{fontSize:40, fontWeight:800, marginBottom:12}}>Why Book Direct?</h2>
          <p style={{fontSize:18, color:'var(--muted)', marginBottom:40}}>
            Get the best experience and save money
          </p>
          <div className="value-grid">
            {VALUE_PROPS.map((prop, idx) => (
              <div key={idx} className="value-item">
                <span className="icon">{prop.icon}</span>
                <h4>{prop.title}</h4>
                <p>{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="form-section" id="contact-form">
        <div style={{textAlign:'center', marginBottom:40}}>
          <h2 style={{fontSize:40, fontWeight:800, marginBottom:12}}>Send Us a Message</h2>
          <p style={{fontSize:18, color:'var(--muted)'}}>
            We'll respond within 1 hour during business hours
          </p>
        </div>

        <div className="form-card">
          {formStatus && (
            <div className={`alert alert-${formStatus.type}`}>
              {formStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="field"
              placeholder="Your Name *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />

            <input
              type="email"
              className="field"
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />

            <input
              type="tel"
              className="field"
              placeholder="Phone / WhatsApp Number *"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />

            <div style={{marginBottom:20}}>
              <label style={{fontSize:14, fontWeight:600, marginBottom:12, display:'block'}}>
                Quick Message Templates:
              </label>
              <div className="quick-replies">
                {QUICK_MESSAGES.map((msg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="quick-reply"
                    onClick={() => handleQuickMessage(msg)}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="field"
              placeholder="Your Message *"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            />

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{width:'100%', fontSize:18, padding:'16px'}}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "📤 Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* Trust Signal */}
      <div className="container">
        <div className="trust-bar">
          <h3>🚨 24/7 Emergency Support Available</h3>
          <p>For urgent matters, WhatsApp us anytime at +94 71 173 0345</p>
        </div>
      </div>

      {/* FAQ */}
      <section className="faq-section">
        <div style={{textAlign:'center', marginBottom:40}}>
          <h2 style={{fontSize:40, fontWeight:800, marginBottom:12}}>Frequently Asked Questions</h2>
          <p style={{fontSize:18, color:'var(--muted)'}}>
            Quick answers to common questions
          </p>
        </div>

        {FAQ_ITEMS.map((item, idx) => (
          <div 
            key={idx} 
            className={`faq-item ${expandedFaq === idx ? 'active' : ''}`}
          >
            <div 
              className="faq-q" 
              onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
            >
              <span>{item.q}</span>
              <span style={{fontSize:24}}>{expandedFaq === idx ? '−' : '+'}</span>
            </div>
            <div className="faq-a">{item.a}</div>
          </div>
        ))}
      </section>

      {/* Final CTA */}
      <section style={{background:'var(--wash)', padding:'80px 20px', textAlign:'center'}}>
        <div className="container">
          <h2 style={{fontSize:40, fontWeight:800, marginBottom:16}}>Ready to Book Your Stay?</h2>
          <p style={{fontSize:20, color:'var(--muted)', marginBottom:32}}>
            Contact us now for the best rates and personalized service
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=Hi! I'm ready to book Ko Lake Villa`}
            className="btn btn-whatsapp"
            style={{fontSize:20, padding:'20px 40px'}}
          >
            💬 WhatsApp Us Now
          </a>
        </div>
      </section>
    </>
  );
}
