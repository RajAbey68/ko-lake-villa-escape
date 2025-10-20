import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const AdminAIAssistant = () => {
  const [testMessage, setTestMessage] = useState('Tell me about Ko Lake Villa');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const testAIAssistant = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    setSuccess(false);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: testMessage,
          context: 'general'
        }
      });

      if (functionError) throw functionError;

      if (data?.choices?.[0]?.message?.content) {
        setResponse(data.choices[0].message.content);
        setSuccess(true);
      } else {
        throw new Error('Invalid response format from AI assistant');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to AI assistant');
      console.error('AI Assistant Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSEOContent = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    setSuccess(false);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: `Generate SEO-optimized content for Ko Lake Villa:
          - Meta title (60 chars)
          - Meta description (155 chars)
          - 3 key selling points
          Focus on: lakeside, surf, digital nomads, families, luxury`,
          context: 'general'
        }
      });

      if (functionError) throw functionError;

      if (data?.choices?.[0]?.message?.content) {
        setResponse(data.choices[0].message.content);
        setSuccess(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate SEO content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Assistant Test Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Test Message</label>
            <Textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter a message to test the AI assistant..."
              rows={3}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={testAIAssistant}
              disabled={loading || !testMessage.trim()}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Test AI Assistant
                </>
              )}
            </Button>

            <Button
              onClick={generateSEOContent}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate SEO Content
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                AI Assistant is working correctly!
              </AlertDescription>
            </Alert>
          )}

          {response && (
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">AI Response:</label>
              <div className="p-4 bg-slate-50 rounded-lg border">
                <pre className="whitespace-pre-wrap text-sm">{response}</pre>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">API Status</h4>
            <div className="text-sm space-y-1">
              <p>• <strong>Model:</strong> gpt-4o-mini</p>
              <p>• <strong>Endpoint:</strong> Supabase Edge Function</p>
              <p>• <strong>Key:</strong> Stored in APP_CONFIG_JSON</p>
              <p>• <strong>Cost:</strong> ~$0.01 per 1000 tokens</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Future AI Features (Planned)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 mt-0.5 text-purple-500" />
              <span><strong>Gallery SEO:</strong> Auto-generate titles, descriptions, and alt text for uploaded images</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 mt-0.5 text-purple-500" />
              <span><strong>Room Descriptions:</strong> Generate compelling room descriptions from features</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 mt-0.5 text-purple-500" />
              <span><strong>Blog Posts:</strong> Auto-generate SEO-optimized blog content</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 mt-0.5 text-purple-500" />
              <span><strong>Multilingual:</strong> Translate content to German, French, Japanese, etc.</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 mt-0.5 text-purple-500" />
              <span><strong>Guest Reviews:</strong> Generate professional responses to reviews</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
