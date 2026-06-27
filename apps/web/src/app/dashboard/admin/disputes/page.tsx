import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DisputeResolutionPanel } from '@/components/admin/DisputeResolutionPanel';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default async function AdminDisputesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const admin = await prisma.adminProfile.findUnique({
    where: { user_id: user.id }
  });

  if (!admin) redirect('/dashboard'); // Not an admin

  // Fetch all reports of type REQUEST
  const reports = await prisma.report.findMany({
    where: { target_type: 'REQUEST' },
    orderBy: { created_at: 'desc' },
    include: {
      reporter: true,
      admin: { include: { user: true } }
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dispute Management</h1>
      </div>
      
      <p className="text-muted-foreground">
        Review frozen escrow payments, generate AI summaries of the chat logs, and force release or refund funds.
      </p>

      <div className="space-y-6 mt-8">
        {reports.length === 0 && (
          <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
            No active disputes found!
          </div>
        )}

        {reports.map((report) => (
          <div key={report.id} className="border rounded-lg bg-card overflow-hidden shadow-sm">
            <div className="bg-muted/50 p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  Dispute #{report.id.slice(0, 8)}
                  <Badge variant={report.status === 'OPEN' ? 'destructive' : 'outline'}>
                    {report.status}
                  </Badge>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Filed by {report.reporter.first_name} {report.reporter.last_name} on {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
              <Link href={`/dashboard/requests/${report.target_id}`} target="_blank" className="text-primary hover:underline text-sm font-medium">
                View Original Request ↗
              </Link>
            </div>
            
            <div className="p-4">
              <DisputeResolutionPanel 
                reportId={report.id}
                reason={report.reason}
                aiSummary={report.ai_summary}
                status={report.status}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
