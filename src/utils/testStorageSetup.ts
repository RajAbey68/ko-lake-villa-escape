import { supabase } from '@/integrations/supabase/client';

export const testStorageSetup = async () => {
  try {
    // Test if the gallery bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return {
        success: false,
        error: 'Failed to connect to Supabase Storage',
        details: bucketsError.message
      };
    }

    const galleryBucket = buckets?.find(bucket => bucket.name === 'gallery');
    
    if (!galleryBucket) {
      return {
        success: false,
        error: 'Gallery bucket not found',
        details: 'The "gallery" storage bucket needs to be created in Supabase',
        availableBuckets: buckets?.map(b => b.name) || []
      };
    }

    // Test uploading a small test file
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const testPath = `test/${Date.now()}.txt`;
    
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(testPath, testFile);

    if (uploadError) {
      return {
        success: false,
        error: 'Upload test failed',
        details: uploadError.message
      };
    }

    // Clean up test file
    await supabase.storage.from('gallery').remove([testPath]);

    return {
      success: true,
      message: 'Storage setup is working correctly',
      bucket: galleryBucket
    };

  } catch (error) {
    return {
      success: false,
      error: 'Unexpected error during storage test',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const createGalleryBucket = async () => {
  try {
    const { data, error } = await supabase.storage.createBucket('gallery', {
      public: true,
      allowedMimeTypes: [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/mov', 'video/avi'
      ],
      fileSizeLimit: 52428800 // 50MB
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create bucket'
    };
  }
};