import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Base interface for all gallery media items
export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  object_path: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  display_order: number;
  category: string;
  filename: string;
  created_at: string;
  updated_at: string;
  // Video-specific fields (optional for images)
  thumbnail_path?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
  // Additional metadata fields
  alt_text?: string | null;
  seo_description?: string | null;
  keywords?: any;
}

// Type guards for media types
export const isVideoItem = (item: GalleryItem): boolean => {
  return item.media_type === 'video';
};

export const isImageItem = (item: GalleryItem): boolean => {
  return item.media_type === 'image';
};

// Get all gallery items (both images and videos)
export const useGallery = () => {
  return useQuery({
    queryKey: ['gallery-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GalleryItem[];
    },
  });
};

// Get only gallery images (for image-specific components)
export const useGalleryImages = () => {
  return useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('media_type', 'image')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GalleryItem[];
    },
  });
};

// Get only gallery videos
export const useGalleryVideos = () => {
  return useQuery({
    queryKey: ['gallery-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('media_type', 'video')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GalleryItem[];
    },
  });
};

// Get featured gallery items (both images and videos)
export const useFeaturedGallery = () => {
  return useQuery({
    queryKey: ['featured-gallery-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GalleryItem[];
    },
  });
};

// Get featured images only
export const useFeaturedGalleryImages = () => {
  return useQuery({
    queryKey: ['featured-gallery-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('media_type', 'image')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GalleryItem[];
    },
  });
};

// Get gallery items by category (both images and videos)
export const useGalleryByCategory = (category?: string, mediaType?: 'image' | 'video' | 'all') => {
  return useQuery({
    queryKey: ['gallery-items-by-category', category, mediaType],
    queryFn: async () => {
      let query = supabase
        .from('gallery_images')
        .select('*');

      // Filter by media type if specified
      if (mediaType && mediaType !== 'all') {
        query = query.eq('media_type', mediaType);
      }

      // Filter by category if specified
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GalleryItem[];
    },
    enabled: !!category,
  });
};

export const useGalleryMutations = () => {
  const queryClient = useQueryClient();

  const createGalleryItem = useMutation({
    mutationFn: async (newItem: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>) => {
      // No mapping needed since interface now uses object_path directly
      const dbItem = {
        ...newItem,
        filename: newItem.title || 'untitled',
        category: newItem.category || 'villa' // Default category
      };
      
      const { data, error } = await supabase
        .from('gallery_images')
        .insert([dbItem])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all gallery-related queries
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-videos'] });
      queryClient.invalidateQueries({ queryKey: ['featured-gallery-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-items-by-category'] });
    },
  });

  const updateGalleryItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<GalleryItem> }) => {
      // No mapping needed since interface now uses object_path directly
      const dbUpdates = { ...updates };
      
      const { data, error } = await supabase
        .from('gallery_images')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all gallery-related queries
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-videos'] });
      queryClient.invalidateQueries({ queryKey: ['featured-gallery-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-items-by-category'] });
    },
  });

  const deleteGalleryItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all gallery-related queries
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-videos'] });
      queryClient.invalidateQueries({ queryKey: ['featured-gallery-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-items-by-category'] });
    },
  });

  return {
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
  };
};