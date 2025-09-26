import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoThumbnail } from "@/components/ui/video-thumbnail";
import { useGallery, isVideoItem, type GalleryItem } from "@/hooks/useGallery";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fetch all gallery items (both images and videos)
  const { data: galleryItems = [], isLoading: loading, error } = useGallery();

  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setCurrentIndex(nextIndex);
    setSelectedItem(galleryItems[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setCurrentIndex(prevIndex);
    setSelectedItem(galleryItems[prevIndex]);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <section id="gallery" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h2>
            <p className="text-xl text-muted-foreground">Loading gallery...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-square bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="gallery" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h2>
            <p className="text-xl text-destructive">Error loading gallery. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the beauty of Ko Lake Villa through our curated collection of images and videos
          </p>
        </div>

        {galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className="relative gallery-item cursor-pointer rounded-lg overflow-hidden shadow-medium hover:shadow-large"
                onClick={() => openLightbox(item, index)}
                data-testid={`gallery-item-${item.id}`}
              >
                {isVideoItem(item) ? (
                  <VideoThumbnail
                    src={item.object_path}
                    thumbnail={item.thumbnail_path}
                    title={item.title}
                    className="w-full h-full"
                    aspectRatio="square"
                    onPlay={() => openLightbox(item, index)}
                    data-testid={`gallery-video-${item.id}`}
                  />
                ) : (
                  <img
                    src={item.object_path}
                    alt={item.title}
                    className="w-full h-full object-cover aspect-square"
                    loading="lazy"
                    data-testid={`gallery-image-${item.id}`}
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback.jpg'; }}
                  />
                )}
                
                {/* Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 smooth-transition">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm opacity-90 mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>

                {/* Featured Badge */}
                {item.is_featured && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No gallery items available.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back soon for beautiful images and videos!</p>
          </div>
        )}

        {/* Lightbox Modal */}
        <Dialog open={!!selectedItem} onOpenChange={() => closeLightbox()}>
          <DialogContent className="max-w-5xl w-full h-[90vh] p-0">
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {selectedItem && (
                <>
                  {isVideoItem(selectedItem) ? (
                    <video
                      src={selectedItem.object_path}
                      controls
                      className="max-w-full max-h-full"
                      autoPlay
                      poster={selectedItem.thumbnail_path || undefined}
                      data-testid="lightbox-video"
                      onError={e => { console.error('Video failed to load:', selectedItem.object_path); }}
                    />
                  ) : (
                    <img
                      src={selectedItem.object_path}
                      alt={selectedItem.title}
                      className="max-w-full max-h-full object-contain"
                      data-testid="lightbox-image"
                      onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback.jpg'; }}
                    />
                  )}
                  
                  {galleryItems.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-8 w-8" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-8 w-8" />
                      </Button>
                    </>
                  )}
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                    <h3 className="text-xl font-semibold">{selectedItem.title}</h3>
                    {selectedItem.description && (
                      <p className="text-sm opacity-90 mt-2">{selectedItem.description}</p>
                    )}
                    <p className="text-xs opacity-70 mt-2">
                      {currentIndex + 1} of {galleryItems.length}
                    </p>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};