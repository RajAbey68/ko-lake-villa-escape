// Simple 7-Room STR site for React + Vite (self-contained CSS)
// Flow: Hero → Availability → Rooms (7) → Gallery → Amenities → Map → Reviews → Contact
import { useMemo, useState, useEffect, useRef } from "react";

const ROOMS = [
  { key: "family-suite", name: "Family Suite (Pool & Stream)", pax: 4, size: "38 m²", blurb: "Family suite by the pool & stream; French doors; lounge.", price: 120 },
  { key: "group-room", name: "Group Room (Pool & Garden)", pax: 6, size: "42 m²", blurb: "Sleeps up to 6; ideal for surf crews & families.", price: 140 },
  { key: "madolduwa-view", name: "Madol Duwa View", pax: 3, size: "28 m²", blurb: "Large windows; lake & island outlook.", price: 95 },
  { key: "lake-room", name: "Lake Room (Pool-Left View)", pax: 2, size: "26 m²", blurb: "Direct lake & pool aspect; sunrise light.", price: 90 },
  { key: "bridge-lake", name: "Bridge Lake View (2F)", pax: 2, size: "26 m²", blurb: "Iconic bridge & lake panorama; upstairs.", price: 98 },
  { key: "highlake", name: "Highlake (2F)", pax: 3, size: "30 m²", blurb: "Elevated lake view; breezy & bright.", price: 105 },
  { key: "roof-garden", name: "Roof Garden View (2F)", pax: 2, size: "24 m²", blurb: "Opens to roof garden; sunset spot.", price: 92 },
];

