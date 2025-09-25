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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileUpload } from '@/components/ui/file-upload';
import { Plus, Edit, Trash2, Image, Star, Upload, Link } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  object_path: string;
  media_type: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export const AdminGallery = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    object_path: '',
    media_type: 'image',
    is_featured: false,
    display_order: 0,
  });
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload');

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      // Return data directly - no mapping needed since interface now uses object_path
      return (data || []) as GalleryItem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // No mapping needed since interface now uses object_path directly
      const dbData = {
        ...data,
        filename: data.title || 'untitled',
        category: 'villa' // Default category
      };
      
      const { error } = await supabase.from('gallery_images').insert([dbData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: 'Success', description: 'Gallery item created successfully' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      // No mapping needed since interface now uses object_path directly
      const dbData = { ...data };
      
      const { error } = await supabase.from('gallery_images').update(dbData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      toast({ title: 'Success', description: 'Gallery item updated successfully' });
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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      object_path: '',
      media_type: 'image',
      is_featured: false,
      display_order: 0,
    });
    setUploadMethod('upload');
  };

  const handleFileUpload = ({ url, mimeType }: { url: string; mimeType: string }) => {
    setFormData(prev => ({ ...prev, object_path: url }));
    
    // Auto-detect media type from MIME type
    const mediaType = mimeType.startsWith('video/') ? 'video' : 'image';
    setFormData(prev => ({ ...prev, media_type: mediaType }));
    
    toast({ 
      title: 'Upload Complete', 
      description: 'File uploaded successfully. Fill in the details and save.' 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.object_path.trim()) {
      toast({ 
        title: 'Error', 
        description: 'Please upload a file or enter a URL.',
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

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      object_path: item.object_path,
      media_type: item.media_type,
      is_featured: item.is_featured,
      display_order: item.display_order,
    });
    // Set upload method based on whether it looks like a URL or file path
    setUploadMethod(item.object_path.startsWith('http') ? 'url' : 'upload');
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gallery Management
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingItem(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Gallery Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    data-testid="input-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    data-testid="textarea-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Media Source *</Label>
                  <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as 'upload' | 'url')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload" className="flex items-center gap-2" data-testid="tab-upload">
                        <Upload className="h-4 w-4" />
                        Upload File
                      </TabsTrigger>
                      <TabsTrigger value="url" className="flex items-center gap-2" data-testid="tab-url">
                        <Link className="h-4 w-4" />
                        Enter URL
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="mt-4">
                      <FileUpload
                        onUploadComplete={handleFileUpload}
                        maxFiles={1}
                        className="w-full"
                      />
                      {formData.object_path && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-green-700">
                            Uploaded: {formData.object_path}
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="url" className="mt-4">
                      <Input
                        id="object_path"
                        data-testid="input-url"
                        type="text"
                        value={formData.object_path}
                        onChange={(e) => setFormData({ ...formData, object_path: e.target.value })}
                        placeholder="https://example.com/image.jpg or /images/uploaded/gallery-..."
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter a complete URL or a path relative to the public directory
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>

                <div>
                  <Label htmlFor="media_type">Media Type *</Label>
                  <Select value={formData.media_type} onValueChange={(value) => setFormData({ ...formData, media_type: value })}>
                    <SelectTrigger data-testid="select-media-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    data-testid="input-display-order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    data-testid="switch-featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : (editingItem ? 'Update' : 'Create')} Gallery Item
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {galleryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        {item.media_type === 'image' ? (
                          <img 
                            src={item.object_path} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                            }}
                          />
                        ) : (
                          <div className="text-center">
                            <Image className="h-6 w-6 mx-auto" />
                            <span className="text-xs">Video</span>
                          </div>
                        )}
                        <div className="hidden text-center">
                          <Image className="h-6 w-6 mx-auto" />
                          <span className="text-xs">Broken</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.media_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.is_featured && (
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.display_order}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          data-testid={`button-edit-${item.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(item.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};