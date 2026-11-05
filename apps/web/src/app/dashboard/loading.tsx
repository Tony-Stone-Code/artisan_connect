export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-muted rounded-lg" />
          <div className="h-4 w-72 bg-muted/60 rounded" />
        </div>
        <div className="h-10 w-36 bg-muted rounded-lg" />
      </div>

      {/* Metrics 4-Card Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-8 w-8 rounded-lg bg-muted" />
            </div>
            <div className="h-8 w-20 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted/60 rounded" />
          </div>
        ))}
      </div>

      {/* Main Content Sections Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Activity Feed */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted/60 rounded" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((row) => (
              <div key={row} className="p-4 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-muted rounded" />
                  <div className="h-3 w-36 bg-muted/60 rounded" />
                </div>
                <div className="h-7 w-20 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((btn) => (
              <div key={btn} className="h-12 w-full rounded-lg bg-muted/40 border border-border/40" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
