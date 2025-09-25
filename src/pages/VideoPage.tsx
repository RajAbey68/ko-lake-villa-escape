import { VideoCarousel } from "@/components/VideoCarousel";
import { Navigation } from "@/components/Navigation";

const VideoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ko Lake Villa Videos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the beauty and luxury of our resort through these immersive videos
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <VideoCarousel 
            autoPlay={true}
            showControls={true}
            intervalMs={8000}
            className="shadow-2xl"
          />
        </div>
      </main>
    </div>
  );
};

export default VideoPage;