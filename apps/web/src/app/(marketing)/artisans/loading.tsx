export default function ArtisansLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-9 w-64 bg-muted rounded-lg" />
          <div className="h-5 w-96 bg-muted/60 rounded" />
        </div>

        {/* Search & Filter Bar Skeleton */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="h-12 w-full bg-muted/50 rounded-lg" />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[1, 2, 3, 4, 5, 6].map((chip) => (
              <div key={chip} className="h-8 w-24 bg-muted rounded-full shrink-0" />
            ))}
          </div>
        </div>

        {/* Artisan Cards 6-Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((card) => (
            <div key={card} className="rounded-xl border border-border bg-card overflow-hidden shadow-sm space-y-4">
              {/* Cover/Avatar Header */}
              <div className="h-32 bg-muted/60 relative">
                <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-full bg-muted border-4 border-card" />
              </div>
              <div className="p-6 pt-4 space-y-3">
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 w-36 bg-muted rounded" />
                  <div className="h-5 w-16 bg-muted rounded-full" />
                </div>
                <div className="h-4 w-28 bg-muted/60 rounded" />
                <div className="h-12 w-full bg-muted/30 rounded" />
                <div className="pt-2 border-t border-border flex justify-between items-center">
                  <div className="h-4 w-24 bg-muted/60 rounded" />
                  <div className="h-8 w-24 bg-muted rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
