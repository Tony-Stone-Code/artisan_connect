import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { getReports, updateReportStatus } from '@/app/actions/reports';
import { Button } from '@/components/ui/Button';

export default async function AdminReportsPage() {
  let reports: any[] = [];
  try {
    reports = await getReports();
  } catch (error) {
    console.error('Error fetching reports:', error);
  }

  const openReports = reports.filter(r => r.status === 'OPEN' || r.status === 'IN_REVIEW');
  const resolvedReports = reports.filter(r => r.status === 'RESOLVED' || r.status === 'DISMISSED');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">System Reports & Disputes</h2>
        <p className="text-muted-foreground">View and resolve user reports regarding artisans and service requests.</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Open Reports ({openReports.length})</CardTitle>
          <CardDescription>Issues requiring administrator attention.</CardDescription>
        </CardHeader>
        <CardContent>
          {openReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-border border-dashed rounded-lg bg-muted/20">
              <svg className="h-12 w-12 text-emerald-500 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">All Clear</h3>
              <p className="text-muted-foreground max-w-sm">
                There are no active disputes or user reports requiring moderation at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {openReports.map(report => (
                <div key={report.id} className="p-4 rounded-lg border bg-card shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-foreground">
                        Target: {report.target_type} ({report.target_id})
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Reported by: {report.reporter?.first_name} {report.reporter?.last_name} ({report.reporter?.email})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Date: {new Date(report.created_at).toLocaleString()}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded text-xs font-semibold uppercase">
                      {report.status}
                    </span>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md border text-sm text-foreground">
                    <span className="font-semibold block mb-1">Reason provided:</span>
                    {report.reason}
                  </div>
                  <div className="flex gap-2 justify-end">
                    <form action={async () => {
                      'use server';
                      await updateReportStatus(report.id, 'DISMISSED');
                    }}>
                      <Button variant="outline" size="sm">Dismiss</Button>
                    </form>
                    
                    {report.target_type === 'USER' && (
                      <form action={async () => {
                        'use server';
                        await updateReportStatus(report.id, 'RESOLVED', true);
                      }}>
                        <Button variant="destructive" size="sm">Suspend Artisan & Resolve</Button>
                      </form>
                    )}
                    
                    <form action={async () => {
                      'use server';
                      await updateReportStatus(report.id, 'RESOLVED');
                    }}>
                      <Button size="sm">Mark as Resolved</Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {resolvedReports.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
            <CardDescription>Recently resolved or dismissed reports.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4 opacity-75">
              {resolvedReports.slice(0, 5).map(report => (
                <div key={report.id} className="p-3 rounded-lg border bg-muted/30 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-semibold">{report.target_type} ({report.target_id})</div>
                    <div className="text-xs text-muted-foreground">{new Date(report.created_at).toLocaleDateString()}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${report.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-500'}`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
