// Self-contained Rooms Page - No database dependency
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Room1Img from "@/assets/1 (3).jpg";
import Room2Img from "@/assets/2 (5).jpg";
import Room3Img from "@/assets/3 (3).jpg";
import Room4Img from "@/assets/4 (3).jpg";
import Room6Img from "@/assets/6 (1).jpg";
import Room8Img from "@/assets/8 (1).jpg";
import Room9Img from "@/assets/9.jpg";

const ROOMS = [
  { 
    key: "family-suite", 
    name: "Family Suite (Pool & Stream)", 
    pax: 4, 
    size: "38 m²", 
    blurb: "Family suite by the pool & stream; French doors; lounge.", 
    price: 120,
    image: Room1Img,
    features: ["Pool view", "Stream access", "French doors", "Lounge area", "Sleeps 4"]
  },
  { 
    key: "group-room", 
    name: "Group Room (Pool & Garden)", 
    pax: 6, 
    size: "42 m²", 
    blurb: "Sleeps up to 6; ideal for surf crews & families.", 
    price: 140,
    image: Room2Img,
    features: ["Garden view", "Pool access", "Sleeps 6", "Perfect for groups", "Spacious"]
  },
  { 
    key: "madolduwa-view", 
    name: "Madol Duwa View", 
    pax: 3, 
    size: "28 m²", 
    blurb: "Large windows; lake & island outlook.", 
    price: 95,
    image: Room3Img,
    features: ["Lake view", "Island outlook", "Large windows", "Sleeps 3", "Natural light"]
  },
  { 
    key: "lake-room", 
    name: "Lake Room (Pool-Left View)", 
    pax: 2, 
    size: "26 m²", 
    blurb: "Direct lake & pool aspect; sunrise light.", 
    price: 90,
    image: Room4Img,
    features: ["Lake view", "Pool view", "Sunrise", "Sleeps 2", "Romantic"]
  },
  { 
    key: "bridge-lake", 
    name: "Bridge Lake View (2F)", 
    pax: 2, 
    size: "26 m²", 
    blurb: "Iconic bridge & lake panorama; upstairs.", 
    price: 98,
    image: Room6Img,
    features: ["Bridge view", "Lake panorama", "Second floor", "Sleeps 2", "Iconic view"]
  },
  { 
    key: "highlake", 
    name: "Highlake (2F)", 
    pax: 3, 
    size: "30 m²", 
    blurb: "Elevated lake view; breezy & bright.", 
    price: 105,
    image: Room8Img,
    features: ["Elevated view", "Lake view", "Breezy", "Bright", "Sleeps 3"]
  },
  { 
    key: "roof-garden", 
    name: "Roof Garden View (2F)", 
    pax: 2, 
    size: "24 m²", 
    blurb: "Opens to roof garden; sunset spot.", 
    price: 92,
    image: Room9Img,
    features: ["Roof garden", "Sunset view", "Second floor", "Sleeps 2", "Private"]
  },
];

export default function RoomsPageSimple() {
  const navigate = useNavigate();
  const handleBookingClick = () => navigate('/contact');
  
  return (
    <>
      <style>{`
        :root{
          --bg:#ffffff; --ink:#0f172a; --muted:#475569; --line:#e2e8f0;
          --brand:#d26a1b; --brand-ink:#ffffff; --wash:#f8fafc;
        }
        *{box-sizing:border-box}
        html,body{height:100%;margin:0;background:var(--bg);color:var(--ink);font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;}
        a{color:inherit;text-decoration:none}
        .container{max-width:1120px;margin:0 auto;padding:0 16px}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border-radius:12px;padding:12px 16px;font-weight:600;border:1px solid transparent;cursor:pointer}
        .btn-primary{background:var(--brand);color:var(--brand-ink)}
        header.sticky{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.82);backdrop-filter:saturate(180%) blur(8px);border-bottom:1px solid var(--line)}
        .nav{display:flex;gap:20px;align-items:center}
        .nav a{font-size:14px;opacity:.9}
        .room-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px;margin-top:32px}
        .room-card{border:1px solid var(--line);border-radius:16px;overflow:hidden;transition:transform .2s,box-shadow .2s}
        .room-card:hover{transform:translateY(-4px);box-shadow:0 12px 24px rgba(0,0,0,.1)}
        .room-card img{width:100%;height:240px;object-fit:cover}
        .room-content{padding:20px}
        .room-header{display:flex;justify-content:space-between;align-items:start;margin-bottom:12px}
        .room-price{font-size:24px;font-weight:700;color:var(--brand)}
        .room-features{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
        .feature-tag{background:var(--wash);padding:4px 12px;border-radius:20px;font-size:12px;color:var(--muted)}
        .room-meta{display:flex;gap:16px;margin-top:12px;font-size:14px;color:var(--muted)}
      `}</style>

      {/* Navigation */}
      <Navigation onBookingClick={handleBookingClick} />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", padding: "64px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 48, margin: "0 0 16px", fontWeight: 700 }}>Rooms & Suites</h1>
          <p style={{ fontSize: 20, color: "var(--muted)", maxWidth: 700, margin: "0 auto" }}>
            7 unique rooms with lake views, modern amenities, and authentic Sri Lankan hospitality
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--brand)" }}>7</div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>Rooms</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--brand)" }}>24</div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>Max Guests</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--brand)" }}>$90+</div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>Per Night</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <main className="container" style={{ padding: "64px 16px" }}>
        <div className="room-grid">
          {ROOMS.map((room) => (
            <article key={room.key} className="room-card">
              <img src={room.image} alt={room.name} />
              <div className="room-content">
                <div className="room-header">
                  <div>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{room.name}</h3>
                    <div className="room-meta">
                      <span>👥 {room.pax} guests</span>
                      <span>📐 {room.size}</span>
                    </div>
                  </div>
                  <div className="room-price">${room.price}</div>
                </div>
                <p style={{ color: "var(--muted)", margin: "12px 0", fontSize: 14 }}>{room.blurb}</p>
                <div className="room-features">
                  {room.features.map((feature, idx) => (
                    <span key={idx} className="feature-tag">{feature}</span>
                  ))}
                </div>
                <a href="/contact" className="btn btn-primary" style={{ width: "100%", marginTop: 16 }}>
                  Book Now
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Info Section */}
        <div style={{ marginTop: 64, padding: 32, background: "var(--wash)", borderRadius: 16, textAlign: "center" }}>
          <h2 style={{ fontSize: 28, margin: "0 0 16px" }}>All Rooms Include</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginTop: 32 }}>
            <div>
              <div style={{ fontSize: 32 }}>🌊</div>
              <div style={{ fontWeight: 600, marginTop: 8 }}>Lake Views</div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>Stunning Koggala Lake</div>
            </div>
            <div>
              <div style={{ fontSize: 32 }}>❄️</div>
              <div style={{ fontWeight: 600, marginTop: 8 }}>Air Conditioning</div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>Climate controlled</div>
            </div>
            <div>
              <div style={{ fontSize: 32 }}>📶</div>
              <div style={{ fontWeight: 600, marginTop: 8 }}>Free WiFi</div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>High-speed unlimited</div>
            </div>
            <div>
              <div style={{ fontSize: 32 }}>🛁</div>
              <div style={{ fontWeight: 600, marginTop: 8 }}>Private Bathroom</div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>Hot water shower</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
