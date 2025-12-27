import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { 
  Loader2, 
  LogOut, 
  Mail, 
  FileText, 
  Users, 
  Briefcase,
  ArrowLeft,
  RefreshCw,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type SubmissionStatus = Database['public']['Enums']['submission_status'];
type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];
type QuoteRequest = Database['public']['Tables']['quote_requests']['Row'];

const statusColors: Record<SubmissionStatus, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  read: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  replied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const AdminDashboard: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('contacts');

  // Fetch contact submissions
  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['admin', 'contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactSubmission[];
    },
    enabled: isAdmin,
  });

  // Fetch quote requests
  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ['admin', 'quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as QuoteRequest[];
    },
    enabled: isAdmin,
  });

  // Fetch counts for dashboard stats
  const { data: projectsCount } = useQuery({
    queryKey: ['admin', 'projects-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
    enabled: isAdmin,
  });

  const { data: teamCount } = useQuery({
    queryKey: ['admin', 'team-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
    enabled: isAdmin,
  });

  const { data: testimonialCount } = useQuery({
    queryKey: ['admin', 'testimonials-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('testimonials')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
    enabled: isAdmin,
  });

  // Update contact status mutation
  const updateContactStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: SubmissionStatus; notes?: string }) => {
      const updates: Partial<ContactSubmission> = { status };
      if (notes !== undefined) updates.admin_notes = notes;
      
      const { error } = await supabase
        .from('contact_submissions')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
      toast({ title: 'Status updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error updating status', description: error.message, variant: 'destructive' });
    },
  });

  // Update quote status mutation
  const updateQuoteStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: SubmissionStatus; notes?: string }) => {
      const updates: Partial<QuoteRequest> = { status };
      if (notes !== undefined) updates.admin_notes = notes;
      
      const { error } = await supabase
        .from('quote_requests')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quotes'] });
      toast({ title: 'Status updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error updating status', description: error.message, variant: 'destructive' });
    },
  });

  const handleLogout = async () => {
    await signOut();
    toast({ title: 'Logged out successfully' });
  };

  const newContacts = contacts?.filter(c => c.status === 'new').length || 0;
  const newQuotes = quotes?.filter(q => q.status === 'new').length || 0;

  return (
    <>
      <SEO 
        title="Admin Dashboard"
        description="Manage your Buckeye DataCom submissions and content"
        noIndex={true}
      />
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="bg-background border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Site</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{contacts?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Contacts</p>
                  </div>
                  {newContacts > 0 && (
                    <Badge className="ml-auto bg-blue-500">{newContacts} new</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{quotes?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Quotes</p>
                  </div>
                  {newQuotes > 0 && (
                    <Badge className="ml-auto bg-green-500">{newQuotes} new</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{projectsCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                    <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{teamCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Team Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for submissions */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Submissions
                {newContacts > 0 && <Badge variant="secondary" className="ml-1">{newContacts}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Quote Requests
                {newQuotes > 0 && <Badge variant="secondary" className="ml-1">{newQuotes}</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Contact Submissions</CardTitle>
                      <CardDescription>Manage incoming contact form messages</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] })}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {contactsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : !contacts?.length ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No contact submissions yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contacts.map((contact) => (
                            <TableRow key={contact.id}>
                              <TableCell className="whitespace-nowrap">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(contact.created_at), 'MMM d, yyyy')}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{contact.name}</TableCell>
                              <TableCell>
                                <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                                  {contact.email}
                                </a>
                              </TableCell>
                              <TableCell>{contact.company || '-'}</TableCell>
                              <TableCell className="max-w-xs">
                                <p className="truncate" title={contact.message}>
                                  {contact.message}
                                </p>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={contact.status}
                                  onValueChange={(value: SubmissionStatus) => 
                                    updateContactStatus.mutate({ id: contact.id, status: value })
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="read">Read</SelectItem>
                                    <SelectItem value="replied">Replied</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Textarea
                                  placeholder="Add notes..."
                                  defaultValue={contact.admin_notes || ''}
                                  className="min-w-[150px] h-16 text-xs"
                                  onBlur={(e) => {
                                    if (e.target.value !== (contact.admin_notes || '')) {
                                      updateContactStatus.mutate({ 
                                        id: contact.id, 
                                        status: contact.status,
                                        notes: e.target.value 
                                      });
                                    }
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Quote Requests</CardTitle>
                      <CardDescription>Manage fiber installation quote requests</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', 'quotes'] })}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {quotesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : !quotes?.length ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No quote requests yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Project Type</TableHead>
                            <TableHead>Size (ft)</TableHead>
                            <TableHead>Est. Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quotes.map((quote) => (
                            <TableRow key={quote.id}>
                              <TableCell className="whitespace-nowrap">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(quote.created_at), 'MMM d, yyyy')}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{quote.name || '-'}</TableCell>
                              <TableCell>
                                {quote.email ? (
                                  <a href={`mailto:${quote.email}`} className="text-primary hover:underline">
                                    {quote.email}
                                  </a>
                                ) : '-'}
                              </TableCell>
                              <TableCell>{quote.company || '-'}</TableCell>
                              <TableCell>{quote.project_type || '-'}</TableCell>
                              <TableCell>{quote.project_size?.toLocaleString() || '-'}</TableCell>
                              <TableCell>
                                {quote.estimated_price 
                                  ? `$${Number(quote.estimated_price).toLocaleString()}` 
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={quote.status}
                                  onValueChange={(value: SubmissionStatus) => 
                                    updateQuoteStatus.mutate({ id: quote.id, status: value })
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="read">Read</SelectItem>
                                    <SelectItem value="replied">Replied</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Textarea
                                  placeholder="Add notes..."
                                  defaultValue={quote.admin_notes || ''}
                                  className="min-w-[150px] h-16 text-xs"
                                  onBlur={(e) => {
                                    if (e.target.value !== (quote.admin_notes || '')) {
                                      updateQuoteStatus.mutate({ 
                                        id: quote.id, 
                                        status: quote.status,
                                        notes: e.target.value 
                                      });
                                    }
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
