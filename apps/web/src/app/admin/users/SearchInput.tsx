'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Suspense } from 'react';

function SearchInputInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }
      router.push(`?${params.toString()}`);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, searchParams]);

  return (
    <input 
      type="text" 
      placeholder="Search by name or email..." 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="rounded-md border border-input bg-background px-3 py-1.5 text-sm w-64 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  );
}

export function SearchInput() {
  return (
    <Suspense fallback={<div className="h-9 w-64 rounded-md border border-input bg-background/50 animate-pulse" />}>
      <SearchInputInner />
    </Suspense>
  );
}
