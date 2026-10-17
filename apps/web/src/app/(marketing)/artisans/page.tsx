import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { getArtisans } from '@/app/actions/artisans';
import { ArtisanCard } from '@/components/artisans/ArtisanCard';
import { ArtisanSearch } from '@/components/artisans/ArtisanSearch';
import { ViewToggle } from '@/components/artisans/ViewToggle';
import { TradeFilters } from '@/components/artisans/TradeFilters';
import { DirectoryBackdrop } from '@/components/artisans/DirectoryBackdrop';
import { 
  SearchX, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Zap, 
  RotateCcw,
  Users,
  ChevronDown,
  Award,
  CheckCircle2
} from 'lucide-react';

export const metadata = {
  title: 'Find Artisans | ArtisanConnect',
  description: 'Discover verified, skilled Black Ghanaian tradespeople near you. Browse real work samples, compare ratings, and book with escrow protection.',
};

// Lazy load Mapbox GL component to prevent heavy initial bundle
const ArtisanMap = dynamic(() => import('@/components/map/ArtisanMap'), {
  loading: () => (
    <div className="h-[600px] w-full bg-muted/40 border border-border animate-pulse flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <span className="text-sm text-muted-foreground font-medium">Loading interactive artisan map...</span>
    </div>
  ),
});

async function ArtisanGrid({ query, view }: { query?: string, view?: string }) {
  const artisans = await getArtisans(query);

  if (view === 'map') {
    return (
      <div className="px-4 md:px-6 max-w-7xl mx-auto pb-24 relative z-10">
        <ArtisanMap artisans={artisans} />
      </div>
    );
  }

  if (artisans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4 max-w-lg mx-auto relative z-10">
        <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-6 animate-bounce">
          <SearchX className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold uppercase tracking-wide mb-2">No Artisans Found</h2>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          {query 
            ? `We couldn't find any tradespeople matching "${query}". Try selecting a category pill or clear your search.`
            : "There are currently no verified artisans matching this criteria."}
        </p>
        <Link 
          href="/artisans"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Search & View All</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24 relative z-10">
      {/* Results Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-border/70 backdrop-blur-sm bg-background/50 px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground">
            Showing <span className="text-primary">{artisans.length}</span> Verified Ghanaian {artisans.length === 1 ? 'Master Artisan' : 'Master Artisans'}
          </span>
          {query && (
            <span className="text-xs text-muted-foreground">
              matching &ldquo;<strong className="text-foreground">{query}</strong>&rdquo;
            </span>
          )}
        </div>
        
        {query && (
          <Link 
            href="/artisans"
            className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            Clear filter
          </Link>
        )}
      </div>

      {/* Responsive Grid with Staggered Visual Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artisans.map((artisan: any, index: number) => (
          <div 
            key={artisan.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(index * 60, 500)}ms` }}
          >
            <ArtisanCard artisan={artisan} priorityIndex={index} />
          </div>
        ))}
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24 relative z-10">
      <div className="h-6 bg-muted/60 rounded w-48 mb-6 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-96 bg-card border border-border/80 animate-pulse flex flex-col">
            <div className="h-36 bg-muted/70" />
            <div className="p-5 space-y-3 flex-1">
              <div className="h-5 bg-muted/80 w-3/4" />
              <div className="h-3 bg-muted/60 w-1/2" />
              <div className="h-10 bg-muted/50 w-full mt-4" />
              <div className="grid grid-cols-3 gap-1.5 pt-4">
                <div className="aspect-square bg-muted/60" />
                <div className="aspect-square bg-muted/60" />
                <div className="aspect-square bg-muted/60" />
              </div>
            </div>
          </div>
        ))}
      </div>
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
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Dynamic Ambient Background & Scroll Effects */}
      <DirectoryBackdrop />

      {/* Atmospheric Hero with Authentic Ghanaian Workshop Background */}
      <section className="relative min-h-[480px] md:min-h-[520px] pt-16 pb-16 overflow-hidden border-b border-border flex items-center justify-center">
        {/* Background Image of Authentic Master Workshop in Ghana */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/ghana_artisan_hero_bg.jpg"
            alt="Artisan workshop in Ghana"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-102 transition-transform duration-1000 ease-out"
          />
          {/* Deep Cinematic Overlay & Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-background/90 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(#2563eb18_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto border-2 border-border/80 bg-card/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-2xl animate-fade-in-up">
            
            {/* Top Tagline */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Ghanaian Skilled Trades
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-3">
              Hire Trusted <span className="text-primary">Artisans</span> in Ghana
            </h1>
            
            <div className="w-16 h-1 bg-primary mx-auto mb-4" />
            
            <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
              Connect directly with verified Black Ghanaian plumbers, electricians, carpenters, and mechanics. Review authentic work portfolios with complete escrow protection.
            </p>

            {/* Search Input & View Toggle */}
            <Suspense fallback={<div className="h-12 w-full max-w-lg mx-auto bg-muted/40 animate-pulse border border-border" />}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
                <div className="flex-1 w-full">
                  <ArtisanSearch />
                </div>
                <div className="shrink-0">
                  <ViewToggle />
                </div>
              </div>

              {/* Trade Category Quick Filter Chips */}
              <TradeFilters />
            </Suspense>

            {/* Platform Guarantees Banner */}
            <div className="mt-8 pt-6 border-t border-border/80 grid grid-cols-3 gap-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="hidden sm:inline">Ghana Card Verified</span>
                <span className="sm:hidden">Verified</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground border-x border-border/80">
                <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>100% Escrow Protected</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Direct Quotes</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Directory Content Section */}
      <main className="pt-10 relative">
        <Suspense fallback={<GridSkeleton />} key={`${query}-${view}`}>
          <ArtisanGrid query={query} view={view} />
        </Suspense>
      </main>
    </div>
  );
}
