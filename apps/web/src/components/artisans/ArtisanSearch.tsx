'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search } from 'lucide-react';

export function ArtisanSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isPending, startTransition] = useTransition();

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Load recent searches on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('recent_searches');
      if (cached) {
        setRecentSearches(JSON.parse(cached));
      }
    } catch (e) {
      console.error('Failed to parse recent searches', e);
    }
  }, []);

  const handleSearch = (e?: React.FormEvent, explicitQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = explicitQuery !== undefined ? explicitQuery : query;
    
    startTransition(() => {
      if (searchQuery.trim()) {
        // Update recent searches in local storage
        const trimmed = searchQuery.trim();
        const updatedSearches = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
        
        router.push(`/artisans?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push('/artisans');
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
      <form onSubmit={(e) => handleSearch(e)} className="flex w-full gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            name="q"
            placeholder="Search by name, trade, or describe your problem..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 h-12 text-base rounded-full border-border/60 bg-background/50 backdrop-blur-sm focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm hover:shadow-md"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            size="lg" 
            isLoading={isPending}
            className="rounded-full px-4 sm:px-8 h-12 shadow-md hover:shadow-lg transition-all"
          >
            <span className="hidden sm:inline">{isPending ? 'Searching...' : 'Search'}</span>
            <span className="sm:hidden"><Search className="w-5 h-5" /></span>
          </Button>
        </div>
      </form>
      
      {/* Recent Searches Row */}
      {recentSearches.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-2 animate-in fade-in slide-in-from-top-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Recent:</span>
          {recentSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setQuery(term);
                handleSearch(undefined, term);
              }}
              className="text-xs bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-full transition-colors border shadow-sm truncate max-w-[150px]"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
