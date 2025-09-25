import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Play, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useHeroVideos, type HeroVideo } from "@/hooks/useHeroVideos";

interface VideoCarouselProps {
  autoPlay?: boolean;
  showControls?: boolean;
  intervalMs?: number;
  className?: string;
}

export const VideoCarousel = ({ 
  autoPlay = true, 
  showControls = true, 
  intervalMs = 6000,
  className = "" 
}: VideoCarouselProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Fetch hero videos from database
  const { data: videos, isLoading, error } = useHeroVideos();

  // Auto-advance carousel
  useEffect(() => {
    if (!autoPlay || !videos || videos.length <= 1 || isPlaying) return;

    const timer = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoPlay, videos, intervalMs, isPlaying]);

  // Navigation functions
  const nextVideo = () => {
    if (videos && videos.length > 0) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      setIsPlaying(false);
    }
  };

  const prevVideo = () => {
    if (videos && videos.length > 0) {
      setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Reset video index if videos change
  useEffect(() => {
    if (videos && currentVideoIndex >= videos.length) {
      setCurrentVideoIndex(0);
    }
  }, [videos, currentVideoIndex]);

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <Skeleton className="w-full h-full rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="w-16 h-16 rounded-full" />
            </div>
          </div>
          <div className="p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load video carousel: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <Play className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground">No Videos Available</h3>
              <p className="text-sm text-muted-foreground">
                Check back soon for exciting video content!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentVideo = videos?.[currentVideoIndex];

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-0">
        <div className="relative aspect-video group">
          {/* Video Element */}
          <video
            key={currentVideo.id}
            src={currentVideo.video_path}
            poster={currentVideo.thumbnail_path}
            className="w-full h-full object-cover rounded-t-lg"
            controls={isPlaying}
            autoPlay={isPlaying}
            muted={!isPlaying}
            onLoadedData={() => setIsVideoLoaded(true)}
            onEnded={() => setIsPlaying(false)}
            onError={() => setIsVideoLoaded(false)}
          />

          {/* Overlay Controls */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Play/Pause Button */}
            {!isPlaying && (
              <Button
                variant="secondary"
                size="lg"
                className="bg-black/70 hover:bg-black/80 text-white border-none"
                onClick={togglePlayPause}
                data-testid="video-play-button"
              >
                <Play className="h-8 w-8" />
              </Button>
            )}
          </div>

          {/* Navigation Controls */}
          {showControls && videos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevVideo}
                data-testid="video-prev-button"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextVideo}
                data-testid="video-next-button"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Video Indicators */}
          {videos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/50 px-3 py-1 rounded-full">
                <div className="flex space-x-1">
                  {videos.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentVideoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => {
                        setCurrentVideoIndex(index);
                        setIsPlaying(false);
                      }}
                      data-testid={`video-indicator-${index}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2" data-testid="video-title">
            {currentVideo.title}
          </h3>
          {currentVideo.description && (
            <p className="text-muted-foreground" data-testid="video-description">
              {currentVideo.description}
            </p>
          )}
          
          {/* Video Stats */}
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span data-testid="video-counter">
              Video {currentVideoIndex + 1} of {videos.length}
            </span>
            {currentVideo.duration && (
              <span data-testid="video-duration">
                {Math.floor(currentVideo.duration / 60)}:{(currentVideo.duration % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};