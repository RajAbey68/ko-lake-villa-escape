import { useState, useEffect } from "react";

interface HeroImageRotatorProps {
  images: string[];
  altText: string;
}

export function HeroImageRotator({ images, altText }: HeroImageRotatorProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("opacity-100");

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeClass("opacity-0");

      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setFadeClass("opacity-100");
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <img
        src={images[currentImageIndex]}
        alt={altText}
        className={`w-full h-full object-cover transition-opacity duration-500 ${fadeClass} hero-zoom`}
      />
      
      {/* Image rotation indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/50 px-3 py-1 rounded-full">
          <div className="flex space-x-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}