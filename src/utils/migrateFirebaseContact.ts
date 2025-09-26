import { supabase } from "@/integrations/supabase/client";

export const migrateFirebaseContact = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('firebase-contact-migrate', {
      body: {}
    });
    
    if (error) {
      console.error('Migration error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Migration result:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Migration failed:', err);
    return { success: false, error: String(err) };
  }
};