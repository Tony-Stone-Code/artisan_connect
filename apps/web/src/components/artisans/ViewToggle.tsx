'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Map, List, Grid } from 'lucide-react';

export function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'auto';

  const setView = (view: 'grid' | 'map' | 'auto') => {
    const params = new URLSearchParams(searchParams.toString());
    if (view === 'auto' || view === 'grid') {
      params.delete('view');
    } else {
      params.set('view', view);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-none border-2 border-border shadow-none">
      {/* Grid / List View */}
      <Button 
        variant={currentView === 'auto' || currentView === 'grid' ? 'primary' : 'ghost'} 
        size="sm" 
        onClick={() => setView('grid')}
        className="gap-2 px-4 rounded-none shadow-none"
      >
        <List className="w-4 h-4 md:hidden" />
        <Grid className="w-4 h-4 hidden md:block" />
        <span className="hidden md:block">Grid</span>
        <span className="md:hidden">List</span>
      </Button>

      {/* Map View */}
      <Button 
        variant={currentView === 'map' ? 'primary' : 'ghost'} 
        size="sm" 
        onClick={() => setView('map')}
        className="gap-2 px-4 rounded-none shadow-none"
      >
        <Map className="w-4 h-4" />
        <span className="sr-only sm:not-sr-only">Map</span>
      </Button>
    </div>
  );
}
