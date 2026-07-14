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
      <Button 
        variant={currentView === 'auto' || currentView === 'explore' ? 'primary' : 'ghost'} 
        size="sm" 
        onClick={() => setView('explore')}
        className="gap-2 px-4 md:hidden"
      >
        <PlaySquare className="w-4 h-4" />
        Explore
      </Button>
      <Button 
        variant={currentView === 'explore' ? 'primary' : 'ghost'} 
        size="sm" 
        onClick={() => setView('explore')}
        className="gap-2 px-4 hidden md:flex"
      >
        <PlaySquare className="w-4 h-4" />
        Explore
      </Button>
      <Button 
        variant={currentView === 'auto' || currentView === 'grid' ? 'primary' : 'ghost'} 
        size="sm" 
        onClick={() => setView('grid')}
        className="gap-2 px-4 hidden md:flex"
      >
        <Grid className="w-4 h-4" />
        Grid
      </Button>
      <Button 
        variant={currentView === 'grid' ? 'primary' : 'ghost'} 
        size="sm" 
        onClick={() => setView('grid')}
        className="gap-2 px-4 md:hidden"
      >
        <Grid className="w-4 h-4" />
        Grid
      </Button>
      <Button 
        variant={currentView === 'map' ? 'primary' : 'ghost'} 
        size="sm" 
        onClick={() => setView('map')}
        className="gap-2 px-4"
      >
        <Map className="w-4 h-4" />
        Map
      </Button>
    </div>
  );
}
