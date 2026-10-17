'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const SEARCH_HINTS = [
  'E.g., leaking pipe in Osu...',
  'E.g., AC wiring in East Legon...',
  'E.g., car brake service in Spintex...',
  'E.g., hardwood security door in Tema...',
  'E.g., compound floor tiling in Dansoman...',
];

export function HeroSearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % SEARCH_HINTS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/artisans?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/artisans');
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/artisans?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="w-full max-w-xl space-y-3">
      <form 
        onSubmit={handleSubmit}
        className="w-full bg-card border border-border/70 p-1.5 shadow-lg flex flex-col sm:flex-row items-center gap-2 transition-colors focus-within:border-primary/60"
      >
        <div className="flex items-center gap-2.5 px-3 py-2 flex-1 w-full">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={SEARCH_HINTS[hintIndex]}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            aria-label="Search artisans by trade or location"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full sm:w-auto h-11 px-6 rounded-none font-bold uppercase tracking-wider text-xs shadow-md shrink-0 cursor-pointer"
        >
          Find Artisan <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </form>

      {/* Popular quick tags */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider mr-1">
          Popular:
        </span>
        {[
          { label: 'Pipe Leaks', query: 'Plumbing' },
          { label: 'AC & Solar', query: 'Electrical' },
          { label: 'Auto Care', query: 'Auto Mechanics' },
          { label: 'Wood Doors', query: 'Carpentry' },
          { label: 'Tiling', query: 'Masonry' },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleTagClick(item.query)}
            className="px-2.5 py-1 bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-border/60 text-muted-foreground text-[11px] font-medium transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
