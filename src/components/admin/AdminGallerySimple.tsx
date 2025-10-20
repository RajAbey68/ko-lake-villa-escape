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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Image as ImageIcon, Video, ExternalLink, Eye } from 'lucide-react';

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

export const AdminGallerySimple = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    object_path: '',
    media_type: 'image',
    is_featured: false,
    display_order: 0,
    category: 'villa',
  });

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

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('gallery_images').insert([{
        ...data,
        filename: data.title || 'untitled',
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: 'Success', description: 'Gallery item created successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to create gallery item',
        variant: 'destructive'
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase.from('gallery_images').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      toast({ title: 'Success', description: 'Gallery item updated successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to update gallery item',
        variant: 'destructive'
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error} = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast({ title: 'Success', description: 'Gallery item deleted successfully' });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      object_path: '',
      media_type: 'image',
      is_featured: false,
      display_order: 0,
      category: 'villa',
    });
    setPreviewUrl('');
  };

  const handleOpenDialog = (item?: GalleryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description || '',
        object_path: item.object_path,
        media_type: item.media_type,
        is_featured: item.is_featured,
        display_order: item.display_order,
        category: item.category || 'villa',
      });
      setPreviewUrl(item.object_path);
    } else {
      setEditingItem(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.object_path.trim()) {
      toast({ 
        title: 'Error', 
        description: 'Please enter an image/video URL.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.title.trim()) {
      toast({ 
        title: 'Error', 
        description: 'Please enter a title.',
        variant: 'destructive'
      });
      return;
    }
    
    const submitData = {
      ...formData,
      description: formData.description || null,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, ...submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handlePreview = () => {
    if (formData.object_path.trim()) {
      setPreviewUrl(formData.object_path);
    }
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
          <span>Gallery Management</span>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Gallery Item
          </Button>
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
                <TableHead className="text-center">Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleryItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No gallery items yet. Click "Add Gallery Item" to get started.
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
                    <TableCell className="text-center">{item.display_order}</TableCell>
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
                          onClick={() => handleOpenDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
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

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Image/Video URL *</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    value={formData.object_path}
                    onChange={(e) => setFormData({ ...formData, object_path: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  <Button type="button" variant="outline" onClick={handlePreview}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the full URL to your image or video file
                </p>
              </div>

              {previewUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  {formData.media_type === 'video' ? (
                    <video 
                      src={previewUrl} 
                      controls 
                      className="w-full max-h-64 rounded-lg border"
                    />
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt="Preview"
                      className="w-full max-h-64 object-contain rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/400x300?text=Invalid+URL';
                      }}
                    />
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Pool at Sunset"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="media_type">Media Type</Label>
                  <Select
                    value={formData.media_type}
                    onValueChange={(value) => setFormData({ ...formData, media_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beautiful pool view at sunset..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="featured">Mark as Featured</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingItem ? 'Update' : 'Create'} Gallery Item
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
