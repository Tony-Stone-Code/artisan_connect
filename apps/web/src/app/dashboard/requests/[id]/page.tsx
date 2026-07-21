import { getRequestById, updateRequestStatus } from '@/app/actions/requests';
import { getMessages } from '@/app/actions/messages';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChatBox } from '@/components/chat/ChatBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { QuoteForm } from '@/components/requests/QuoteForm';
import { QuoteList } from '@/components/requests/QuoteList';
import { EscrowReleaseButton } from '@/components/requests/EscrowReleaseButton';
import { DisputeForm } from '@/components/requests/DisputeForm';
import { Star, AlertTriangle } from 'lucide-react';

export default async function RequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch data
  const { request, error: reqError } = await getRequestById(id);
  const { messages, error: msgError } = await getMessages(id);

  if (reqError || !request) {
    return (
      <div className="p-8 text-center text-destructive">
        <h2 className="text-xl font-bold">Error</h2>
        <p>{reqError || 'Failed to load request details.'}</p>
      </div>
    );
  }

  const isCustomer = request.customer.user.supabase_uid === user.id;
  const isArtisan = request.artisan.user.supabase_uid === user.id;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'ACCEPTED': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'IN_PROGRESS': return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      case 'COMPLETED': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case 'DISPUTED': return 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/50';
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  // Helper forms for status updates
  const StatusButton = ({ status, label, variant = "default" }: { status: any, label: string, variant?: any }) => (
    <form action={async () => {
      'use server';
      await updateRequestStatus(id, status);
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
                    <QuoteForm requestId={request.id} />
                    <StatusButton status="CANCELLED" label="Decline" variant="destructive" />
                  </>
                )}
                
                {isArtisan && request.status === 'QUOTED' && (
                  <StatusButton status="IN_PROGRESS" label="Start Work" />
                )}

                {isArtisan && request.status === 'IN_PROGRESS' && (
                  <StatusButton status="COMPLETED" label="Mark Completed" variant="outline" />
                )}

                {isCustomer && (request.status === 'PENDING' || request.status === 'QUOTED') && (
                  <StatusButton status="CANCELLED" label="Cancel Request" variant="destructive" />
                )}
                
                {isCustomer && (request.status === 'IN_PROGRESS' || request.status === 'COMPLETED') && (
                  <DisputeForm requestId={request.id} />
                )}
              </div>
            </div>

            {request.status === 'DISPUTED' && (
              <div className="mt-4 p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Request is under Dispute</p>
                  <p className="text-sm mt-1">This request has been disputed and the escrow funds are frozen. An admin will review the chat logs and make a final ruling.</p>
                </div>
              </div>
            )}

            {/* Quotes Section */}
            {request.quotes && request.quotes.length > 0 && (
              <QuoteList 
                quotes={request.quotes.map((q: any) => ({
                  ...q,
                  amount: Number(q.amount),
                  escrow: q.escrow ? {
                    ...q.escrow,
                    amount: Number(q.escrow.amount),
                    fee_amount: Number(q.escrow.fee_amount)
                  } : null
                }))} 
                isCustomer={isCustomer} 
              />
            )}
            
          </CardContent>
        </Card>

        {/* Escrow Release Section */}
        {isCustomer && request.status === 'COMPLETED' && request.quotes.some((q: any) => q.status === 'ACCEPTED' && q.escrow?.status === 'HELD') && (
          <EscrowReleaseButton requestId={request.id} />
        )}

        {/* Review Section */}
        {isCustomer && request.status === 'COMPLETED' && (
          <div className="mt-6">
            {request.review ? (
              <Card className="border-border/50 shadow-sm bg-muted/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Your Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-5 h-5 ${
                          star <= request.review!.rating 
                            ? 'fill-amber-500 text-amber-500' 
                            : 'fill-muted text-muted'
                        }`} 
                      />
                    ))}
                  </div>
                  {request.review.comment ? (
                    <p className="text-sm text-muted-foreground italic">"{request.review.comment}"</p>
                  ) : (
                    <p className="text-sm text-muted-foreground/60 italic">No comment provided.</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <ReviewForm 
                requestId={request.id} 
                artisanName={`${request.artisan.user.first_name} ${request.artisan.user.last_name}`} 
              />
            )}
          </div>
        )}
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
