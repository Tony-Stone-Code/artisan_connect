'use client';

import { useState, useEffect } from 'react';
import { getPendingIdentities, approveIdentity, rejectIdentity } from '@/app/actions/identity';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface PendingIdentity {
  id: string;
  ghana_card_no: string;
  card_image_url: string;
  selfie_url: string;
  artisan: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
    }
  }
}

export default function AdminVerificationPage() {
  const [identities, setIdentities] = useState<PendingIdentity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionNotes, setRejectionNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setIsLoading(true);
      const result = await getPendingIdentities();
      if (result.error) throw new Error(result.error);
      setIdentities(result.identities as any);
    } catch (err) {
      console.error('Failed to fetch pending identities', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm('Are you sure you want to approve this identity?')) return;
    try {
      const result = await approveIdentity(id);
      if (result.error) throw new Error(result.error);
      setIdentities(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Approval failed', err);
      alert('Failed to approve identity.');
    }
  };

  const handleReject = async (id: string) => {
    const notes = rejectionNotes[id];
    if (!notes) {
      alert('Please provide a reason for rejection.');
      return;
    }

    if (!window.confirm('Are you sure you want to reject this identity?')) return;

    try {
      const result = await rejectIdentity(id, notes);
      if (result.error) throw new Error(result.error);
      setIdentities(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Rejection failed', err);
      alert('Failed to reject identity.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Identity Verifications</h2>
        <p className="text-muted-foreground">Review and approve artisan identity submissions.</p>
      </div>

      {identities.length === 0 ? (
        <Card className="bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <svg className="w-12 h-12 text-muted-foreground opacity-50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="text-lg font-medium">All Caught Up!</h3>
            <p className="text-muted-foreground text-sm">There are no pending identity verifications at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {identities.map((identity) => (
            <Card key={identity.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {identity.artisan.user.first_name} {identity.artisan.user.last_name}
                    </CardTitle>
                    <CardDescription>{identity.artisan.user.email}</CardDescription>
                  </div>
                  <div className="bg-primary/10 text-primary font-mono px-3 py-1 rounded text-sm font-medium">
                    {identity.ghana_card_no}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">ID Card (Front)</p>
                    <div className="aspect-video rounded-md overflow-hidden bg-muted border flex items-center justify-center">
                      <img 
                        src={identity.card_image_url} 
                        alt="ID Card" 
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<p class="text-xs text-muted-foreground">Image missing</p>';
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Selfie</p>
                    <div className="aspect-square md:aspect-video rounded-md overflow-hidden bg-muted border flex items-center justify-center">
                      <img 
                        src={identity.selfie_url} 
                        alt="Selfie" 
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<p class="text-xs text-muted-foreground">Image missing</p>';
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-end bg-muted/10 p-4 rounded-md border border-dashed">
                  <div className="flex-1 w-full space-y-2">
                    <label className="text-sm font-medium text-red-600 dark:text-red-400">Rejection Reason (if rejecting)</label>
                    <Input 
                      placeholder="e.g. Image is blurry, ID number does not match" 
                      value={rejectionNotes[identity.id] || ''}
                      onChange={(e) => setRejectionNotes(prev => ({ ...prev, [identity.id]: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none" onClick={() => handleReject(identity.id)}>
                      Reject
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none" onClick={() => handleApprove(identity.id)}>
                      Approve Identity
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
