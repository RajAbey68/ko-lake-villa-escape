// AdminGallery.tsx — Storage-based gallery management (no database table required)
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, RefreshCw, Image as ImageIcon } from 'lucide-react';

type GalleryItem = {
  id: string;       // full object path: images/filename.jpg
  name: string;     // filename
  url: string;      // public URL
  createdAt?: string;
  isVideo?: boolean;
};

const BUCKET = 'gallery';
const PREFIX = 'images/';

async function listGallery(limit = 100, offset = 0): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .storage
    .from(BUCKET)
    .list(PREFIX, { limit, offset, sortBy: { column: 'created_at', order: 'desc' } });

  if (error) throw error;

  return (data ?? [])
    .filter(e => e?.name && e.name !== '.emptyFolderPlaceholder')
    .map((e) => {
      const path = `${PREFIX}${e.name}`;
      const pub = supabase.storage.from(BUCKET).getPublicUrl(path).data?.publicUrl ?? '';
      const isVideo = /\.(mp4|webm|mov|avi)$/i.test(e.name!);
      return { 
        id: path, 
        name: e.name!, 
        url: pub, 
        createdAt: (e as any)?.created_at,
        isVideo 
      };
    });
}

async function uploadImage(file: File) {
  const safeName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const path = `${PREFIX}${safeName}`;
  const { error } = await supabase
    .storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: true, contentType: file.type });

  if (error) throw error;
  const pub = supabase.storage.from(BUCKET).getPublicUrl(path).data?.publicUrl ?? '';
  const isVideo = file.type.startsWith('video/');
  return { id: path, name: safeName, url: pub, isVideo };
}

async function deleteImage(id: string) {
  const { error } = await supabase.storage.from(BUCKET).remove([id]);
  if (error) throw error;
}

export const AdminGallery = () => {
  const { toast } = useToast();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listGallery(200, 0);
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? String(e));
      toast({ 
        title: 'Error loading gallery', 
        description: e?.message ?? 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onPick = useCallback(() => fileInput.current?.click(), []);

  const onFilesSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setBusy(true);
    setError(null);
    try {
      for (const f of files) {
        const created = await uploadImage(f);
        setItems(prev => [created as GalleryItem, ...prev]);
        toast({ title: 'Success', description: `Uploaded ${f.name}` });
      }
    } catch (e: any) {
      setError(e?.message ?? String(e));
      toast({ 
        title: 'Upload failed', 
        description: e?.message ?? 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }, [toast]);

  const onDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Delete ${name} from the gallery?`)) return;
    setBusy(true);
    setError(null);
    try {
      await deleteImage(id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast({ title: 'Success', description: `Deleted ${name}` });
    } catch (e: any) {
      setError(e?.message ?? String(e));
      toast({ 
        title: 'Delete failed', 
        description: e?.message ?? 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setBusy(false);
    }
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gallery Management</span>
          <div className="flex gap-2">
            <Button onClick={refresh} variant="outline" size="sm" disabled={loading || busy}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={onPick} disabled={busy}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Images/Videos
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={onFilesSelected}
          style={{ display: 'none' }}
        />

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No images in gallery yet</p>
            <p className="text-sm">Click "Upload Images/Videos" to add media</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item) => (
              <div key={item.id} className="group relative rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {item.isVideo ? (
                    <>
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                        onMouseLeave={(e) => {
                          const vid = e.target as HTMLVideoElement;
                          vid.pause();
                          vid.currentTime = 0;
                        }}
                      />
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                        ▶ Video
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium truncate" title={item.name}>
                    {item.name}
                  </p>
                  {item.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(item.id, item.name)}
                    disabled={busy}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {busy && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Processing...
          </div>
        )}
      </CardContent>
    </Card>
  );
};