'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Map, Grid } from 'lucide-react';

export function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'grid';

  const setView = (view: 'grid' | 'map') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
      <Button 
        variant={currentView === 'grid' ? 'default' : 'ghost'} 
        size="sm" 
        onClick={() => setView('grid')}
        className="gap-2 px-4"
      >
        <Grid className="w-4 h-4" />
        Grid
      </Button>
      <Button 
        variant={currentView === 'map' ? 'default' : 'ghost'} 
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
