// Clean Home Page - Overview + CTAs Only
// Links to dedicated pages for each section
import { useNavigate } from "react-router-dom";

export default function SimpleHomeClean() {
  const navigate = useNavigate();

  return (
    <>
      {/* Self-contained CSS */}
      <style>{`
        :root{
          --bg:#ffffff; --ink:#0f172a; --muted:#475569; --line:#e2e8f0;
          --brand:#d26a1b; --brand-ink:#ffffff; --wash:#f8fafc;
        }
        *{box-sizing:border-box}
        html,body,#root{height:100%}
        body{margin:0;background:var(--bg);color:var(--ink);font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;}
        a{color:inherit;text-decoration:none}
        .container{max-width:1120px;margin:0 auto;padding:0 16px}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border-radius:12px;padding:12px 20px;font-weight:600;border:1px solid transparent;cursor:pointer;transition:all .2s}
        .btn-primary{background:var(--brand);color:var(--brand-ink)}
        .btn-primary:hover{background:#b85a15}
        .btn-outline{background:#fff;border-color:var(--line);color:var(--ink)}
        .btn-outline:hover{background:var(--wash)}
        header.sticky{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.95);backdrop-filter:saturate(180%) blur(8px);border-bottom:1px solid var(--line)}
        .nav{display:flex;gap:20px;align-items:center}
        .nav a{font-size:14px;opacity:.9;transition:opacity .2s}
        .nav a:hover{opacity:1}
        .hero{position:relative;height:70vh;min-height:500px;display:flex;align-items:center;justify-content:center}
        .hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .hero::after{content:"";position:absolute;inset:0;background:rgba(0,0,0,.4)}
        .hero .content{position:relative;z-index:10;text-align:center;color:#fff;max-width:800px;padding:0 20px}
        .hero h1{font-size:48px;font-weight:700;margin:0 0 16px;line-height:1.2}
        .hero p{font-size:20px;margin:0 0 32px;opacity:.95}
        @media (max-width: 768px){
          .hero h1{font-size:32px}
          .hero p{font-size:16px}
        }
        .highlights{background:var(--wash);padding:60px 0}
        .grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
        .card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:32px;text-align:center;transition:transform .2s,box-shadow .2s}
        .card:hover{transform:translateY(-4px);box-shadow:0 12px 24px rgba(0,0,0,.08)}
        .card h3{font-size:20px;margin:0 0 12px;color:var(--ink)}
        .card p{color:var(--muted);margin:0;font-size:15px;line-height:1.6}
        .cta-section{padding:80px 0;text-align:center}
        .cta-section h2{font-size:36px;margin:0 0 16px}
        .cta-section p{font-size:18px;color:var(--muted);margin:0 0 32px}
        .btn-group{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
        footer{background:var(--ink);color:#fff;padding:40px 0;text-align:center}
        footer a{opacity:.8;transition:opacity .2s}
        footer a:hover{opacity:1}
      `}</style>

      {/* Header */}
      <header className="sticky">
        <div className="container" style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img 
              src="/ko-lake-logo.jpg" 
              alt="Ko Lake" 
              style={{ width: 56, height: 56, objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <strong>Ko Lake • Ahangama</strong>
          </div>
          <nav className="nav" style={{ display: "flex" }}>
            <a href="/rooms">Rooms</a>
            <a href="/gallery">Gallery</a>
            <a href="/amenities">Amenities</a>
            <a href="/deals">Deals</a>
            <a href="/contact">Contact</a>
            <a href="/admin" style={{ fontSize: 14, opacity: 0.7, fontWeight: 600 }}>Staff</a>
            <a className="btn btn-primary" href="/book">Book Now</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <img src="/src/assets/PoolSunset.jpg" alt="Ko Lake luxury villa" />
        <div className="content">
          <h1>Ko Lake • Ahangama</h1>
          <p>Lakeside Holiday Rental for Surfers, Digital Nomads & Families</p>
          <div className="btn-group">
            <button className="btn btn-primary" onClick={() => navigate('/book')}>
              Check Availability
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/rooms')}>
              View Rooms
            </button>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="highlights">
        <div className="container">
          <div className="grid-3">
            <div className="card">
              <h3>🛏️ 7 Rooms</h3>
              <p>From cozy doubles to family suites, accommodating up to 24 guests</p>
              <button 
                className="btn btn-outline" 
                onClick={() => navigate('/rooms')}
                style={{ marginTop: 16 }}
              >
                View All Rooms
              </button>
            </div>
            <div className="card">
              <h3>🖼️ Stunning Views</h3>
              <p>Overlooking Koggala Lake with direct access to water activities</p>
              <button 
                className="btn btn-outline" 
                onClick={() => navigate('/gallery')}
                style={{ marginTop: 16 }}
              >
                See Gallery
              </button>
            </div>
            <div className="card">
              <h3>⭐ Premium Amenities</h3>
              <p>Unlimited WiFi, private chef, pool, lake access, and more</p>
              <button 
                className="btn btn-outline" 
                onClick={() => navigate('/amenities')}
                style={{ marginTop: 16 }}
              >
                View Amenities
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="container" style={{ padding: "60px 16px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, marginBottom: 16 }}>Why Choose Ko Lake?</h2>
          <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.8 }}>
            Located in Ahangama, Southern Sri Lanka, Ko Lake offers the perfect blend of 
            tranquility and adventure. Whether you're here to surf, work remotely, or 
            enjoy a family vacation, our lakeside villa provides everything you need for 
            an unforgettable stay.
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--brand)" }}>5 min</div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>to surf spots</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--brand)" }}>24/7</div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>WiFi & support</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--brand)" }}>Pet</div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>friendly</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ background: "var(--wash)" }}>
        <div className="container">
          <h2>Ready to Book Your Stay?</h2>
          <p>Check availability and reserve your dates today</p>
          <div className="btn-group">
            <button className="btn btn-primary" onClick={() => navigate('/book')}>
              Check Availability
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/contact')}>
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div style={{ marginBottom: 20 }}>
            <strong style={{ fontSize: 20 }}>Ko Lake • Ahangama</strong>
          </div>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
            <a href="/rooms">Rooms</a>
            <a href="/gallery">Gallery</a>
            <a href="/amenities">Amenities</a>
            <a href="/deals">Deals</a>
            <a href="/contact">Contact</a>
          </div>
          <p style={{ opacity: 0.7, fontSize: 14 }}>
            © {new Date().getFullYear()} Ko Lake. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
