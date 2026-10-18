'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getRequests } from '@/app/actions/requests';
import { ReportButton } from '@/components/ui/ReportButton';
import { 
  FileText, 
  PlusCircle, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  Loader2
} from 'lucide-react';

interface RequestItem {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string | Date;
  artisan?: {
    user?: {
      first_name?: string;
      last_name?: string;
    };
  } | null;
  customer?: {
    user?: {
      first_name?: string;
      last_name?: string;
    };
  } | null;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const result = await getRequests();
        if (result.error === 'Unauthorized') {
          window.location.href = '/login';
          return;
        }
        if (result.error) throw new Error(result.error);
        setRequests(result.requests || []);
      } catch (error) {
        console.error('Failed to fetch requests', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">Pending Quote</span>;
      case 'QUOTED':
        return <span className="px-2.5 py-1 text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25">Quoted</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/25">In Progress</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">Completed</span>;
      case 'DISPUTED':
        return <span className="px-2.5 py-1 text-xs font-bold bg-destructive/10 text-destructive border border-destructive/25">Disputed</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 text-xs font-bold bg-muted text-muted-foreground border border-border">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold bg-muted text-muted-foreground border border-border">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Job Requests
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your service requests, review incoming proposals, and track escrow status.
          </p>
        </div>
        <Link href="/dashboard/requests/new">
          <Button className="rounded-none px-5 text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer">
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Create New Request
          </Button>
        </Link>
      </div>

      <Card className="rounded-none border border-border/70 shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base font-bold uppercase tracking-wide">
            All Service Requests
          </CardTitle>
          <CardDescription className="text-xs">
            {requests.length > 0 
              ? `You have ${requests.length} active or past request(s).` 
              : 'You currently have no active requests on record.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                Loading requests...
              </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 p-6">
              <FileText className="w-12 h-12 text-muted-foreground/30" />
              <h3 className="text-base font-bold text-foreground">No requests found</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Get started by creating a new service request to hire a verified artisan for your project.
              </p>
              <Link href="/dashboard/requests/new" className="pt-2">
                <Button variant="outline" className="rounded-none text-xs font-bold cursor-pointer">
                  Create First Request
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {requests.map((req) => (
                <div 
                  key={req.id} 
                  className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="font-bold text-sm text-foreground">
                        {req.title}
                      </h4>
                      {getStatusBadge(req.status)}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl leading-relaxed">
                      {req.description}
                    </p>
                    <div className="text-[11px] text-muted-foreground pt-1 flex items-center gap-2">
                      <span>Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>Participant: <strong>{req.artisan?.user ? `${req.artisan.user.first_name} ${req.artisan.user.last_name}` : req.customer?.user ? `${req.customer.user.first_name} ${req.customer.user.last_name}` : 'Assigned Artisan'}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                    <ReportButton targetId={req.id} targetType="REQUEST" />
                    <Link href={`/dashboard/requests/${req.id}`}>
                      <Button variant="outline" size="sm" className="rounded-none text-xs font-bold cursor-pointer">
                        View Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
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
