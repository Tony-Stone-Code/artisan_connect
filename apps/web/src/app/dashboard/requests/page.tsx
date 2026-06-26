'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getRequests } from '@/app/actions/requests';
import { ReportButton } from '@/components/ui/ReportButton';

interface Request {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  artisan: {
    first_name: string;
    last_name: string;
  };
  customer: {
    first_name: string;
    last_name: string;
  };
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const result = await getRequests();
        if (result.error) throw new Error(result.error);
        setRequests(result.requests as any);
      } catch (error) {
        console.error('Failed to fetch requests', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Requests</h2>
          <p className="text-muted-foreground">Manage your job requests and proposals.</p>
        </div>
        <Link href="/dashboard/requests/new">
          <Button>Create New Request</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Requests</CardTitle>
          <CardDescription>
            {requests.length > 0 
              ? `You have ${requests.length} active request(s).` 
              : 'You currently have no active requests.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
              <svg className="h-12 w-12 text-muted-foreground mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">No requests found</h3>
              <p className="text-muted-foreground max-w-sm mb-4">
                Get started by creating a new request to find an artisan for your project.
              </p>
              <Link href="/dashboard/requests/new">
                <Button variant="outline">Create Request</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y border rounded-md">
              {requests.map(req => (
                <div key={req.id} className="p-4 flex justify-between items-center hover:bg-muted/30 transition-colors">
                  <div>
                    <h4 className="font-semibold">{req.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{req.description}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(req.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium border border-primary/20">
                      {req.status.replace('_', ' ')}
                    </span>
                    <div className="flex gap-2">
                      <ReportButton targetId={req.id} targetType="REQUEST" />
                      <Link href={`/dashboard/requests/${req.id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
