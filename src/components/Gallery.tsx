// Gallery.tsx — Storage-based public gallery (no database table required)
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryItem = {
  id: string;
  name: string;
  url: string;
  isVideo: boolean;
};

const BUCKET = 'gallery';
const PREFIX = 'images/';

async function listGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .storage
    .from(BUCKET)
    .list(PREFIX, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

  if (error) throw error;

  return (data ?? [])
    .filter(e => e?.name && e.name !== '.emptyFolderPlaceholder')
    .map((e) => {
      const path = `${PREFIX}${e.name}`;
      const pub = supabase.storage.from(BUCKET).getPublicUrl(path).data?.publicUrl ?? '';
      const isVideo = /\.(mp4|webm|mov|avi)$/i.test(e.name!);
      return { id: path, name: e.name!, url: pub, isVideo };
    });
}

export const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    listGallery()
      .then(setGalleryItems)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

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
    console.error('Gallery error:', error);
    return (
      <section id="gallery" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h2>
            <p className="text-xl text-destructive">Error loading gallery. Please try again later.</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <div className="mt-4">
              <Button onClick={() => window.location.reload()}>Reload Page</Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20" data-testid="gallery-section">
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
                className="relative gallery-item cursor-pointer rounded-lg overflow-hidden shadow-medium hover:shadow-large transition-shadow"
                onClick={() => openLightbox(item, index)}
                data-testid={`gallery-item-${item.id}`}
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  {item.isVideo ? (
                    <>
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        loop
                      />
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                        ▶ Video
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    </div>
                  </div>
                </div>
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
        {selectedItem && (
          <Dialog open={!!selectedItem} onOpenChange={closeLightbox}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
                  onClick={closeLightbox}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center justify-center bg-black min-h-[60vh]">
                  {selectedItem.isVideo ? (
                    <video
                      src={selectedItem.url}
                      controls
                      autoPlay
                      className="max-w-full max-h-[80vh] object-contain"
                    />
                  ) : (
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.name}
                      className="max-w-full max-h-[80vh] object-contain"
                    />
                  )}
                </div>

                <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/50 hover:bg-black/70 text-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                </div>

                <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/50 hover:bg-black/70 text-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>

                <div className="bg-black/80 text-white p-4">
                  <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {currentIndex + 1} of {galleryItems.length}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
};