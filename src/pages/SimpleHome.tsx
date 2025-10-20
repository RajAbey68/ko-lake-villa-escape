// Simple 7-Room STR site for React + Vite (self-contained CSS)
// Flow: Hero → Availability → Rooms (7) → Gallery → Amenities → Map → Reviews → Contact
import { useMemo } from "react";

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
        .hero h1{color:#fff;font-size:40px;line-height:1.1;margin:0 0 12px}
        .hero p{color:#eef2ff;max-width:700px;margin:0 0 18px}
        @media (min-width: 860px){ .hero h1{font-size:64px} }

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

        footer{border-top:1px solid var(--line);color:var(--muted);text-align:center;padding:20px}
      `}</style>

      {/* Top bar */}
      <header className="sticky">
        <div className="container" style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/ko-lake-logo.png" alt="Ko Lake" style={{ width: 48, height: 48, borderRadius: 999 }} />
            <strong>Ko Lake • Ahangama</strong>
          </div>
          <nav className="nav" style={{ display: "flex" }}>
            <a href="#rooms">Rooms</a>
            <a href="/gallery">Gallery</a>
            <a href="#amenities">Amenities</a>
            <a href="#map">Location</a>
            <a href="#contact">Contact</a>
            <a href="/admin" style={{ fontSize: 14, opacity: 0.7 }}>Sign In</a>
            <a className="btn btn-primary" href="#book">Book Now</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <img src="/src/assets/PoolSunset.jpg" alt="Koggala Lake at sunrise" />
        <div className="copy">
          <div className="container">
            <div style={{ maxWidth: 900 }}>
              <h1>Lakeside villa for families, surfers & friends</h1>
              <p>7 rooms • Chef on request • Fast Wi-Fi • Near Kabalana & Midigama breaks • Roof-garden sunsets</p>
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
        <div className="container" style={{ padding: "18px 16px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
            <input className="field" type="date" aria-label="Check-in" style={{ flex: "0 0 auto", width: "180px" }} />
            <input className="field" type="date" aria-label="Check-out" style={{ flex: "0 0 auto", width: "180px" }} />
            <select className="field" aria-label="Guests" style={{ flex: "0 0 auto", width: "140px" }}>
              <option>2 Guests</option><option>3 Guests</option><option>4 Guests</option><option>5+</option>
            </select>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a href="#contact" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>WhatsApp for best rates</a>
              <span className="muted" style={{ fontSize: 12 }}>Direct bookings are 5–12% lower than OTAs. WhatsApp us for date flexibility.</span>
            </div>
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
              <img src={`/src/assets/1 (3).jpg`} alt={r.name} />
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
            "Chef on request (Sri Lankan / Indian / Western)",
            "Fast Wi-Fi & work nooks",
            "Pool deck + roof garden sunsets",
            "Surf breaks: Kabalana, Midigama, Ahangama",
            "Boat safaris on Koggala Lake",
            "Airport transfers & tuk-tuks",
            "Laundry, bicycles, projector/TV"
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
