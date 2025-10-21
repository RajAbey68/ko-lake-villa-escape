import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Upload, Sparkles, Edit, Trash2, Image as ImageIcon, Video, Eye, CheckCircle, Loader2 } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  object_path: string;
  media_type: string;
  is_featured: boolean;
  display_order: number;
  category: string | null;
  created_at: string;
}

interface PendingUpload {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'analyzing' | 'ready' | 'error';
  progress: number;
  url?: string;
  aiMetadata?: {
    title: string;
    description: string;
    altText: string;
    category: string;
    keywords: string[];
  };
  error?: string;
}

export const AdminGalleryAI = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as GalleryItem[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast({ title: 'Success', description: 'Gallery item deleted successfully' });
    },
  });

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newUploads: PendingUpload[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    }));

    setPendingUploads(prev => [...prev, ...newUploads]);
    setIsUploadDialogOpen(true);
  };

  // Upload file to Supabase Storage
  const uploadFile = async (upload: PendingUpload, index: number): Promise<string> => {
    const fileExt = upload.file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    setPendingUploads(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: 'uploading', progress: 30 };
      return updated;
    });

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, upload.file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    setPendingUploads(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], progress: 50, url: publicUrl };
      return updated;
    });

    return publicUrl;
  };

  // Analyze image with AI
  const analyzeWithAI = async (url: string, index: number) => {
    setPendingUploads(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: 'analyzing', progress: 70 };
      return updated;
    });

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: `Analyze this image from Ko Lake Villa (luxury lakeside resort in Ahangama, Sri Lanka) and generate:
1. SEO-optimized title (max 60 characters)
2. Detailed description (max 155 characters) 
3. Accessibility alt text (descriptive, max 125 characters)
4. Category (choose one: villa, pool, rooms, dining, exterior, lake, amenities)
5. Three relevant keywords

Image URL: ${url}

Return as JSON with keys: title, description, altText, category, keywords (array)`,
          context: 'seo'
        }
      });

      if (error) throw error;

      // Parse AI response
      const aiResponse = data.response;
      let metadata;
      
      try {
        // Try to extract JSON from response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          metadata = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: parse structured text
          metadata = {
            title: aiResponse.match(/title[:\s]+(.+)/i)?.[1]?.trim() || 'Ko Lake Villa',
            description: aiResponse.match(/description[:\s]+(.+)/i)?.[1]?.trim() || '',
            altText: aiResponse.match(/alt[:\s]+(.+)/i)?.[1]?.trim() || '',
            category: aiResponse.match(/category[:\s]+(.+)/i)?.[1]?.trim().toLowerCase() || 'villa',
            keywords: []
          };
        }
      } catch (parseError) {
        // Fallback metadata
        metadata = {
          title: 'Ko Lake Villa',
          description: 'Beautiful view at Ko Lake Villa',
          altText: 'Ko Lake Villa property',
          category: 'villa',
          keywords: ['ko lake', 'villa', 'sri lanka']
        };
      }

      setPendingUploads(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          status: 'ready',
          progress: 100,
          aiMetadata: metadata
        };
        return updated;
      });

    } catch (error) {
      console.error('AI analysis error:', error);
      // Set default metadata on error
      setPendingUploads(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          status: 'ready',
          progress: 100,
          aiMetadata: {
            title: upload.file.name.replace(/\.[^/.]+$/, ''),
            description: 'Ko Lake Villa',
            altText: 'Ko Lake Villa property',
            category: 'villa',
            keywords: []
          }
        };
        return updated;
      });
    }
  };

  // Process all uploads
  const handleProcessUploads = async () => {
    for (let i = 0; i < pendingUploads.length; i++) {
      const upload = pendingUploads[i];
      if (upload.status !== 'pending') continue;

      try {
        const url = await uploadFile(upload, i);
        await analyzeWithAI(url, i);
      } catch (error: any) {
        setPendingUploads(prev => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            status: 'error',
            error: error.message
          };
          return updated;
        });
      }
    }
  };

  // Publish to database
  const handlePublishAll = async () => {
    const readyUploads = pendingUploads.filter(u => u.status === 'ready');
    
    if (readyUploads.length === 0) {
      toast({
        title: 'No items ready',
        description: 'Process uploads first before publishing.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const items = readyUploads.map((upload, idx) => ({
        title: upload.aiMetadata!.title,
        description: upload.aiMetadata!.description,
        object_path: upload.url!,
        media_type: upload.file.type.startsWith('video/') ? 'video' : 'image',
        is_featured: false,
        display_order: galleryItems.length + idx,
        category: upload.aiMetadata!.category,
        filename: upload.file.name
      }));

      const { error } = await supabase.from('gallery_images').insert(items);
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast({
        title: 'Success!',
        description: `Published ${readyUploads.length} items to gallery.`
      });

      setPendingUploads([]);
      setIsUploadDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error publishing',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleEditMetadata = (index: number) => {
    setEditingIndex(index);
  };

  const handleUpdateMetadata = (index: number, field: string, value: string) => {
    setPendingUploads(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        aiMetadata: {
          ...updated[index].aiMetadata!,
          [field]: value
        }
      };
      return updated;
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading gallery...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gallery Management (AI-Powered)</span>
          <div className="flex gap-2">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button onClick={() => document.getElementById('file-upload')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Images/Videos
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleryItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No gallery items yet. Upload images to get started.
                  </TableCell>
                </TableRow>
              ) : (
                galleryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.media_type === 'video' ? (
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                          <Video className="h-6 w-6 text-gray-400" />
                        </div>
                      ) : (
                        <img 
                          src={item.object_path} 
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/100x100?text=Error';
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.media_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{item.category || 'villa'}</TableCell>
                    <TableCell className="text-center">
                      {item.is_featured && <Badge>Featured</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(item.object_path, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this item?')) {
                              deleteMutation.mutate(item.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Upload & AI Analysis Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Powered Gallery Upload
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {pendingUploads.map((upload, index) => (
                <Card key={index} className="p-4">
                  <div className="flex gap-4">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      {upload.file.type.startsWith('video/') ? (
                        <video src={upload.preview} className="w-32 h-32 object-cover rounded" />
                      ) : (
                        <img src={upload.preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{upload.file.name}</span>
                        {upload.status === 'ready' && (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ready
                          </Badge>
                        )}
                        {upload.status === 'analyzing' && (
                          <Badge variant="secondary">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Analyzing...
                          </Badge>
                        )}
                        {upload.status === 'error' && (
                          <Badge variant="destructive">Error</Badge>
                        )}
                      </div>

                      {/* Progress */}
                      {upload.status !== 'pending' && upload.status !== 'ready' && (
                        <Progress value={upload.progress} className="h-2" />
                      )}

                      {/* AI Metadata (editable) */}
                      {upload.aiMetadata && (
                        <div className="space-y-2 text-sm">
                          {editingIndex === index ? (
                            <>
                              <Input
                                value={upload.aiMetadata.title}
                                onChange={(e) => handleUpdateMetadata(index, 'title', e.target.value)}
                                placeholder="Title"
                              />
                              <Textarea
                                value={upload.aiMetadata.description}
                                onChange={(e) => handleUpdateMetadata(index, 'description', e.target.value)}
                                placeholder="Description"
                                rows={2}
                              />
                              <Select
                                value={upload.aiMetadata.category}
                                onValueChange={(value) => handleUpdateMetadata(index, 'category', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="villa">Villa</SelectItem>
                                  <SelectItem value="pool">Pool</SelectItem>
                                  <SelectItem value="rooms">Rooms</SelectItem>
                                  <SelectItem value="dining">Dining</SelectItem>
                                  <SelectItem value="exterior">Exterior</SelectItem>
                                  <SelectItem value="lake">Lake Views</SelectItem>
                                  <SelectItem value="amenities">Amenities</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="sm" onClick={() => setEditingIndex(null)}>Done</Button>
                            </>
                          ) : (
                            <>
                              <div><strong>Title:</strong> {upload.aiMetadata.title}</div>
                              <div><strong>Description:</strong> {upload.aiMetadata.description}</div>
                              <div><strong>Category:</strong> {upload.aiMetadata.category}</div>
                              <Button size="sm" variant="outline" onClick={() => handleEditMetadata(index)}>
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setPendingUploads([]);
                setIsUploadDialogOpen(false);
              }}>
                Cancel
              </Button>
              <div className="flex gap-2">
                {pendingUploads.some(u => u.status === 'pending') && (
                  <Button onClick={handleProcessUploads}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Process with AI
                  </Button>
                )}
                {pendingUploads.some(u => u.status === 'ready') && (
                  <Button onClick={handlePublishAll} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Publish All
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
