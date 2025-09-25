import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AmenityCardProps {
  amenity: {
    icon: React.ComponentType<{ className?: string }>;
    name: string;
    description: string;
  };
}

export function AmenityCard({ amenity }: AmenityCardProps) {
  const Icon = amenity.icon;
  
  return (
    <Card className="card-lake text-center group hover:shadow-[var(--shadow-elegant)] transition-[var(--transition-luxury)]">
      <CardHeader className="pb-3">
        <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-lg">{amenity.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center">
          {amenity.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}