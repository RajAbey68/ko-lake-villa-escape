// Test Supabase Storage Connection
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});
process.env = { ...process.env, ...envVars };

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Storage...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
  try {
    // 1. List all buckets
    console.log('\n1️⃣ Listing storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
      return;
    }
    
    console.log('✅ Found buckets:', buckets.map(b => `${b.name} (${b.public ? 'public' : 'private'})`));
    
    const galleryBucket = buckets.find(b => b.name === 'gallery');
    if (!galleryBucket) {
      console.error('\n❌ PROBLEM: "gallery" bucket does NOT exist!');
      console.log('\n📋 To fix:');
      console.log('1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/storage/buckets');
      console.log('2. Click "New bucket"');
      console.log('3. Name: gallery');
      console.log('4. Make it PUBLIC ✅');
      console.log('5. Click "Create bucket"');
      return;
    }
    
    console.log('✅ Gallery bucket exists and is', galleryBucket.public ? 'PUBLIC' : 'PRIVATE');
    
    // 2. Try to upload a test file
    console.log('\n2️⃣ Testing upload to gallery bucket...');
    const testContent = 'test file content';
    const testFileName = `test-${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(testFileName, testContent, {
        contentType: 'text/plain',
        upsert: false
      });
    
    if (uploadError) {
      console.error('❌ Upload failed:', uploadError);
      console.error('Status:', uploadError.statusCode);
      console.error('Message:', uploadError.message);
      
      if (uploadError.statusCode === '403' || uploadError.message.includes('permission')) {
        console.log('\n📋 PERMISSION ISSUE - To fix:');
        console.log('Run this SQL in Supabase SQL Editor:');
        console.log(`
-- Allow authenticated users to upload to gallery bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies
CREATE POLICY "Public read gallery" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated upload gallery" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery');
        `);
      }
      return;
    }
    
    console.log('✅ Upload successful!');
    console.log('Path:', uploadData.path);
    
    // 3. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(testFileName);
    
    console.log('✅ Public URL:', publicUrl);
    
    // 4. Clean up test file
    console.log('\n3️⃣ Cleaning up test file...');
    const { error: deleteError } = await supabase.storage
      .from('gallery')
      .remove([testFileName]);
    
    if (deleteError) {
      console.warn('⚠️ Could not delete test file:', deleteError.message);
    } else {
      console.log('✅ Test file deleted');
    }
    
    console.log('\n✅ ALL TESTS PASSED - Gallery storage is working!');
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
  }
}

testStorage();