export default function SimpleHome() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    toddlers: 0
  });
  
  const guestPickerRef = useRef<HTMLDivElement>(null);
  const totalGuests = guests.adults + guests.children + guests.toddlers;
  
  // Close guest picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setShowGuestPicker(false);
      }
    };
    
    if (showGuestPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGuestPicker]);
  
  const handleCheckInChange = (date: string) => {
    setCheckIn(date);
    // If checkout is before or same as new checkin, clear it
    if (checkOut && checkOut <= date) {
      setCheckOut('');
    }
  };
  
  const updateGuests = (type: 'adults' | 'children' | 'toddlers', increment: boolean) => {
    setGuests(prev => {
      const newValue = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      
      // Enforce limits
      if (type === 'adults' && newValue > 24) return prev;
      if (type === 'children' && newValue > 4) return prev;
      if (type === 'toddlers' && newValue > 2) return prev;
      
      // At least 1 adult required
      if (type === 'adults' && newValue < 1) return prev;
      
      return { ...prev, [type]: newValue };
    });
  };

  return (
    <>
      {/* --- Self-contained CSS --- */}
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
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border-radius:12px;padding:12px 16px;font-weight:600;border:1px solid transparent;cursor:pointer}
        .btn-primary{background:var(--brand);color:var(--brand-ink)}
        .btn-ghost{background:#fff;border-color:var(--line)}
        header.sticky{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.82);backdrop-filter:saturate(180%) blur(8px);border-bottom:1px solid var(--line)}
        .nav{display:flex;gap:20px;align-items:center}
        .nav a{font-size:14px;opacity:.9}
        .hero{position:relative;height:62vh;min-height:420px}
        .hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .hero::after{content:"";position:absolute;inset:0;background:rgba(0,0,0,.35)}
        .hero .copy{position:absolute;inset:0;display:flex;align-items:center;z-index:10}
        .hero h1{color:#fff;font-size:14px;line-height:1.3;margin:0 0 12px;font-weight:400}
        .hero p{color:#eef2ff;max-width:700px;margin:0 0 18px}
        @media (min-width: 860px){ .hero h1{font-size:21px} }

        .strip{background:var(--wash);border-block:1px solid var(--line)}
        .grid{display:grid;gap:16px}
        @media (min-width: 860px){ .grid-5{grid-template-columns:repeat(5,1fr)} .grid-3{grid-template-columns:repeat(3,1fr)} .grid-2{grid-template-columns:repeat(2,1fr)} }

        .field{border:1px solid var(--line);padding:12px 14px;border-radius:12px;font-size:14px}
        .muted{color:var(--muted);font-size:14px}

        .room{border:1px solid var(--line);border-radius:18px;overflow:hidden;background:#fff;transition:box-shadow .2s}
        .room:hover{box-shadow:0 10px 22px rgba(2,8,23,.06)}
        .room img{width:100%;height:190px;object-fit:cover;display:block}
        .room .pad{padding:14px}
        .room h3{margin:2px 0 4px;font-size:16px}
        .room .meta{color:var(--muted);font-size:13px;margin-top:6px}
        .room .row{display:flex;align-items:center;justify-content:space-between;margin-top:10px}

        .masonry{column-count:2;column-gap:10px}
        @media (min-width: 860px){ .masonry{column-count:3} }
        .masonry figure{margin:0 0 10px;border-radius:12px;overflow:hidden;border:1px solid var(--line)}
        .masonry img{width:100%;height:auto;display:block}

        .card{border:1px solid var(--line);border-radius:16px;background:#fff;padding:16px}

        .guest-picker{position:relative}
        .guest-dropdown{position:absolute;top:100%;left:0;right:0;margin-top:4px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px;box-shadow:0 4px 12px rgba(0,0,0,0.1);z-index:10}
        .guest-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
        .guest-row:last-child{border-bottom:none}
        .guest-controls{display:flex;gap:12px;align-items:center}
        .guest-btn{width:32px;height:32px;border-radius:8px;border:1px solid var(--line);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600}
        .guest-btn:hover{background:var(--wash)}
        .guest-btn:disabled{opacity:0.3;cursor:not-allowed}
        .guest-count{min-width:30px;text-align:center;font-weight:600}

        footer{border-top:1px solid var(--line);color:var(--muted);text-align:center;padding:20px}
      `}</style>

      {/* Top bar */}
      <header className="sticky">
        <div className="container" style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ 
              width: 56, 
              height: 56, 
              borderRadius: "50%", 
              background: "linear-gradient(135deg, #d26a1b 0%, #e88a3d 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 24,
              fontWeight: 700
            }}>KL</div>
            <strong>Ko Lake • Ahangama</strong>
          </div>
          <nav className="nav" style={{ display: "flex" }}>
            <a href="#rooms">Rooms</a>
            <a href="/gallery">Gallery</a>
            <a href="#amenities">Amenities</a>
            <a href="/deals">Deals</a>
            <a href="#map">Location</a>
            <a href="#contact">Contact</a>
            <a href="/admin" style={{ fontSize: 14, opacity: 0.7, fontWeight: 600 }}>Staff</a>
            <a className="btn btn-primary" href="#book">Book Now</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <img src="/src/assets/PoolSunset.jpg" alt="Ko Lake luxury villa pool at sunset overlooking Koggala Lake, Ahangama Sri Lanka" />
        <div className="copy">
          <div className="container">
            <div style={{ maxWidth: 900 }}>
              <h1>Lakeside Holiday Rental for Surfers, Digital Nomads & Families</h1>
              <p>7 rooms • Unlimited WiFi • Private chef • Lake access • Near surf spots & wildlife safaris • Pet friendly</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="#book" className="btn btn-primary">Check Availability</a>
                <a href="#rooms" className="btn btn-ghost">Browse Rooms</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Availability */}
      <section id="book" className="strip">
        <div className="container" style={{ padding: "24px 16px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            <input 
              className="field" 
              type="date" 
              aria-label="Check-in"
              value={checkIn}
              min={today}
              onChange={(e) => handleCheckInChange(e.target.value)}
              style={{ flex: "0 0 auto", width: "180px" }} 
            />
            <input 
              className="field" 
              type="date" 
              aria-label="Check-out"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              disabled={!checkIn}
              style={{ flex: "0 0 auto", width: "180px", opacity: checkIn ? 1 : 0.5 }} 
            />
            <div className="guest-picker" ref={guestPickerRef} style={{ flex: "0 0 auto", width: "200px", position: "relative" }}>
              <button 
                className="field" 
                onClick={() => setShowGuestPicker(!showGuestPicker)}
                style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "#fff" }}
                type="button"
              >
                {totalGuests} Guest{totalGuests !== 1 ? 's' : ''} ▾
              </button>
              {showGuestPicker && (
                <div className="guest-dropdown">
                  <div className="guest-row">
                    <div>
                      <div style={{ fontWeight: 600 }}>Adults</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>Age 14+</div>
                    </div>
                    <div className="guest-controls">
                      <button className="guest-btn" onClick={() => updateGuests('adults', false)} disabled={guests.adults <= 1} type="button">−</button>
                      <span className="guest-count">{guests.adults}</span>
                      <button className="guest-btn" onClick={() => updateGuests('adults', true)} disabled={guests.adults >= 24} type="button">+</button>
                    </div>
                  </div>
                  <div className="guest-row">
                    <div>
                      <div style={{ fontWeight: 600 }}>Children</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>Age 3-13</div>
                    </div>
                    <div className="guest-controls">
                      <button className="guest-btn" onClick={() => updateGuests('children', false)} disabled={guests.children <= 0} type="button">−</button>
                      <span className="guest-count">{guests.children}</span>
                      <button className="guest-btn" onClick={() => updateGuests('children', true)} disabled={guests.children >= 4} type="button">+</button>
                    </div>
                  </div>
                  <div className="guest-row">
                    <div>
                      <div style={{ fontWeight: 600 }}>Toddlers</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>Under 3</div>
                    </div>
                    <div className="guest-controls">
                      <button className="guest-btn" onClick={() => updateGuests('toddlers', false)} disabled={guests.toddlers <= 0} type="button">−</button>
                      <span className="guest-count">{guests.toddlers}</span>
                      <button className="guest-btn" onClick={() => updateGuests('toddlers', true)} disabled={guests.toddlers >= 2} type="button">+</button>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)", fontSize: 12, color: "var(--muted)" }}>
                    Max: 24 adults, 4 children, 2 toddlers
                  </div>
                </div>
              )}
            </div>
            <a href="#contact" className="btn btn-primary" style={{ whiteSpace: "nowrap", flex: "0 0 auto" }}>WhatsApp for best rates</a>
          </div>
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <p style={{ fontSize: 18, color: "var(--ink)", margin: 0, fontWeight: 500 }}>
              Direct bookings are 5–12% lower than OTAs. WhatsApp us for date flexibility.
            </p>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section id="rooms" className="container" style={{ padding: "48px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 28 }}>Rooms & Suites</h2>
          <a href="#book" style={{ color: "var(--brand)" }}>See availability →</a>
        </div>

        <div className="grid grid-3" style={{ marginTop: 16 }}>
          {ROOMS.map((r) => (
            <article className="room" key={r.key}>
              <img src={`/src/assets/1 (3).jpg`} alt={`${r.name} - Ko Lake luxury accommodation Ahangama`} />
              <div className="pad">
                <h3>{r.name}</h3>
                <p className="muted" style={{ marginTop: 6 }}>{r.blurb}</p>
                <div className="meta">Sleeps {r.pax} • {r.size}</div>
                <div className="row">
                  <div><strong>${r.price}</strong> <span className="muted">/ night</span></div>
                  <a className="btn btn-primary" href="#book">Book</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="strip">
        <div className="container" style={{ padding: "48px 16px" }}>
          <h2 style={{ marginTop: 0, fontSize: 28 }}>Gallery</h2>
          <div className="masonry" style={{ marginTop: 16 }}>
            {[
              "/src/assets/1 (3).jpg",
              "/src/assets/2 (5).jpg",
              "/src/assets/3 (3).jpg",
              "/src/assets/4 (3).jpg",
              "/src/assets/6 (1).jpg",
              "/src/assets/8 (1).jpg",
              "/src/assets/9.jpg",
              "/src/assets/PoolSunset.jpg",
              "/src/assets/KoLakeSunset.jpeg"
            ].map((src, i) => (
              <figure key={i}><img src={src} alt={`Gallery ${i + 1}`} /></figure>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="container" style={{ padding: "48px 16px" }}>
        <h2 style={{ fontSize: 28, marginTop: 0 }}>Amenities</h2>
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          {[
            "Private chef on request (Sri Lankan / Indian / Western)",
            "Unlimited WiFi perfect for digital nomads",
            "Lap pool with lake views & roof garden",
            "Near surf spots: Kabalana, Midigama, Ahangama",
            "Lake safari tours & wildlife viewing",
            "Fishing & birdwatching on Koggala Lake",
            "Near tea plantations & hiking trails",
            "Pet friendly & senior friendly accommodation",
            "Event venue for weddings & groups",
            "Off-street parking & BBQ facilities",
            "Airport transfers & tuk-tuk hire"
          ].map((t, i) => (
            <div key={i} className="card" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "var(--brand)", marginTop: 6 }} />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section id="map" className="strip">
        <div className="container" style={{ padding: "48px 16px" }}>
          <h2 style={{ marginTop: 0, fontSize: 28 }}>Where we are</h2>
          <p className="muted">Ahangama • on the shores of Koggala Lake • 10–15 mins to surf beaches.</p>
          <div style={{ marginTop: 12, border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
            <iframe
              title="Map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Koggala%20Lake%20Sri%20Lanka&t=&z=12&ie=UTF8&iwloc=&output=embed"
              style={{ width: "100%", height: 360, border: 0 }}
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container" style={{ padding: "48px 16px" }}>
        <h2 style={{ marginTop: 0, fontSize: 28 }}>Guest Reviews</h2>
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          {[
            "Perfect base for surfing & lake safaris.",
            "Chef made brilliant hoppers & curries!",
            "Calm, green, and fast Wi-Fi for work."
          ].map((q, i) => (
            <blockquote key={i} className="card">
              <p style={{ margin: 0 }}>"{q}"</p>
              <footer className="muted" style={{ marginTop: 8 }}>— Recent guest</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ background: "var(--brand)", color: "var(--brand-ink)" }}>
        <div className="container" style={{ padding: "48px 16px" }}>
          <div className="grid grid-2">
            <div>
              <h2 style={{ marginTop: 0, fontSize: 28 }}>Ready to book?</h2>
              <p style={{ opacity: .9 }}>Best rates direct. Ask about full-villa pricing and chef packages.</p>
            </div>
            <form className="grid" style={{ gap: 12 }}>
              <div className="grid grid-2" style={{ gap: 12 }}>
                <input className="field" placeholder="Your name" />
                <input className="field" placeholder="Email or WhatsApp" />
              </div>
              <textarea className="field" rows={4} placeholder="Dates / questions" />
              <button type="button" className="btn btn-ghost">Send enquiry</button>
            </form>
          </div>
        </div>
      </section>

      <footer>© {year} Ko Lake Villa, Ahangama</footer>
    </>
  );
}
