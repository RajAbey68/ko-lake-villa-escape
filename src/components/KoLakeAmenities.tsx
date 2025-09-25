import { useAmenityCategories } from "@/hooks/useAmenityCategories";
import { AmenityCard } from "@/components/micro/AmenityCard";
import { SectionHeader } from "@/components/micro/SectionHeader";

export function KoLakeAmenities() {
  const { amenityCategories, specialFeatures } = useAmenityCategories();

  return (
    <section id="amenities" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader 
          title="Ko Lake Amenities"
          description="Discover world-class facilities and services designed for your ultimate comfort and enjoyment"
        />

        {/* Amenities Categories */}
        <div className="space-y-16">
          {amenityCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              
              {/* Category Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>

              {/* Amenities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.amenities.map((amenity, index) => (
                  <AmenityCard key={index} amenity={amenity} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Special Features Highlight */}
        <div className="mt-20 bg-gradient-to-r from-primary to-primary-glow rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">What Makes Us Special</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {specialFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <feature.icon className="w-5 h-5" />
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}