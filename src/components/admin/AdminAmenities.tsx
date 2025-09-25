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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

interface Amenity {
  id: string;
  title: string;
  description: string | null;
  category: string;
  icon_name: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export const AdminAmenities = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'resort_facilities',
    icon_name: '',
    image_url: '',
    is_featured: false,
    is_active: true,
    display_order: 0,
  });

  const { data: amenities = [], isLoading } = useQuery({
    queryKey: ['admin-amenities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Amenity[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('amenities').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-amenities'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: 'Success', description: 'Amenity created successfully' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase.from('amenities').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-amenities'] });
      setIsDialogOpen(false);
      setEditingAmenity(null);
      resetForm();
      toast({ title: 'Success', description: 'Amenity updated successfully' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('amenities').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-amenities'] });
      toast({ title: 'Success', description: 'Amenity deleted successfully' });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'resort_facilities',
      icon_name: '',
      image_url: '',
      is_featured: false,
      is_active: true,
      display_order: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      description: formData.description || null,
      icon_name: formData.icon_name || null,
      image_url: formData.image_url || null,
    };

    if (editingAmenity) {
      updateMutation.mutate({ id: editingAmenity.id, ...submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      title: amenity.title,
      description: amenity.description || '',
      category: amenity.category,
      icon_name: amenity.icon_name || '',
      image_url: amenity.image_url || '',
      is_featured: amenity.is_featured,
      is_active: amenity.is_active,
      display_order: amenity.display_order,
    });
    setIsDialogOpen(true);
  };

  const categories = [
    { value: 'resort_facilities', label: 'Resort Facilities' },
    { value: 'comfort', label: 'Comfort' },
    { value: 'activities', label: 'Activities' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Amenities Management
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingAmenity(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Amenity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="icon_name">Icon Name (Lucide React)</Label>
                  <Input
                    id="icon_name"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    placeholder="e.g., Wifi, Car, Utensils"
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAmenity ? 'Update' : 'Create'} Amenity
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
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amenities.map((amenity) => (
                  <TableRow key={amenity.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{amenity.title}</p>
                        {amenity.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {amenity.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {categories.find(c => c.value === amenity.category)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {amenity.icon_name && (
                        <code className="text-sm bg-muted p-1 rounded">{amenity.icon_name}</code>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {amenity.is_featured && (
                          <Badge variant="secondary">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant={amenity.is_active ? 'default' : 'secondary'}>
                          {amenity.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(amenity)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(amenity.id)}
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