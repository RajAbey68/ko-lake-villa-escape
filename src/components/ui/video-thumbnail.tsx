import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoThumbnailProps {
  src: string;
  thumbnail?: string | null;
  title: string;
  className?: string;
  showPlayButton?: boolean;
  showLoadingState?: boolean;
  onPlay?: () => void;
  onClick?: () => void;
  aspectRatio?: "square" | "video" | "auto";
  loading?: "lazy" | "eager";
}

export const VideoThumbnail = forwardRef<HTMLDivElement, VideoThumbnailProps>(
  ({
    src,
    thumbnail,
    title,
    className,
    showPlayButton = true,
    showLoadingState = true,
    onPlay,
    onClick,
    aspectRatio = "square",
    loading = "lazy",
    ...props
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [thumbnailError, setThumbnailError] = useState(false);

    const handleVideoLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleVideoError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    const handleThumbnailError = () => {
      setThumbnailError(true);
    };

    const handleClick = () => {
      if (onPlay) {
        onPlay();
      } else if (onClick) {
        onClick();
      }
    };

    const aspectClasses = {
      square: "aspect-square",
      video: "aspect-video",
      auto: ""
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-lg bg-muted",
          aspectClasses[aspectRatio],
          className
        )}
        onClick={handleClick}
        data-testid="video-thumbnail"
        {...props}
      >
        {/* Loading State */}
        {isLoading && showLoadingState && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading video...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-8 w-8" />
              <span className="text-sm">Video unavailable</span>
            </div>
          </div>
        )}

        {/* Video Thumbnail or Poster */}
        {!hasError && (
          <>
            {/* Use thumbnail if available and not errored, otherwise use video poster */}
            {thumbnail && !thumbnailError ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
                loading={loading}
                onError={handleThumbnailError}
                data-testid="video-thumbnail-image"
              />
            ) : (
              <video
                src={src}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
                onLoadedData={handleVideoLoad}
                onError={handleVideoError}
                data-testid="video-thumbnail-video"
              />
            )}

            {/* Overlay with Play Button */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
              <div className="absolute inset-0 flex items-center justify-center">
                {showPlayButton && (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-black/70 hover:bg-black/80 text-white border-none opacity-80 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                    }}
                    data-testid="video-play-button"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                )}
              </div>
            </div>

            {/* Video Type Indicator */}
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Video
            </div>
          </>
        )}
      </div>
    );
  }
);

VideoThumbnail.displayName = "VideoThumbnail";

// Skeleton version for loading states
export const VideoThumbnailSkeleton = ({ 
  className,
  aspectRatio = "square" 
}: { 
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
}) => {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video", 
    auto: ""
  };

  return (
    <div className={cn("relative overflow-hidden rounded-lg", aspectClasses[aspectRatio], className)}>
      <Skeleton className="w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    </div>
  );
};