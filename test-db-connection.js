// Test database connection and query
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zctpyveoakvbrrjmviqg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdHB5dmVvYWt2YnJyam12aXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcxMDU5OTEsImV4cCI6MjA0MjY4MTk5MX0.nEWlQkLlPKXPPFOQJwuWJJTXwPJGqRzJPPkOSLjCLZA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  console.log('🔍 Testing Supabase connection...\n');
  
  // Test gallery_images table
  console.log('📸 Testing gallery_images table...');
  const { data: gallery, error: galleryError } = await supabase
    .from('gallery_images')
    .select('*')
    .limit(5);
  
  if (galleryError) {
    console.log('❌ Gallery Error:', galleryError.message);
    console.log('   Code:', galleryError.code);
    console.log('   Details:', galleryError.details);
    console.log('   Hint:', galleryError.hint);
  } else {
    console.log('✅ Gallery table accessible');
    console.log('   Records found:', gallery?.length || 0);
    if (gallery && gallery.length > 0) {
      console.log('   Sample:', gallery[0]);
    }
  }
  
  console.log('\n📞 Testing contacts table...');
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .limit(5);
  
  if (contactsError) {
    console.log('❌ Contacts Error:', contactsError.message);
  } else {
    console.log('✅ Contacts table accessible');
    console.log('   Records found:', contacts?.length || 0);
  }
  
  console.log('\n✨ Testing amenities table...');
  const { data: amenities, error: amenitiesError } = await supabase
    .from('amenities')
    .select('*')
    .limit(5);
  
  if (amenitiesError) {
    console.log('❌ Amenities Error:', amenitiesError.message);
  } else {
    console.log('✅ Amenities table accessible');
    console.log('   Records found:', amenities?.length || 0);
  }
}

test();
