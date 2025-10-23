// Browser-based test of database and storage setup
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: string;
}

export default function TestSetup() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Gallery Table', status: 'pending', message: 'Testing...' },
    { name: 'Storage Bucket', status: 'pending', message: 'Testing...' },
    { name: 'Upload Permission', status: 'pending', message: 'Testing...' },
  ]);
  const [allPassed, setAllPassed] = useState(false);

  useEffect(() => {
    runTests();
  }, []);

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => i === index ? { ...test, ...updates } : test));
  };

  const runTests = async () => {
    // Test 1: Gallery Table
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('id, title')
        .limit(1);
      
      if (error) {
        updateTest(0, {
          status: 'error',
          message: 'Table not accessible',
          details: error.message
        });
      } else {
        updateTest(0, {
          status: 'success',
          message: `Table exists (${data?.length || 0} records)`,
          details: data && data.length > 0 ? `Sample: ${data[0].title}` : 'No records yet'
        });
      }
    } catch (err: any) {
      updateTest(0, {
        status: 'error',
        message: 'Connection failed',
        details: err.message
      });
    }

    // Test 2: Storage Bucket
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        updateTest(1, {
          status: 'error',
          message: 'Cannot list buckets',
          details: error.message
        });
      } else {
        const galleryBucket = buckets?.find(b => b.id === 'gallery');
        if (galleryBucket) {
          updateTest(1, {
            status: 'success',
            message: 'Gallery bucket exists',
            details: `Public: ${galleryBucket.public}`
          });
        } else {
          updateTest(1, {
            status: 'error',
            message: 'Gallery bucket not found',
            details: `Found buckets: ${buckets?.map(b => b.id).join(', ') || 'none'}`
          });
        }
      }
    } catch (err: any) {
      updateTest(1, {
        status: 'error',
        message: 'Storage check failed',
        details: err.message
      });
    }

    // Test 3: Upload Permission
    try {
      const testFileName = `test-${Date.now()}.txt`;
      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(testFileName, 'test', {
          contentType: 'text/plain',
          upsert: false
        });
      
      if (error) {
        updateTest(2, {
          status: 'error',
          message: 'Upload failed',
          details: error.message
        });
      } else {
        // Clean up
        await supabase.storage.from('gallery').remove([testFileName]);
        updateTest(2, {
          status: 'success',
          message: 'Upload works!',
          details: 'Permissions are correct'
        });
      }
    } catch (err: any) {
      updateTest(2, {
        status: 'error',
        message: 'Upload test failed',
        details: err.message
      });
    }

    // Check if all passed
    setTimeout(() => {
      setTests(current => {
        const passed = current.every(t => t.status === 'success');
        setAllPassed(passed);
        return current;
      });
    }, 100);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: '#fff',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          🧪 Database & Storage Test
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#94a3b8',
          marginBottom: '48px',
          fontSize: '18px'
        }}>
          Testing Ko Lake Villa setup...
        </p>

        {/* Test Results */}
        <div style={{ marginBottom: '48px' }}>
          {tests.map((test, idx) => (
            <div
              key={idx}
              style={{
                background: test.status === 'success' ? '#064e3b' : test.status === 'error' ? '#7f1d1d' : '#1e293b',
                border: `2px solid ${test.status === 'success' ? '#10b981' : test.status === 'error' ? '#ef4444' : '#475569'}`,
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px', marginRight: '12px' }}>
                  {test.status === 'pending' ? '⏳' : test.status === 'success' ? '✅' : '❌'}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
                  {test.name}
                </h3>
              </div>
              <p style={{ color: '#e2e8f0', marginBottom: '8px' }}>
                {test.message}
              </p>
              {test.details && (
                <p style={{
                  color: '#94a3b8',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  background: '#0f172a',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  margin: 0
                }}>
                  {test.details}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        {allPassed ? (
          <div style={{
            background: '#064e3b',
            border: '2px solid #10b981',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>
              All Tests Passed!
            </h2>
            <p style={{ color: '#d1fae5', marginBottom: '24px' }}>
              Your database and storage are properly configured.
            </p>
            <a
              href="/upload"
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                background: '#10b981',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: '700',
                textDecoration: 'none',
                fontSize: '18px'
              }}
            >
              Go to Upload Page →
            </a>
          </div>
        ) : (
          <div style={{
            background: '#7f1d1d',
            border: '2px solid #ef4444',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>
              ⚠️ Setup Required
            </h2>
            <p style={{ color: '#fecaca', marginBottom: '24px', lineHeight: '1.8' }}>
              Some tests failed. Run the setup SQL to fix:
            </p>
            <ol style={{ color: '#fecaca', lineHeight: '2', paddingLeft: '24px', marginBottom: '24px' }}>
              <li>Open Supabase Dashboard → SQL Editor</li>
              <li>Copy & paste file: <code style={{ background: '#450a0a', padding: '4px 8px', borderRadius: '4px' }}>COMPLETE_SETUP.sql</code></li>
              <li>Click "Run"</li>
              <li>Refresh this page</li>
            </ol>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🔄 Retest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
