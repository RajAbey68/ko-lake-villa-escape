import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { seedDatabase } from '@/lib/seedDatabase';

export function AdminDatabaseSeed() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const seedResult = await seedDatabase();
      setResult(seedResult);
    } catch (error: any) {
      setResult({
        success: false,
        errors: [error.message],
        inserted: { hero: 0, rooms: 0, amenities: 0, location: 0, gallery: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Setup
        </CardTitle>
        <CardDescription>
          Populate your database with placeholder content to get started quickly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold">This will add:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>2 Hero slides for homepage</li>
            <li>3 Room types with pricing</li>
            <li>10 Amenities & features</li>
            <li>1 Location information</li>
            <li>6 Gallery images</li>
          </ul>
        </div>

        <Button 
          onClick={handleSeed} 
          disabled={loading}
          size="lg"
          className="w-full"
          data-testid="seed-db-button"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding Database...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Seed Database with Placeholder Content
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-2 mt-4">
            {result.success ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>✅ Success!</strong> Database populated with placeholder content.
                  <div className="mt-2 space-y-1 text-sm">
                    <div>• Hero content: {result.inserted.hero} items</div>
                    <div>• Room types: {result.inserted.rooms} items</div>
                    <div>• Amenities: {result.inserted.amenities} items</div>
                    <div>• Location info: {result.inserted.location} item</div>
                    <div>• Gallery images: {result.inserted.gallery} items</div>
                  </div>
                  <div className="mt-3 text-sm font-semibold">
                    🎉 Refresh your homepage to see the changes!
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> Failed to seed database
                  <div className="mt-2 space-y-1 text-sm">
                    {result.errors.map((error: string, i: number) => (
                      <div key={i}>• {error}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2 mt-4 p-4 bg-muted rounded-lg">
          <p><strong>Note:</strong> This uses placeholder images from Unsplash.</p>
          <p>After seeding, you can:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Upload your own images via the Gallery tab</li>
            <li>Edit room details via Room Types tab</li>
            <li>Customize amenities and location info</li>
            <li>Replace all content with your actual villa information</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
