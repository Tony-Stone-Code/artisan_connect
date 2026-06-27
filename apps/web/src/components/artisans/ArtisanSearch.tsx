'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search } from 'lucide-react';

export function ArtisanSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(() => {
      if (query.trim()) {
        router.push(`/artisans?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push('/artisans');
      }
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-2xl mx-auto gap-2">
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
  );
}
