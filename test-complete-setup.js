// Test if the database and storage are properly configured
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zctpyveoakvbrrjmviqg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdHB5dmVvYWt2YnJyam12aXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcxMDU5OTEsImV4cCI6MjA0MjY4MTk5MX0.nEWlQkLlPKXPPFOQJwuWJJTXwPJGqRzJPPkOSLjCLZA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  console.log('🔍 Testing Database & Storage Setup...\n');
  
  // Test 1: Check if gallery_images table exists and is accessible
  console.log('1️⃣ Testing gallery_images table...');
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('id, title, object_path')
      .limit(5);
    
    if (error) {
      console.log('   ❌ Table Error:', error.message);
      console.log('   → Need to run COMPLETE_SETUP.sql');
    } else {
      console.log('   ✅ Table accessible');
      console.log('   → Records found:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('   → Sample:', data[0].title);
      }
    }
  } catch (err) {
    console.log('   ❌ Connection Error:', err.message);
  }
  
  // Test 2: Check if storage bucket exists
  console.log('\n2️⃣ Testing storage bucket...');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log('   ❌ Storage Error:', error.message);
    } else {
      const galleryBucket = buckets?.find(b => b.id === 'gallery');
      if (galleryBucket) {
        console.log('   ✅ Gallery bucket exists');
        console.log('   → Public:', galleryBucket.public);
      } else {
        console.log('   ❌ Gallery bucket NOT found');
        console.log('   → Need to run COMPLETE_SETUP.sql');
      }
    }
  } catch (err) {
    console.log('   ❌ Storage Error:', err.message);
  }
  
  // Test 3: Try to upload a test file
  console.log('\n3️⃣ Testing file upload capability...');
  try {
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'Test upload from Ko Lake Villa';
    
    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(testFileName, testContent, {
        contentType: 'text/plain',
        upsert: false
      });
    
    if (error) {
      console.log('   ❌ Upload Error:', error.message);
      if (error.message.includes('not found')) {
        console.log('   → Bucket does not exist - run COMPLETE_SETUP.sql');
      } else if (error.message.includes('policy')) {
        console.log('   → Permission denied - run COMPLETE_SETUP.sql to fix policies');
      }
    } else {
      console.log('   ✅ Upload successful');
      console.log('   → Path:', data.path);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(testFileName);
      console.log('   → Public URL:', publicUrl);
      
      // Clean up test file
      await supabase.storage.from('gallery').remove([testFileName]);
      console.log('   → Test file cleaned up');
    }
  } catch (err) {
    console.log('   ❌ Upload Error:', err.message);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log('\nIf you see ❌ errors above:');
  console.log('1. Open Supabase Dashboard → SQL Editor');
  console.log('2. Copy/paste COMPLETE_SETUP.sql');
  console.log('3. Click Run');
  console.log('4. Run this test again: node test-complete-setup.js\n');
}

test().catch(console.error);
