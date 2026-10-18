'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Wallet, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Search, 
  PlusCircle, 
  FileText, 
  Wrench, 
  ChevronRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getDashboardOverview, type DashboardData } from '@/app/actions/dashboard';

export default function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getDashboardOverview();
        if (res.data) {
          setData(res.data);
        }
      } catch (e) {
        console.error('Failed to load dashboard:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  const isArtisan = data?.role === 'ARTISAN';
  const user = data?.user;
  const stats = data?.stats;
  const recent = data?.recentRequests || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Pending Quote</span>;
      case 'QUOTED':
        return <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Quote Sent</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">In Progress</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Completed</span>;
      case 'DISPUTED':
        return <span className="px-2 py-0.5 text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20">Under Dispute</span>;
      default:
        return <span className="px-2 py-0.5 text-[11px] font-bold bg-muted text-muted-foreground border border-border">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome & Role Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card border border-border/70 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {user?.name || 'there'}!
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/25">
              {isArtisan ? 'Artisan Professional' : 'Customer Account'}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            {isArtisan 
              ? 'Manage your job requests, submitted quotes, and escrow earnings across Ghana.'
              : 'Hire verified artisans, track active projects, and inspect completed jobs with escrow safety.'
            }
          </p>
        </div>

        {/* Verification Status Pill */}
        {isArtisan && (
          <div className="shrink-0">
            {data?.verificationStatus === 'VERIFIED' ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" /> Ghana Card Verified
              </div>
            ) : (
              <Link href="/dashboard/identity" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-colors">
                <AlertCircle className="w-4 h-4" /> Identity Verification Needed
              </Link>
            )}
          </div>
        )}
      </div>

      {/* 4 Primary Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1 */}
        <Card className="rounded-none border border-border/70 bg-card shadow-sm hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {stats?.stat1Label || 'Total Requests'}
            </CardTitle>
            <Briefcase className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {stats?.stat1Value ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.stat1Sub}
            </p>
          </CardContent>
        </Card>

        {/* Stat 2 */}
        <Card className="rounded-none border border-border/70 bg-card shadow-sm hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {stats?.stat2Label || 'Active Jobs'}
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {stats?.stat2Value ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.stat2Sub}
            </p>
          </CardContent>
        </Card>

        {/* Stat 3 */}
        <Card className="rounded-none border border-border/70 bg-card shadow-sm hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {stats?.stat3Label || 'Completed'}
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {stats?.stat3Value ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.stat3Sub}
            </p>
          </CardContent>
        </Card>

        {/* Stat 4 */}
        <Card className="rounded-none border border-border/70 bg-card shadow-sm hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {stats?.stat4Label || 'Escrow Volume'}
            </CardTitle>
            <Wallet className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-primary">
              {stats?.stat4Value || 'GHS 0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.stat4Sub}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 border border-border/60">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2">
          Quick Actions:
        </span>

        {isArtisan ? (
          <>
            <Link href="/dashboard/requests">
              <Button size="sm" variant="outline" className="rounded-none text-xs font-bold cursor-pointer">
                <FileText className="w-3.5 h-3.5 mr-1.5" /> View Incoming Requests
              </Button>
            </Link>
            <Link href="/dashboard/identity">
              <Button size="sm" variant="outline" className="rounded-none text-xs font-bold cursor-pointer">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-primary" /> Ghana Card Verification
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button size="sm" variant="outline" className="rounded-none text-xs font-bold cursor-pointer">
                <Wrench className="w-3.5 h-3.5 mr-1.5" /> Profile &amp; Services
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/artisans">
              <Button size="sm" className="rounded-none text-xs font-bold cursor-pointer">
                <Search className="w-3.5 h-3.5 mr-1.5" /> Find Verified Artisans
              </Button>
            </Link>
            <Link href="/dashboard/requests/new">
              <Button size="sm" variant="outline" className="rounded-none text-xs font-bold cursor-pointer">
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Post Service Request
              </Button>
            </Link>
            <Link href="/services">
              <Button size="sm" variant="ghost" className="rounded-none text-xs font-bold cursor-pointer">
                Browse Service Rates <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8 rounded-none border border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
            <div>
              <CardTitle className="text-base font-bold uppercase tracking-wide">
                Recent Service Requests
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {recent.length > 0 ? `Showing your latest ${recent.length} request(s).` : 'No requests on record.'}
              </p>
            </div>
            <Link href="/dashboard/requests" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                <FileText className="w-10 h-10 text-muted-foreground/40" />
                <p className="text-sm font-semibold text-foreground">No recent requests found</p>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {isArtisan 
                    ? 'When customers in your area request your skills, they will appear here.'
                    : 'Get started by browsing verified plumbers, electricians, carpenters, or mechanics in Accra.'}
                </p>
                {!isArtisan && (
                  <Link href="/artisans">
                    <Button size="sm" className="rounded-none text-xs font-bold mt-2 cursor-pointer">
                      Browse Directory
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recent.map((req) => (
                  <Link 
                    key={req.id} 
                    href={`/dashboard/requests/${req.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/40 transition-colors gap-3 block group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {req.title}
                        </h4>
                        {getStatusBadge(req.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isArtisan ? 'From Customer:' : 'Assigned Artisan:'}{' '}
                        <strong className="text-foreground">{req.counterpartName}</strong> · {req.trade}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 text-xs shrink-0">
                      {req.amount && (
                        <span className="font-black text-foreground">
                          GHS {req.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                      <span className="text-muted-foreground text-[11px]">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Info Box */}
        <Card className="lg:col-span-4 rounded-none border border-border/70 shadow-sm bg-muted/20">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Escrow Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs text-muted-foreground leading-relaxed">
            <div className="space-y-1">
              <p className="font-bold text-foreground">How your payments are guarded</p>
              <p>
                When a quote is accepted, funds are held securely in escrow. Payments are only released to the artisan once the job is inspected and approved.
              </p>
            </div>

            <div className="p-3 bg-card border border-border/60 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Fair Resolution Protocol</span>
              </div>
              <p className="text-[11px]">
                In the rare case of an issue, AI mediation and admin review step in to ensure unbiased fairness.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/terms" className="text-primary hover:underline font-bold inline-flex items-center gap-1">
                View Escrow Terms <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
