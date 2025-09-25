import { PropertyAvailabilityCalendar } from "@/components/PropertyAvailabilityCalendar";
import { PropertyDetailsCard } from "@/components/PropertyDetailsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Info, TestTube } from "lucide-react";
import { AdminGuestyTest } from "@/components/admin/AdminGuestyTest";

export function GuestyIntegrationDemo() {
  const demoPropertyId = "demo-property-123";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <TestTube className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Guesty Integration Demo</h2>
        <Badge variant="outline">Live Data</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              API Testing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AdminGuestyTest />
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyDetailsCard property_id={demoPropertyId} />
          </CardContent>
        </Card>
      </div>

      {/* Calendar Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Availability Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyAvailabilityCalendar 
            property_id={demoPropertyId}
            onDateSelect={(date) => console.log('Selected date:', date)}
          />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
        <p><strong>Demo Status:</strong> This demo shows the Guesty integration with fallback data when API is unavailable.</p>
        <p><strong>Next Steps:</strong> Configure real Guesty API credentials in the edge function secrets to connect to live data.</p>
      </div>
    </div>
  );
}