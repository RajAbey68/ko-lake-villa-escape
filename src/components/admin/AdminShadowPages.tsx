import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { usePageContent } from '@/hooks/usePageContent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Edit, Save, X, RefreshCw, FileText, Image as ImageIcon, Video, Code, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminShadowPages = () => {
  const [selectedPage, setSelectedPage] = useState('home');
  const [viewMode, setViewMode] = useState<'published' | 'draft'>('published');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const useDraft = viewMode === 'draft';
  const { 
    content, 
    isLoading, 
    getContent,
    getSectionContent,
    updateContent,
    publishAllDrafts,
    discardAllDrafts,
    draftCount 
  } = usePageContent(selectedPage, useDraft);

  const pages = [
    { value: 'home', label: 'Home Page', icon: '🏠' },
    { value: 'rooms', label: 'Rooms', icon: '🛏️' },
    { value: 'gallery', label: 'Gallery', icon: '🖼️' },
    { value: 'amenities', label: 'Amenities', icon: '⭐' },
    { value: 'experiences', label: 'Experiences', icon: '🎯' },
    { value: 'deals', label: 'Deals', icon: '💰' },
    { value: 'contact', label: 'Contact', icon: '📞' },
    { value: 'book', label: 'Booking', icon: '📅' },
  ];

  const contentTypes = [
    { value: 'text', label: 'Text', icon: FileText },
    { value: 'image', label: 'Image', icon: ImageIcon },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'html', label: 'HTML', icon: Code },
  ];

  const handlePublishAll = async () => {
    if (draftCount === 0) {
      toast({
        title: 'No drafts to publish',
        description: 'There are no unpublished changes.',
        variant: 'destructive',
      });
      return;
    }
    await publishAllDrafts.mutateAsync();
  };

  const handleDiscardAll = async () => {
    if (draftCount === 0) {
      toast({
        title: 'No drafts to discard',
        description: 'There are no unpublished changes.',
        variant: 'destructive',
      });
      return;
    }
    await discardAllDrafts.mutateAsync();
  };

  const handleEditItem = (item: any) => {
    setEditingItem({
      ...item,
      editValue: item.draft_value || item.published_value || '',
    });
    setIsDialogOpen(true);
  };

  const handleSaveDraft = async () => {
    if (!editingItem) return;

    await updateContent.mutateAsync({
      sectionId: editingItem.section_id,
      fieldName: editingItem.field_name,
      value: editingItem.editValue,
      contentType: editingItem.content_type,
    });

    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const getContentTypeIcon = (type: string) => {
    const contentType = contentTypes.find(ct => ct.value === type);
    if (!contentType) return FileText;
    return contentType.icon;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading page content...</p>
        </CardContent>
      </Card>
    );
  }

  const currentPage = pages.find(p => p.value === selectedPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Shadow Page Editor</span>
          {draftCount > 0 && (
            <Badge variant="secondary">{draftCount} unpublished change{draftCount !== 1 ? 's' : ''}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Page Selector */}
        <div className="flex items-center gap-4">
          <Label className="font-medium min-w-[100px]">Select Page:</Label>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pages.map(page => (
                <SelectItem key={page.value} value={page.value}>
                  <span className="flex items-center gap-2">
                    <span>{page.icon}</span>
                    <span>{page.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground">
            Editing: <strong>{currentPage?.label}</strong>
          </span>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-4">
          <Label className="font-medium min-w-[100px]">View Mode:</Label>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="published">
                <Eye className="h-4 w-4 mr-2" />
                Published (Live)
              </TabsTrigger>
              <TabsTrigger value="draft">
                <Edit className="h-4 w-4 mr-2" />
                Draft (Preview)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          <Button 
            onClick={handlePublishAll}
            disabled={draftCount === 0 || publishAllDrafts.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            Publish All Changes ({draftCount})
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDiscardAll}
            disabled={draftCount === 0 || discardAllDrafts.isPending}
          >
            <X className="h-4 w-4 mr-2" />
            Discard All Drafts
          </Button>
          <Button 
            variant="ghost"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Content Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No content found for this page. Add content to get started.
                  </TableCell>
                </TableRow>
              ) : (
                content.map((item) => {
                  const ContentIcon = getContentTypeIcon(item.content_type);
                  const displayValue = viewMode === 'draft' && item.draft_value 
                    ? item.draft_value 
                    : item.published_value || '';
                  const hasDraft = item.draft_value !== null;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.section_id}</TableCell>
                      <TableCell>{item.field_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ContentIcon className="h-4 w-4" />
                          <span className="text-sm">{item.content_type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        {item.content_type === 'image' || item.content_type === 'video' ? (
                          <a 
                            href={displayValue} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm truncate block"
                          >
                            {displayValue.substring(0, 50)}...
                          </a>
                        ) : (
                          <span className="text-sm truncate block">{displayValue}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasDraft ? (
                          <Badge variant="secondary">Draft</Badge>
                        ) : item.is_published ? (
                          <Badge variant="default">Published</Badge>
                        ) : (
                          <Badge variant="outline">New</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Edit Content: {editingItem?.section_id} → {editingItem?.field_name}
              </DialogTitle>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4">
                <div>
                  <Label>Content Type</Label>
                  <p className="text-sm text-muted-foreground capitalize">{editingItem.content_type}</p>
                </div>
                <div>
                  <Label htmlFor="edit-value">
                    {editingItem.content_type === 'image' || editingItem.content_type === 'video' 
                      ? 'URL' 
                      : 'Content'}
                  </Label>
                  {editingItem.content_type === 'html' || editingItem.editValue?.length > 100 ? (
                    <Textarea
                      id="edit-value"
                      value={editingItem.editValue}
                      onChange={(e) => setEditingItem({ ...editingItem, editValue: e.target.value })}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  ) : (
                    <Input
                      id="edit-value"
                      value={editingItem.editValue}
                      onChange={(e) => setEditingItem({ ...editingItem, editValue: e.target.value })}
                    />
                  )}
                </div>
                {(editingItem.content_type === 'image' || editingItem.content_type === 'video') && editingItem.editValue && (
                  <div>
                    <Label>Preview</Label>
                    {editingItem.content_type === 'image' ? (
                      <img 
                        src={editingItem.editValue} 
                        alt="Preview" 
                        className="max-w-full h-auto rounded-lg border mt-2"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/400x300?text=Invalid+Image+URL';
                        }}
                      />
                    ) : (
                      <video 
                        src={editingItem.editValue} 
                        controls 
                        className="max-w-full h-auto rounded-lg border mt-2"
                      />
                    )}
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveDraft} disabled={updateContent.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
