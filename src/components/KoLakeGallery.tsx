import { useState } from "react";
import { useGallery, isVideoItem, type GalleryItem } from "@/hooks/useGallery";
import { VideoThumbnail } from "@/components/ui/video-thumbnail";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, ChevronLeft, ChevronRight, Filter, Star, Image, Video } from "lucide-react";

export function KoLakeGallery() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMediaType, setSelectedMediaType] = useState<'all' | 'image' | 'video'>("all");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Fetch all gallery items from database (both images and videos)
  const { data: allGalleryItems = [], isLoading, error } = useGallery();

  // Extract unique categories from gallery items using the category field
  const categories = Array.from(
    new Set(allGalleryItems.map(item => item.category || 'villa').filter(Boolean))
  );

  // Filter gallery items based on selected category, media type, and featured status
  const filteredItems = allGalleryItems.filter(item => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const mediaTypeMatch = selectedMediaType === "all" || item.media_type === selectedMediaType;
    const featuredMatch = !showFeaturedOnly || item.is_featured;
    
    return categoryMatch && mediaTypeMatch && featuredMatch;
  });

  // Separate stats for display
  const totalImages = allGalleryItems.filter(item => item.media_type === 'image').length;
  const totalVideos = allGalleryItems.filter(item => item.media_type === 'video').length;

  const nextItem = () => {
    if (selectedItem !== null) {
      setSelectedItem((selectedItem + 1) % filteredItems.length);
    }
  };

  const prevItem = () => {
    if (selectedItem !== null) {
      setSelectedItem(selectedItem === 0 ? filteredItems.length - 1 : selectedItem - 1);
    }
  };

  if (isLoading) {
    return (
      <section id="gallery" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Gallery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the beauty and luxury of Ko Lake Villa through our curated collection
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="gallery" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert className="max-w-2xl mx-auto">
            <AlertDescription>
              Unable to load gallery content. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the beauty and luxury of Ko Lake Villa through our curated collection
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          
          {/* Media Type Filter */}
          <div className="flex gap-2">
            <Button
              variant={selectedMediaType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMediaType("all")}
              className="flex items-center gap-1"
            >
              All Media
            </Button>
            <Button
              variant={selectedMediaType === "image" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMediaType("image")}
              className="flex items-center gap-1"
            >
              <Image className="w-3 h-3" />
              Images ({totalImages})
            </Button>
            <Button
              variant={selectedMediaType === "video" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMediaType("video")}
              className="flex items-center gap-1"
            >
              <Video className="w-3 h-3" />
              Videos ({totalVideos})
            </Button>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          <Button
            variant={showFeaturedOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            className="flex items-center gap-1"
          >
            <Star className="w-3 h-3" />
            Featured Only
          </Button>
        </div>

        {/* Results Counter */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {allGalleryItems.length} items
            {selectedMediaType !== 'all' && (
              <span className="ml-1">
                ({selectedMediaType === 'image' ? 'images' : 'videos'})
              </span>
            )}
          </p>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items match your current filters.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory("all");
                setSelectedMediaType("all");
                setShowFeaturedOnly(false);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="gallery-item relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-[var(--shadow-elegant)] transition-[var(--transition-luxury)]"
                onClick={() => setSelectedItem(index)}
                data-testid={`kolake-gallery-item-${item.id}`}
              >
                {isVideoItem(item) ? (
                  <VideoThumbnail
                    src={item.object_path}
                    thumbnail={item.thumbnail_path}
                    title={item.title}
                    className="w-full h-full"
                    aspectRatio="square"
                    onPlay={() => setSelectedItem(index)}
                    data-testid={`kolake-gallery-video-${item.id}`}
                  />
                ) : (
                  <img
                    src={item.object_path}
                    alt={item.title}
                    className="gallery-image aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    data-testid={`kolake-gallery-image-${item.id}`}
                  />
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Media Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-sm font-medium truncate">{item.title}</h3>
                  {item.description && (
                    <p className="text-white/80 text-xs truncate">{item.description}</p>
                  )}
                </div>

                {/* Featured Badge */}
                {item.is_featured && (
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </Badge>
                )}
                
                {/* View Button */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Dialog */}
        <Dialog open={selectedItem !== null} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl w-full p-0 bg-black/95">
            <div className="relative">
              {selectedItem !== null && (
                <>
                  {isVideoItem(filteredItems[selectedItem]) ? (
                    <video
                      src={filteredItems[selectedItem].object_path}
                      controls
                      className="w-full h-auto max-h-[80vh] object-contain"
                      autoPlay
                      poster={filteredItems[selectedItem].thumbnail_path || undefined}
                      data-testid="kolake-lightbox-video"
                    />
                  ) : (
                    <img
                      src={filteredItems[selectedItem].object_path}
                      alt={filteredItems[selectedItem].title}
                      className="w-full h-auto max-h-[80vh] object-contain"
                      data-testid="kolake-lightbox-image"
                    />
                  )}
                  
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-white/20"
                    onClick={() => setSelectedItem(null)}
                  >
                    <X className="w-6 h-6" />
                  </Button>

                  {/* Navigation Buttons */}
                  {filteredItems.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={prevItem}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={nextItem}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                    </>
                  )}

                  {/* Media Info */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                    <div className="text-white bg-black/50 px-4 py-2 rounded-lg max-w-md">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        {isVideoItem(filteredItems[selectedItem]) ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <Image className="w-4 h-4" />
                        )}
                        <h3 className="font-medium">{filteredItems[selectedItem].title}</h3>
                      </div>
                      {filteredItems[selectedItem].description && (
                        <p className="text-sm text-white/80">{filteredItems[selectedItem].description}</p>
                      )}
                      <div className="text-xs text-white/60 mt-2">
                        {selectedItem + 1} of {filteredItems.length}
                      </div>
                    </div>
                  </div>

                  {/* Featured Badge in Lightbox */}
                  {filteredItems[selectedItem].is_featured && (
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </Badge>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}