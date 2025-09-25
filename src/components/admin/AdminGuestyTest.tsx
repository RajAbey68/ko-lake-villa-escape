import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  endpoint?: string;
  status?: number;
  message?: string;
}

export function AdminGuestyTest() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState('properties');
  const [testType, setTestType] = useState<'auth' | 'api'>('auth');

  const commonEndpoints = [
    { value: 'properties', label: 'Properties' },
    { value: 'listings', label: 'Listings' },
    { value: 'reservations', label: 'Reservations' },
    { value: 'calendar', label: 'Calendar' },
    { value: 'accounts', label: 'Accounts' }
  ];

  const runTest = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('guesty-api-test', {
        body: {
          endpoint: selectedEndpoint,
          test_type: testType
        }
      });

      if (error) {
        setTestResult({
          success: false,
          error: error.message
        });
      } else {
        setTestResult(data);
      }
    } catch (err) {
      setTestResult({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Guesty API Test
          <Badge variant="outline">Live Testing</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Test Type</label>
            <Select value={testType} onValueChange={(value: 'auth' | 'api') => setTestType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auth">Authentication Only</SelectItem>
                <SelectItem value="api">Full API Test</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {testType === 'api' && (
            <div>
              <label className="text-sm font-medium">API Endpoint</label>
              <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {commonEndpoints.map((endpoint) => (
                    <SelectItem key={endpoint.value} value={endpoint.value}>
                      {endpoint.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button 
          onClick={runTest} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Run Test'
          )}
        </Button>

        {testResult && (
          <Card className={testResult.success ? 'border-green-200' : 'border-red-200'}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {testResult.success ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Test Successful
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    Test Failed
                  </>
                )}
                {testResult.status && (
                  <Badge variant={testResult.success ? 'default' : 'destructive'}>
                    {testResult.status}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testResult.message && (
                <p className="text-sm text-green-600 mb-3">{testResult.message}</p>
              )}
              
              {testResult.error && (
                <p className="text-sm text-red-600 mb-3">{testResult.error}</p>
              )}

              {testResult.endpoint && (
                <p className="text-sm text-muted-foreground mb-3">
                  Endpoint: <code>{testResult.endpoint}</code>
                </p>
              )}

              {testResult.data && (
                <div>
                  <p className="text-sm font-medium mb-2">Response Data:</p>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-96">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Authentication Test:</strong> Verifies your Guesty API credentials</p>
          <p><strong>Full API Test:</strong> Tests authentication + API endpoint access</p>
          <p><strong>Note:</strong> Ensure your Guesty account has the necessary permissions for the selected endpoints</p>
        </div>
      </CardContent>
    </Card>
  );
}