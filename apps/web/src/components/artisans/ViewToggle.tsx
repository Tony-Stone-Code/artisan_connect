'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Map, Grid, PlaySquare } from 'lucide-react';

export function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'auto';

  const setView = (view: 'grid' | 'map' | 'explore' | 'auto') => {
    const params = new URLSearchParams(searchParams.toString());
    if (view === 'auto') {
      params.delete('view');
    } else {
      params.set('view', view);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
      {/* Mobile Explore */}
      <span className="md:hidden">
        <Button 
          variant={currentView === 'auto' || currentView === 'explore' ? 'primary' : 'ghost'} 
          size="sm" 
          onClick={() => setView('explore')}
          className="gap-2 px-3"
        >
          <PlaySquare className="w-4 h-4" />
          <span className="sr-only sm:not-sr-only">Explore</span>
        </Button>
      </span>

      {/* Desktop Explore */}
      <span className="hidden md:inline-flex">
        <Button 
          variant={currentView === 'explore' ? 'primary' : 'ghost'} 
          size="sm" 
          onClick={() => setView('explore')}
          className="gap-2 px-4"
        >
          <PlaySquare className="w-4 h-4" />
          Explore
        </Button>
      </span>

      {/* Desktop Grid */}
      <span className="hidden md:inline-flex">
        <Button 
          variant={currentView === 'auto' || currentView === 'grid' ? 'primary' : 'ghost'} 
          size="sm" 
          onClick={() => setView('grid')}
          className="gap-2 px-4"
        >
          <Grid className="w-4 h-4" />
          Grid
        </Button>
      </span>

      {/* Mobile Grid */}
      <span className="md:hidden">
        <Button 
          variant={currentView === 'grid' ? 'primary' : 'ghost'} 
          size="sm" 
          onClick={() => setView('grid')}
          className="gap-2 px-3"
        >
          <Grid className="w-4 h-4" />
          <span className="sr-only sm:not-sr-only">Grid</span>
        </Button>
      </span>
      <Button 
        variant={currentView === 'map' ? 'primary' : 'ghost'} 
        size="sm" 
        onClick={() => setView('map')}
        className="gap-2 px-4"
      >
        <Map className="w-4 h-4" />
        <span className="sr-only sm:not-sr-only">Map</span>
      </Button>
    </div>
  );
}
