'use client';

import { ArtisanExploreItem } from './ArtisanExploreItem';

interface ArtisanExploreProps {
  artisans: any[];
}

export function ArtisanExplore({ artisans }: ArtisanExploreProps) {
  if (artisans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 bg-background">
        <h2 className="text-2xl font-bold mb-3">No artisans found</h2>
        <p className="text-muted-foreground">Try adjusting your filters or search.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-5rem)] w-full bg-black overflow-y-scroll snap-y snap-mandatory touch-pan-y scrollbar-hide">
      {artisans.map((artisan) => (
        <ArtisanExploreItem key={artisan.id} artisan={artisan} />
      ))}
    </div>
  );
}
