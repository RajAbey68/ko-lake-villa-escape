import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PageContent {
  id: string;
  page_slug: string;
  section_id: string;
  content_type: string;
  field_name: string;
  published_value: string | null;
  draft_value: string | null;
  is_published: boolean;
  published_at: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Hook to fetch and manage page content from the Shadow CMS
 * @param pageSlug - The page slug (e.g., 'home', 'rooms', 'gallery')
 * @param useDraft - Whether to use draft values (for admin preview)
 */
export const usePageContent = (pageSlug: string, useDraft: boolean = false) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch page content
  const { data: content = [], isLoading, error } = useQuery({
    queryKey: ['page-content', pageSlug, useDraft],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as PageContent[];
    },
  });

  // Helper function to get content value
  const getContent = (sectionId: string, fieldName: string, fallback: string = ''): string => {
    const item = content.find(
      c => c.section_id === sectionId && c.field_name === fieldName
    );
    
    if (!item) return fallback;
    
    // Use draft value if in preview mode and draft exists
    if (useDraft && item.draft_value) {
      return item.draft_value;
    }
    
    // Otherwise use published value
    return item.published_value || fallback;
  };

  // Helper function to get all content for a section
  const getSectionContent = (sectionId: string) => {
    return content.filter(c => c.section_id === sectionId);
  };

  // Update content (saves as draft)
  const updateContent = useMutation({
    mutationFn: async ({
      sectionId,
      fieldName,
      value,
      contentType = 'text',
    }: {
      sectionId: string;
      fieldName: string;
      value: string;
      contentType?: string;
    }) => {
      const { data, error } = await supabase
        .from('page_content')
        .upsert({
          page_slug: pageSlug,
          section_id: sectionId,
          field_name: fieldName,
          content_type: contentType,
          draft_value: value,
          is_published: false,
        }, {
          onConflict: 'page_slug,section_id,field_name',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content', pageSlug] });
      toast({
        title: 'Draft saved',
        description: 'Your changes have been saved as a draft.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error saving draft',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Publish a specific content item
  const publishContent = useMutation({
    mutationFn: async (contentId: string) => {
      // Get the content item
      const item = content.find(c => c.id === contentId);
      if (!item || !item.draft_value) {
        throw new Error('No draft to publish');
      }

      const { data, error } = await supabase
        .from('page_content')
        .update({
          published_value: item.draft_value,
          draft_value: null,
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq('id', contentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content', pageSlug] });
      toast({
        title: 'Published',
        description: 'Your changes are now live.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error publishing',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Publish all drafts for this page
  const publishAllDrafts = useMutation({
    mutationFn: async () => {
      // Get all items with drafts
      const itemsWithDrafts = content.filter(c => c.draft_value !== null);
      
      if (itemsWithDrafts.length === 0) {
        throw new Error('No drafts to publish');
      }

      // Update all items
      const updates = itemsWithDrafts.map(item => ({
        id: item.id,
        published_value: item.draft_value,
        draft_value: null,
        is_published: true,
        published_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('page_content')
        .upsert(updates);

      if (error) throw error;
      return updates;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content', pageSlug] });
      toast({
        title: 'All changes published',
        description: 'All draft changes are now live on the public site.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error publishing',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Discard all drafts for this page
  const discardAllDrafts = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('page_content')
        .update({ draft_value: null })
        .eq('page_slug', pageSlug)
        .not('draft_value', 'is', null);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content', pageSlug] });
      toast({
        title: 'Drafts discarded',
        description: 'All unpublished changes have been removed.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error discarding drafts',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Count drafts
  const draftCount = content.filter(c => c.draft_value !== null).length;

  return {
    content,
    isLoading,
    error,
    getContent,
    getSectionContent,
    updateContent,
    publishContent,
    publishAllDrafts,
    discardAllDrafts,
    draftCount,
  };
};
