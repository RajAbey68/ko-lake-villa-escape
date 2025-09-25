import { useState } from "react";

interface KoLakeLogoProps {
  className?: string;
  variant?: "primary" | "secondary";
}

export const KoLakeLogo = ({ className = "", variant = "primary" }: KoLakeLogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  const logoSrc = variant === "primary" 
    ? "/lovable-uploads/930e693f-f8b5-499d-993f-a06e346a3516.png"
    : "/lovable-uploads/6cdff8d6-80c3-40b9-b87d-ad1daf65fd6d.png";
  
  const fallbackSrc = variant === "primary"
    ? "/lovable-uploads/6cdff8d6-80c3-40b9-b87d-ad1daf65fd6d.png"
    : "/lovable-uploads/930e693f-f8b5-499d-993f-a06e346a3516.png";

  if (imageError) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-10 h-10 bg-gradient-to-br from-tropical-emerald to-tropical-teal rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">KL</span>
        </div>
        <span className="font-playfair text-xl font-semibold text-foreground">Ko Lake Villa</span>
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt="Ko Lake Villa - Traditional Sri Lankan Pavilion Logo"
      className={`h-12 w-auto object-contain ${className}`}
      onError={() => {
        // Try fallback image first
        const img = new Image();
        img.onload = () => {
          // If fallback loads, update src
          setImageError(false);
        };
        img.onerror = () => {
          // If fallback also fails, show text logo
          setImageError(true);
        };
        img.src = fallbackSrc;
      }}
      loading="lazy"
    />
  );
};