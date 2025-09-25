import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { RefreshCw, Mail, Phone } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

export const AdminContactSubmissions = () => {
  const { data: submissions = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-contact-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactSubmission[];
    },
  });

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading contact submissions: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Contact Submissions
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
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
                  <TableHead>Contact</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <p className="font-medium">{submission.name}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          <a 
                            href={`mailto:${submission.email}`}
                            className="text-primary hover:underline"
                          >
                            {submission.email}
                          </a>
                        </div>
                        {submission.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            <a 
                              href={`tel:${submission.phone}`}
                              className="text-primary hover:underline"
                            >
                              {submission.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-3">{submission.message}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {format(new Date(submission.created_at), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(submission.created_at), 'HH:mm')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`mailto:${submission.email}?subject=Re: Your inquiry&body=Dear ${submission.name},%0D%0A%0D%0AThank you for contacting Ko Lake Villa.%0D%0A%0D%0A`)}
                        >
                          <Mail className="h-4 w-4" />
                          Reply
                        </Button>
                        {submission.phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`tel:${submission.phone}`)}
                          >
                            <Phone className="h-4 w-4" />
                            Call
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {submissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No contact submissions yet
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};