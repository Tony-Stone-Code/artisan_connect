import { getPlatformMetrics } from '@/app/actions/admin';
import { Users, ShieldCheck, CheckCircle2, AlertOctagon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const metrics = await getPlatformMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Platform Metrics</h2>
        <p className="text-muted-foreground">Overview of ArtisanConnect platform activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{metrics.totalUsers.toLocaleString()}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-medium text-muted-foreground">Verified Artisans</h3>
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{metrics.verifiedArtisans.toLocaleString()}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-medium text-muted-foreground">Completed Jobs</h3>
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{metrics.completedJobs.toLocaleString()}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-medium text-muted-foreground">Pending Reports</h3>
          </div>
          <div className="mt-2 text-3xl font-bold text-rose-500">{metrics.pendingReports.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
