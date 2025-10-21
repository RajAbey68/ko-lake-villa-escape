// Simple Gallery Page - Self-contained, no database
import { useState } from "react";
import PoolSunsetImg from "@/assets/PoolSunset.jpg";
import Room1Img from "@/assets/1 (3).jpg";
import Room2Img from "@/assets/2 (5).jpg";
import Room3Img from "@/assets/3 (3).jpg";
import Room4Img from "@/assets/4 (3).jpg";
import Room6Img from "@/assets/6 (1).jpg";
import Room8Img from "@/assets/8 (1).jpg";
import Room9Img from "@/assets/9.jpg";
import KoLakeSunsetImg from "@/assets/KoLakeSunset.jpeg";
import KoggalaSunsetImg from "@/assets/KoggalaSunset 2.jpeg";

const GALLERY_IMAGES = [
  { src: PoolSunsetImg, title: "Pool at Sunset", category: "pool" },
  { src: Room1Img, title: "Luxury Accommodation", category: "interior" },
  { src: Room2Img, title: "Spacious Rooms", category: "interior" },
  { src: Room3Img, title: "Modern Amenities", category: "interior" },
  { src: Room4Img, title: "Comfortable Living", category: "interior" },
  { src: Room6Img, title: "Lake Views", category: "exterior" },
  { src: Room8Img, title: "Garden Area", category: "exterior" },
  { src: Room9Img, title: "Villa Exterior", category: "exterior" },
  { src: KoLakeSunsetImg, title: "Ko Lake Sunset", category: "views" },
  { src: KoggalaSunsetImg, title: "Koggala Sunset", category: "views" },
];

export default function GalleryPageSimple() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

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
        .gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;padding:48px 0}
        .gallery-item{position:relative;aspect-ratio:4/3;overflow:hidden;border-radius:12px;cursor:pointer;transition:transform .2s}
        .gallery-item:hover{transform:scale(1.02)}
        .gallery-item img{width:100%;height:100%;object-fit:cover}
        .lightbox{position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
        .lightbox img{max-width:90%;max-height:90%;object-fit:contain}
        .close-btn{position:absolute;top:20px;right:20px;background:rgba(255,255,255,.1);color:#fff;border:none;padding:12px 20px;border-radius:8px;cursor:pointer;font-size:16px}
      `}</style>

      {/* Header */}
      <header className="sticky">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <strong>Ko Lake • Ahangama</strong>
          </div>
          <nav className="nav" style={{ display: "flex" }}>
            <a href="/">Home</a>
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

      {/* Gallery */}
      <main className="container">
        <div style={{ textAlign: "center", padding: "48px 0 24px" }}>
          <h1 style={{ fontSize: 42, margin: "0 0 12px", fontWeight: 700 }}>Gallery</h1>
          <p style={{ fontSize: 18, color: "var(--muted)", maxWidth: 600, margin: "0 auto" }}>
            Discover the beauty of Ko Lake Villa through our curated collection of images
          </p>
        </div>

        <div className="gallery-grid">
          {GALLERY_IMAGES.map((image, index) => (
            <div key={index} className="gallery-item" onClick={() => setSelectedImage(index)}>
              <img src={image.src} alt={image.title} />
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <button className="close-btn" onClick={() => setSelectedImage(null)}>Close</button>
          <img src={GALLERY_IMAGES[selectedImage].src} alt={GALLERY_IMAGES[selectedImage].title} />
        </div>
      )}
    </>
  );
}
