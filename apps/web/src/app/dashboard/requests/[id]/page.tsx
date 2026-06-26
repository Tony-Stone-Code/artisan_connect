import { getRequestById, updateRequestStatus } from '@/app/actions/requests';
import { getMessages } from '@/app/actions/messages';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChatBox } from '@/components/chat/ChatBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function RequestDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch data
  const { request, error: reqError } = await getRequestById(params.id);
  const { messages, error: msgError } = await getMessages(params.id);

  if (reqError || !request) {
    return (
      <div className="p-8 text-center text-destructive">
        <h2 className="text-xl font-bold">Error</h2>
        <p>{reqError || 'Failed to load request details.'}</p>
      </div>
    );
  }

  const isCustomer = request.customer.user_id === user.id;
  const isArtisan = request.artisan.user_id === user.id;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'ACCEPTED': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'IN_PROGRESS': return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      case 'COMPLETED': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  // Helper forms for status updates
  const StatusButton = ({ status, label, variant = "default" }: { status: any, label: string, variant?: any }) => (
    <form action={async () => {
      'use server';
      await updateRequestStatus(params.id, status);
    }}>
      <Button variant={variant} size="sm" type="submit">{label}</Button>
    </form>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {/* Left Column: Request Details & Status */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-xl">{request.title}</CardTitle>
              <Badge className={getStatusColor(request.status)} variant="outline">
                {request.status.replace('_', ' ')}
              </Badge>
            </div>
            <CardDescription>
              {isCustomer 
                ? `Requested from ${request.artisan.user.first_name} ${request.artisan.user.last_name}`
                : `Requested by ${request.customer.user.first_name} ${request.customer.user.last_name}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-muted-foreground">Description</p>
              <p className="mt-1 whitespace-pre-wrap">{request.description}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Location</p>
              <p className="mt-1">{request.address}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Requested On</p>
              <p className="mt-1">{new Date(request.created_at).toLocaleDateString()}</p>
            </div>

            {/* Status Actions */}
            <div className="pt-4 border-t space-y-2">
              <p className="font-semibold text-muted-foreground mb-3">Actions</p>
              
              <div className="flex flex-wrap gap-2">
                {isArtisan && request.status === 'PENDING' && (
                  <>
                    <StatusButton status="ACCEPTED" label="Accept Request" />
                    <StatusButton status="CANCELLED" label="Decline" variant="destructive" />
                  </>
                )}
                
                {isArtisan && request.status === 'ACCEPTED' && (
                  <StatusButton status="IN_PROGRESS" label="Start Work" />
                )}

                {isArtisan && request.status === 'IN_PROGRESS' && (
                  <StatusButton status="COMPLETED" label="Mark Completed" variant="outline" />
                )}

                {isCustomer && (request.status === 'PENDING' || request.status === 'ACCEPTED') && (
                  <StatusButton status="CANCELLED" label="Cancel Request" variant="destructive" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Chat Interface */}
      <div className="lg:col-span-2">
        <ChatBox 
          requestId={request.id} 
          currentUserId={user.id} 
          initialMessages={messages || []} 
        />
      </div>
    </div>
  );
}
