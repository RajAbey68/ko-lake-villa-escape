import { useState } from "react";

interface KoLakeLogoProps {
  className?: string;
  variant?: "primary" | "secondary";
}

export const KoLakeLogo = ({ className = "", variant = "primary" }: KoLakeLogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Use the fisherman logo
  const logoSrc = "/ko-lake-logo.jpg";

  if (imageError) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-10 h-10 rounded-full" style={{ 
          background: "linear-gradient(135deg, #d26a1b 0%, #e88a3d 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <span className="text-white font-bold text-xl">KL</span>
        </div>
        <span className="font-playfair text-xl font-semibold text-foreground">Ko Lake • Ahangama</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img
        src={logoSrc}
        alt="Ko Lake - Fisherman Logo"
        className="h-12 w-12 object-contain"
        onError={() => setImageError(true)}
        loading="lazy"
      />
      <span className="font-playfair text-xl font-semibold text-foreground">Ko Lake • Ahangama</span>
    </div>
  );
};