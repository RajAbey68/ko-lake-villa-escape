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
import { Plus, Edit, Trash2, Bed } from 'lucide-react';

interface RoomType {
  id: string;
  name: string;
  description: string | null;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  direct_price: number | null;
  airbnb_price: number | null;
  airbnb_url: string | null;
  is_available: boolean;
  display_order: number;
  images: string[] | null;
  amenities: string[] | null;
}

export const AdminRoomTypes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    max_guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    direct_price: '',
    airbnb_price: '',
    airbnb_url: '',
    is_available: true,
    display_order: 0,
    images: '',
    amenities: '',
  });

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['admin-room-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as RoomType[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('room_types').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-room-types'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: 'Success', description: 'Room type created successfully' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase.from('room_types').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-room-types'] });
      setIsDialogOpen(false);
      setEditingRoom(null);
      resetForm();
      toast({ title: 'Success', description: 'Room type updated successfully' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('room_types').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-room-types'] });
      toast({ title: 'Success', description: 'Room type deleted successfully' });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      max_guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      direct_price: '',
      airbnb_price: '',
      airbnb_url: '',
      is_available: true,
      display_order: 0,
      images: '',
      amenities: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      direct_price: formData.direct_price ? parseFloat(formData.direct_price) : null,
      airbnb_price: formData.airbnb_price ? parseFloat(formData.airbnb_price) : null,
      images: formData.images ? formData.images.split(',').map(s => s.trim()) : null,
      amenities: formData.amenities ? formData.amenities.split(',').map(s => s.trim()) : null,
    };

    if (editingRoom) {
      updateMutation.mutate({ id: editingRoom.id, ...submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (room: RoomType) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description || '',
      max_guests: room.max_guests,
      bedrooms: room.bedrooms,
      bathrooms: room.bathrooms,
      direct_price: room.direct_price?.toString() || '',
      airbnb_price: room.airbnb_price?.toString() || '',
      airbnb_url: room.airbnb_url || '',
      is_available: room.is_available,
      display_order: room.display_order,
      images: room.images?.join(', ') || '',
      amenities: room.amenities?.join(', ') || '',
    });
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Room Types Management
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingRoom(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Room Type
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRoom ? 'Edit Room Type' : 'Add New Room Type'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_guests">Max Guests *</Label>
                    <Input
                      id="max_guests"
                      type="number"
                      min="1"
                      value={formData.max_guests}
                      onChange={(e) => setFormData({ ...formData, max_guests: parseInt(e.target.value) })}
                      required
                    />
                  </div>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="1"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="1"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="direct_price">Direct Price ($)</Label>
                    <Input
                      id="direct_price"
                      type="number"
                      step="0.01"
                      value={formData.direct_price}
                      onChange={(e) => setFormData({ ...formData, direct_price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="airbnb_price">Airbnb Price ($)</Label>
                    <Input
                      id="airbnb_price"
                      type="number"
                      step="0.01"
                      value={formData.airbnb_price}
                      onChange={(e) => setFormData({ ...formData, airbnb_price: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="airbnb_url">Airbnb URL</Label>
                  <Input
                    id="airbnb_url"
                    type="url"
                    value={formData.airbnb_url}
                    onChange={(e) => setFormData({ ...formData, airbnb_url: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="images">Images (comma-separated URLs)</Label>
                  <Textarea
                    id="images"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                  <Textarea
                    id="amenities"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    placeholder="Wi-Fi, Air Conditioning, Mini Bar, Lake View"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="is_available"
                      checked={formData.is_available}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                    />
                    <Label htmlFor="is_available">Available</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRoom ? 'Update' : 'Create'} Room Type
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
                  <TableHead>Name</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Rooms</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{room.name}</p>
                        {room.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {room.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{room.max_guests} guests</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{room.bedrooms} bed(s)</p>
                        <p>{room.bathrooms} bath(s)</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {room.direct_price && <p>Direct: ${room.direct_price}</p>}
                        {room.airbnb_price && <p>Airbnb: ${room.airbnb_price}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={room.is_available ? 'default' : 'secondary'}>
                        {room.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(room)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(room.id)}
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