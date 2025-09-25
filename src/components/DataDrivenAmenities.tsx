import { Suspense } from "react";
import { useAmenitiesByCategory, useFeaturedAmenities } from "@/hooks/useAmenities";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import * as Icons from "lucide-react";

interface AmenityCardProps {
  title: string;
  description: string | null;
  category: string;
  iconName: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
}

const AmenityCard = ({ title, description, category, iconName, imageUrl, isFeatured }: AmenityCardProps) => {
  // Get the icon component dynamically
  const IconComponent = iconName ? (Icons as any)[iconName] : Icons.Star;
  
  return (
    <Card className={`h-full transition-all duration-300 hover:shadow-lg ${isFeatured ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex items-center justify-center gap-2">
          <Badge variant={category === 'resort_facilities' ? 'default' : 'secondary'}>
            {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          {isFeatured && <Badge variant="outline">Featured</Badge>}
        </div>
      </CardHeader>
      {description && (
        <CardContent>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardContent>
      )}
    </Card>
  );
};

const AmenitiesSection = ({ title, category }: { title: string; category: string }) => {
  const { data: amenities, isLoading, error } = useAmenitiesByCategory(category);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-full">
              <CardHeader className="text-center">
                <Skeleton className="mx-auto mb-4 h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load {title.toLowerCase()}. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {amenities.map((amenity) => (
          <AmenityCard
            key={amenity.id}
            title={amenity.title}
            description={amenity.description}
            category={amenity.category}
            iconName={amenity.icon_name}
            imageUrl={amenity.image_url}
            isFeatured={amenity.is_featured}
          />
        ))}
      </div>
    </div>
  );
};

const FeaturedAmenities = () => {
  const { data: amenities, isLoading, error } = useFeaturedAmenities();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-full">
              <CardHeader className="text-center">
                <Skeleton className="mx-auto mb-4 h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-32 mx-auto" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load featured amenities. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">Featured Amenities</h2>
        <p className="text-muted-foreground mt-2">
          Discover the exceptional facilities that make your stay unforgettable
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {amenities.map((amenity) => (
          <AmenityCard
            key={amenity.id}
            title={amenity.title}
            description={amenity.description}
            category={amenity.category}
            iconName={amenity.icon_name}
            imageUrl={amenity.image_url}
            isFeatured={amenity.is_featured}
          />
        ))}
      </div>
    </div>
  );
};

export const DataDrivenAmenities = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <Suspense fallback={
          <div className="space-y-8">
            <div className="text-center">
              <Skeleton className="h-8 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        }>
          <div className="space-y-12">
            <FeaturedAmenities />
            
            <AmenitiesSection title="Resort Facilities" category="resort_facilities" />
            <AmenitiesSection title="Comfort & Luxury" category="comfort" />
            <AmenitiesSection title="Activities & Experiences" category="activities" />
          </div>
        </Suspense>
      </div>
    </section>
  );
};