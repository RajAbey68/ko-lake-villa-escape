// Direct Image Upload - Creates bucket if needed
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function DirectImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [setupStatus, setSetupStatus] = useState<'checking' | 'ready' | 'needs-setup'>('checking');

  // Check and setup bucket on mount
  useState(() => {
    checkSetup();
  });

  const checkSetup = async () => {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const galleryBucket = buckets?.find(b => b.id === 'gallery');
      
      if (galleryBucket) {
        setSetupStatus('ready');
      } else {
        setSetupStatus('needs-setup');
        setError('Storage bucket not configured. Run COMPLETE_SETUP.sql in Supabase Dashboard.');
      }
    } catch (err: any) {
      setSetupStatus('needs-setup');
      setError('Cannot connect to storage: ' + err.message);
    }
  };

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

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(fileName);

        urls.push(publicUrl);

        // Also insert into database
        try {
          await supabase.from('gallery_images').insert({
            filename: file.name,
            title: file.name.replace(/\.[^/.]+$/, ''),
            description: 'Uploaded via direct upload',
            category: 'villa',
            media_type: 'image',
            object_path: publicUrl,
            is_featured: false,
            display_order: 0,
            analysis_status: 'completed'
          });
        } catch (dbErr) {
          console.warn('Database insert failed (not critical):', dbErr);
        }

      } catch (err: any) {
        setError(err.message);
        console.error('Upload error:', err);
        break;
      }
    }

    setUploadedUrls(prev => [...prev, ...urls]);
    setUploading(false);
  };

  if (setupStatus === 'checking') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #475569',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Checking setup...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#fff'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '900',
            marginBottom: '16px',
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Ko Lake Villa
          </h1>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#e2e8f0',
            marginBottom: '8px'
          }}>
            Image Upload
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>
            Upload your villa images to Supabase Storage
          </p>
        </div>

        {/* Status Banner */}
        {setupStatus === 'needs-setup' && (
          <div style={{
            background: '#7f1d1d',
            border: '2px solid #ef4444',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>
              ⚠️ Setup Required
            </h3>
            <p style={{ color: '#fecaca', marginBottom: '24px', lineHeight: '1.8' }}>
              {error}
            </p>
            <div style={{
              background: '#450a0a',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <h4 style={{ fontWeight: '700', marginBottom: '16px', color: '#fef2f2' }}>
                🔧 Quick Fix:
              </h4>
              <ol style={{ color: '#fecaca', lineHeight: '2', paddingLeft: '24px', margin: 0 }}>
                <li>Open <a href="https://supabase.com/dashboard" target="_blank" style={{ color: '#fca5a5', textDecoration: 'underline' }}>Supabase Dashboard</a></li>
                <li>Go to SQL Editor → New Query</li>
                <li>Copy & paste file: <code style={{ background: '#7f1d1d', padding: '4px 8px', borderRadius: '4px' }}>COMPLETE_SETUP.sql</code></li>
                <li>Click "Run"</li>
                <li>Refresh this page</li>
              </ol>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '16px 32px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '18px',
                width: '100%'
              }}
            >
              🔄 Check Again
            </button>
          </div>
        )}

        {/* Upload Area */}
        {setupStatus === 'ready' && (
          <>
            <div style={{
              border: '3px dashed #475569',
              borderRadius: '16px',
              padding: '64px 32px',
              textAlign: 'center',
              background: '#1e293b',
              marginBottom: '32px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.background = '#1e3a8a';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = '#475569';
              e.currentTarget.style.background = '#1e293b';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#475569';
              e.currentTarget.style.background = '#1e293b';
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                const input = document.getElementById('file-input') as HTMLInputElement;
                if (input) {
                  input.files = files;
                  input.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }
            }}>
              <div style={{ fontSize: '80px', marginBottom: '24px' }}>📸</div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: '#e2e8f0' }}>
                Drop images here or click to browse
              </h3>
              <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '16px' }}>
                JPG, PNG, WebP • Up to 50MB each
              </p>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              <label
                htmlFor="file-input"
                style={{
                  display: 'inline-block',
                  padding: '16px 48px',
                  background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                  color: '#fff',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontSize: '18px',
                  opacity: uploading ? 0.5 : 1
                }}
              >
                {uploading ? 'Uploading...' : 'Choose Files'}
              </label>
            </div>

            {/* Status */}
            {uploading && (
              <div style={{
                padding: '24px',
                background: '#1e3a8a',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                marginBottom: '32px',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'inline-block',
                  width: '32px',
                  height: '32px',
                  border: '4px solid #3b82f6',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '16px', color: '#93c5fd', fontWeight: '700', fontSize: '18px' }}>
                  Uploading images...
                </p>
              </div>
            )}

            {error && (
              <div style={{
                padding: '24px',
                background: '#7f1d1d',
                border: '2px solid #ef4444',
                borderRadius: '12px',
                marginBottom: '32px'
              }}>
                <h3 style={{ fontWeight: '700', marginBottom: '8px', fontSize: '18px' }}>
                  ❌ Upload Failed
                </h3>
                <p style={{ color: '#fecaca' }}>{error}</p>
              </div>
            )}

            {/* Uploaded Images */}
            {uploadedUrls.length > 0 && (
              <div style={{
                background: '#1e293b',
                borderRadius: '16px',
                padding: '32px',
                border: '2px solid #10b981'
              }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  marginBottom: '24px',
                  color: '#10b981'
                }}>
                  ✅ Uploaded Successfully ({uploadedUrls.length})
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px'
                }}>
                  {uploadedUrls.map((url, idx) => (
                    <div key={idx} style={{
                      border: '2px solid #334155',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#0f172a'
                    }}>
                      <img
                        src={url}
                        alt={`Upload ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '250px',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{ padding: '16px' }}>
                        <input
                          type="text"
                          value={url}
                          readOnly
                          onClick={(e) => {
                            e.currentTarget.select();
                            navigator.clipboard.writeText(url);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            background: '#1e293b',
                            color: '#94a3b8'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(uploadedUrls.join('\n'));
                    alert('All URLs copied!');
                  }}
                  style={{
                    padding: '16px 32px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '18px'
                  }}
                >
                  📋 Copy All URLs
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
