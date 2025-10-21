// Self-contained Deals Page
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

export default function DealsPageSimple() {
  const navigate = useNavigate();
  const handleBookingClick = () => navigate('/contact');
  const DEALS = [
    {title:"Long Stay Discount",desc:"Stay 7+ nights and save 15%",icon:"📅",badge:"Popular"},
    {title:"Early Bird",desc:"Book 30+ days ahead, save 10%",icon:"🐦",badge:"Limited"},
    {title:"Group Booking",desc:"Book all 7 rooms, get 20% off",icon:"👥",badge:"Best Value"},
    {title:"Surf Package",desc:"5 nights + surf lessons + transfers",icon:"🏄",badge:"New"},
  ];

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
        .deal-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;margin-top:32px}
        .deal-card{padding:32px;border:2px solid var(--line);border-radius:16px;position:relative;transition:transform .2s,box-shadow .2s}
        .deal-card:hover{transform:translateY(-4px);box-shadow:0 12px 24px rgba(0,0,0,.1);border-color:var(--brand)}
        .badge{position:absolute;top:16px;right:16px;background:var(--brand);color:white;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
      `}</style>

      <Navigation onBookingClick={handleBookingClick} />

      <section style={{background:"linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)",padding:"64px 0"}}>
        <div className="container" style={{textAlign:"center"}}>
          <h1 style={{fontSize:48,margin:"0 0 16px",fontWeight:700}}>Special Offers</h1>
          <p style={{fontSize:20,color:"var(--muted)",maxWidth:700,margin:"0 auto"}}>Save more with our exclusive direct booking deals</p>
        </div>
      </section>

      <main className="container" style={{padding:"64px 16px"}}>
        <div className="deal-grid">
          {DEALS.map((deal,i)=>(
            <div key={i} className="deal-card">
              <span className="badge">{deal.badge}</span>
              <div style={{fontSize:56,marginBottom:16}}>{deal.icon}</div>
              <h3 style={{fontSize:24,margin:"0 0 12px",fontWeight:600}}>{deal.title}</h3>
              <p style={{color:"var(--muted)",margin:"0 0 24px",fontSize:16}}>{deal.desc}</p>
              <a href="/contact" className="btn btn-primary" style={{width:"100%"}}>Inquire Now</a>
            </div>
          ))}
        </div>

        <div style={{marginTop:64,padding:40,background:"#fffbeb",borderRadius:16,textAlign:"center",border:"2px solid #fbbf24"}}>
          <h2 style={{fontSize:32,margin:"0 0 16px"}}>💰 Direct Booking Advantage</h2>
          <p style={{fontSize:18,color:"var(--muted)",maxWidth:700,margin:"0 auto 24px"}}>
            Book directly via WhatsApp and save 5-12% compared to OTAs. Plus get flexible check-in/out times and personalized service.
          </p>
          <a href="https://wa.me/94711730345?text=Hi! I'd like to know about your special offers" className="btn btn-primary" style={{fontSize:18,padding:"16px 32px"}}>
            WhatsApp for Best Rates
          </a>
        </div>
      </main>
    </>
  );
}
