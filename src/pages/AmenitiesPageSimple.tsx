// Self-contained Amenities/Experiences Page - No database dependency
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import PoolSunsetImg from "@/assets/PoolSunset.jpg";

const AMENITIES = [
  {
    category: "Accommodation",
    icon: "🏠",
    items: ["7 rooms with lake views", "Air conditioning", "Hot water", "Unlimited WiFi", "Private bathrooms"]
  },
  {
    category: "Dining",
    icon: "🍽️",
    items: ["Private chef on request", "Fully equipped kitchen", "BBQ facilities", "Indoor & outdoor dining"]
  },
  {
    category: "Recreation",
    icon: "🌊",
    items: ["Lap pool with lake views", "Roof garden", "Direct lake access", "Fishing & kayaking", "Birdwatching"]
  },
  {
    category: "Activities",
    icon: "🏄",
    items: ["Near surf spots", "Lake safari tours", "Tea plantation visits", "Hiking trails", "Whale watching"]
  },
  {
    category: "Services",
    icon: "🛎️",
    items: ["Airport transfers", "Tuk-tuk hire", "Laundry service", "Daily housekeeping", "Tour booking"]
  },
  {
    category: "Special",
    icon: "✨",
    items: ["Digital nomad friendly", "Event venue", "Pet friendly", "Senior friendly", "Off-street parking"]
  }
];

export default function AmenitiesPageSimple() {
  const navigate = useNavigate();
  const handleBookingClick = () => navigate('/contact');
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
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
        .card{background:var(--wash);padding:24px;border-radius:16px;border:1px solid var(--line)}
        .card h3{margin:0 0 16px;font-size:18px}.card ul{list-style:none;padding:0;margin:0}
        .card li{padding:6px 0;display:flex;gap:8px;align-items:start;font-size:14px}
        .card li:before{content:"✓";color:var(--brand);font-weight:700}
      `}</style>

      <Navigation onBookingClick={handleBookingClick} />

      <section style={{backgroundImage:`linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(${PoolSunsetImg})`,backgroundSize:"cover",backgroundPosition:"center",padding:"100px 0",color:"white"}}>
        <div className="container" style={{textAlign:"center"}}>
          <h1 style={{fontSize:48,margin:"0 0 16px",fontWeight:700,textShadow:"0 2px 4px rgba(0,0,0,0.3)"}}>Amenities & Experiences</h1>
          <p style={{fontSize:20,maxWidth:700,margin:"0 auto",textShadow:"0 1px 2px rgba(0,0,0,0.3)"}}>Everything you need for an unforgettable lakeside stay</p>
        </div>
      </section>

      <main className="container" style={{padding:"64px 16px"}}>
        <div className="grid">
          {AMENITIES.map((section,idx)=>(
            <div key={idx} className="card">
              <div style={{fontSize:40,marginBottom:12}}>{section.icon}</div>
              <h3>{section.category}</h3>
              <ul>{section.items.map((item,i)=><li key={i}>{item}</li>)}</ul>
            </div>
          ))}
        </div>

        <div style={{marginTop:64,padding:40,background:"var(--wash)",borderRadius:16,textAlign:"center"}}>
          <h2 style={{fontSize:32,margin:"0 0 24px"}}>Nearby Attractions</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:24}}>
            {[
              {name:"Kabalana Beach",dist:"3 km",type:"🏄 Surfing"},
              {name:"Midigama Beach",dist:"5 km",type:"🏄 Surfing"},
              {name:"Galle Fort",dist:"15 km",type:"🏛️ Culture"},
              {name:"Tea Plantations",dist:"30 km",type:"🍵 Nature"}
            ].map((p,i)=>(
              <div key={i} style={{textAlign:"left"}}>
                <div style={{fontWeight:600,marginBottom:4}}>{p.name}</div>
                <div style={{fontSize:14,color:"var(--muted)"}}>{p.dist} • {p.type}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
