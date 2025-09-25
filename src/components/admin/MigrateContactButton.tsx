import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { migrateFirebaseContact } from "@/utils/migrateFirebaseContact";

export const MigrateContactButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMigrate = async () => {
    setIsLoading(true);
    try {
      const result = await migrateFirebaseContact();
      
      if (result.success) {
        toast({
          title: "Migration successful",
          description: `Migrated contact data from Firebase path: ${result.data?.path}`,
        });
      } else {
        toast({
          title: "Migration failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleMigrate} 
      disabled={isLoading}
      variant="outline"
    >
      {isLoading ? "Migrating..." : "Migrate Firebase Contact Data"}
    </Button>
  );
};