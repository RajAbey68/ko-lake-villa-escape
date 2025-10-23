// Simple Image Upload - No Database Required
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function SimpleImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from('gallery')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        urls.push(publicUrl);
      } catch (err: any) {
        setError(err.message);
        console.error('Upload error:', err);
      }
    }

    setUploadedUrls(prev => [...prev, ...urls]);
    setUploading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          marginBottom: '8px',
          color: '#0f172a'
        }}>
          Upload Villa Images
        </h1>
        <p style={{
          color: '#64748b',
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Upload images directly to Supabase Storage. No database required.
        </p>

        {/* Upload Area */}
        <div style={{
          border: '2px dashed #cbd5e1',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          background: '#f8fafc',
          marginBottom: '32px',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = '#d26a1b';
          e.currentTarget.style.background = '#fef3c7';
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.borderColor = '#cbd5e1';
          e.currentTarget.style.background = '#f8fafc';
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = '#cbd5e1';
          e.currentTarget.style.background = '#f8fafc';
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            const input = document.getElementById('file-input') as HTMLInputElement;
            if (input) {
              input.files = files;
              input.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📸</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
            Drop images here or click to browse
          </h3>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            JPG, PNG, WebP up to 10MB each
          </p>
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
          <label
            htmlFor="file-input"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: '#d26a1b',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#b85a15'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#d26a1b'}
          >
            Choose Files
          </label>
        </div>

        {/* Status */}
        {uploading && (
          <div style={{
            padding: '16px',
            background: '#dbeafe',
            border: '1px solid #3b82f6',
            borderRadius: '8px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              border: '3px solid #3b82f6',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '8px', color: '#1e40af', fontWeight: '600' }}>
              Uploading...
            </p>
          </div>
        )}

        {error && (
          <div style={{
            padding: '16px',
            background: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            marginBottom: '24px',
            color: '#991b1b'
          }}>
            ❌ {error}
          </div>
        )}

        {/* Uploaded Images */}
        {uploadedUrls.length > 0 && (
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#0f172a'
            }}>
              ✅ Uploaded Images ({uploadedUrls.length})
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {uploadedUrls.map((url, idx) => (
                <div key={idx} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#fff'
                }}>
                  <img
                    src={url}
                    alt={`Upload ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: '12px' }}>
                    <input
                      type="text"
                      value={url}
                      readOnly
                      onClick={(e) => e.currentTarget.select()}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        background: '#f8fafc'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Copy All URLs */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(uploadedUrls.join('\n'));
                alert('All URLs copied to clipboard!');
              }}
              style={{
                padding: '12px 24px',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              📋 Copy All URLs
            </button>
          </div>
        )}

        {/* Instructions */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '12px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#166534' }}>
            📝 How to Use
          </h3>
          <ol style={{ color: '#166534', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Upload your villa images using the area above</li>
            <li>Images are stored in Supabase Storage (gallery bucket)</li>
            <li>Copy the URLs and use them anywhere in your app</li>
            <li>No database setup required - images are publicly accessible</li>
          </ol>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
