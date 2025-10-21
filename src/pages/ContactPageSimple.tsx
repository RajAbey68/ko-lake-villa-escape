// Self-contained Contact Page
import { Navigation } from "@/components/Navigation";

export default function ContactPageSimple() {
  const handleBookingClick = () => {
    // Already on contact page, scroll to form
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
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

        <div style={{marginTop:64}}>
          <h2 style={{fontSize:28,margin:"0 0 16px",textAlign:"center"}}>Find Us</h2>
          <div style={{border:"1px solid var(--line)",borderRadius:16,overflow:"hidden"}}>
            <iframe
              title="Ko Lake Villa Location"
              src="https://maps.google.com/maps?q=Koggala%20Lake%20Sri%20Lanka&t=&z=12&ie=UTF8&iwloc=&output=embed"
              style={{width:"100%",height:400,border:0}}
              loading="lazy"
            />
          </div>
        </div>
      </main>
    </>
  );
}
