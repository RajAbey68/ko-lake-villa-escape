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
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';

interface LocationInfo {
  id: string;
  title: string;
  description: string | null;
  address: string | null;
  coordinates: string | null;
  contact_info: any;
  transport_options: any;
  nearby_attractions: any;
  is_active: boolean;
  created_at: string;
}

export const AdminLocationInfo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationInfo | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    coordinates: '',
    contact_info: '',
    transport_options: '',
    nearby_attractions: '',
    is_active: true,
  });

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['admin-location-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('location_info')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as LocationInfo[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('location_info').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-location-info'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: 'Success', description: 'Location info created successfully' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase.from('location_info').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-location-info'] });
      setIsDialogOpen(false);
      setEditingLocation(null);
      resetForm();
      toast({ title: 'Success', description: 'Location info updated successfully' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('location_info').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-location-info'] });
      toast({ title: 'Success', description: 'Location info deleted successfully' });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      address: '',
      coordinates: '',
      contact_info: '',
      transport_options: '',
      nearby_attractions: '',
      is_active: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      title: formData.title,
      description: formData.description || null,
      address: formData.address || null,
      coordinates: formData.coordinates || null,
      contact_info: formData.contact_info ? JSON.parse(formData.contact_info) : null,
      transport_options: formData.transport_options ? JSON.parse(formData.transport_options) : null,
      nearby_attractions: formData.nearby_attractions ? JSON.parse(formData.nearby_attractions) : null,
      is_active: formData.is_active,
    };

    if (editingLocation) {
      updateMutation.mutate({ id: editingLocation.id, ...submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (location: LocationInfo) => {
    setEditingLocation(location);
    setFormData({
      title: location.title,
      description: location.description || '',
      address: location.address || '',
      coordinates: location.coordinates || '',
      contact_info: location.contact_info ? JSON.stringify(location.contact_info, null, 2) : '',
      transport_options: location.transport_options ? JSON.stringify(location.transport_options, null, 2) : '',
      nearby_attractions: location.nearby_attractions ? JSON.stringify(location.nearby_attractions, null, 2) : '',
      is_active: location.is_active,
    });
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Location Information Management
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingLocation(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Location Info
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingLocation ? 'Edit Location Info' : 'Add New Location Info'}
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
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="coordinates">Coordinates (lat,lng)</Label>
                  <Input
                    id="coordinates"
                    value={formData.coordinates}
                    onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                    placeholder="e.g., -1.2345, 36.7890"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_info">Contact Info (JSON)</Label>
                  <Textarea
                    id="contact_info"
                    value={formData.contact_info}
                    onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                    rows={4}
                    placeholder='{"phone": "+254700000000", "email": "contact@kolakehouse.com"}'
                  />
                </div>

                <div>
                  <Label htmlFor="transport_options">Transport Options (JSON)</Label>
                  <Textarea
                    id="transport_options"
                    value={formData.transport_options}
                    onChange={(e) => setFormData({ ...formData, transport_options: e.target.value })}
                    rows={4}
                    placeholder='[{"name": "Airport Transfer", "description": "Private transfer from JKIA", "cost": "$50"}]'
                  />
                </div>

                <div>
                  <Label htmlFor="nearby_attractions">Nearby Attractions (JSON)</Label>
                  <Textarea
                    id="nearby_attractions"
                    value={formData.nearby_attractions}
                    onChange={(e) => setFormData({ ...formData, nearby_attractions: e.target.value })}
                    rows={4}
                    placeholder='[{"name": "Lake Naivasha", "distance": "5 minutes walk", "description": "Beautiful freshwater lake"}]'
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingLocation ? 'Update' : 'Create'} Location Info
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
                  <TableHead>Address</TableHead>
                  <TableHead>Coordinates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{location.title}</p>
                        {location.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {location.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {location.address && (
                        <p className="text-sm line-clamp-2">{location.address}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      {location.coordinates && (
                        <code className="text-xs bg-muted p-1 rounded">{location.coordinates}</code>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={location.is_active ? 'default' : 'secondary'}>
                        {location.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(location)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(location.id)}
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