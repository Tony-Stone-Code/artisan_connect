import { Suspense } from 'react';
import { getArtisans } from '@/app/actions/artisans';
import { ArtisanCard } from '@/components/artisans/ArtisanCard';
import { ArtisanSearch } from '@/components/artisans/ArtisanSearch';
import { ViewToggle } from '@/components/artisans/ViewToggle';
import ArtisanMap from '@/components/map/ArtisanMap';
import { SearchX } from 'lucide-react';

export const metadata = {
  title: 'Find Artisans | ArtisanConnect',
  description: 'Discover verified, skilled tradespeople near you. Search by trade, location, or rating.',
};

async function ArtisanGrid({ query, view }: { query?: string, view?: string }) {
  const artisans = await getArtisans(query);

  if (view === 'map') {
    return (
      <div className="px-4 md:px-6 max-w-7xl mx-auto pb-24">
        <ArtisanMap artisans={artisans} />
      </div>
    );
  }

  if (artisans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="rounded-full bg-muted/50 p-6 mb-6">
          <SearchX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-3">No artisans found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {query 
            ? `We couldn't find any artisans matching "${query}". Try adjusting your search terms or browsing all categories.`
            : "There are currently no verified artisans available. Check back later!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-6 max-w-7xl mx-auto pb-24">
      {artisans.map((artisan) => (
        <ArtisanCard key={artisan.id} artisan={artisan} />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-6 max-w-7xl mx-auto pb-24">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-80 rounded-xl bg-muted/40 animate-pulse border border-border/50">
          <div className="h-24 bg-muted/60 rounded-t-xl mb-10" />
          <div className="px-6 space-y-4">
            <div className="h-6 bg-muted/60 rounded w-3/4" />
            <div className="h-4 bg-muted/60 rounded w-1/2" />
            <div className="h-16 bg-muted/60 rounded w-full mt-6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ArtisansPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string, view?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q;
  const view = resolvedParams.view || 'grid';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 via-background to-background pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
              Directory
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Find Trusted <span className="text-primary">Artisans</span> Near You
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              Browse our curated directory of verified professionals, read real customer reviews, and book services with confidence.
            </p>
            <Suspense fallback={<div className="h-14 w-full max-w-lg mx-auto bg-muted/40 animate-pulse rounded-full" />}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                <div className="flex-1 w-full">
                  <ArtisanSearch />
                </div>
                <ViewToggle />
              </div>
            </Suspense>
          </div>
        </div>
      </section>

      {/* Directory Grid / Map */}
      <Suspense fallback={<GridSkeleton />} key={`${query}-${view}`}>
        <ArtisanGrid query={query} view={view} />
      </Suspense>
    </div>
  );
}

import { Badge } from '@/components/ui/Badge';
