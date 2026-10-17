'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  Wrench, 
  Zap, 
  Hammer, 
  Car, 
  HardHat, 
  Check, 
  Layers
} from 'lucide-react';

interface TradeCategory {
  id: string;
  name: string;
  query: string;
  icon: any;
  countLabel?: string;
}

const TRADE_CATEGORIES: TradeCategory[] = [
  { id: 'all', name: 'All Trades', query: '', icon: Layers },
  { id: 'plumbing', name: 'Plumbing', query: 'Plumbing', icon: Wrench },
  { id: 'electrical', name: 'Electrical', query: 'Electrical', icon: Zap },
  { id: 'carpentry', name: 'Carpentry', query: 'Carpentry', icon: Hammer },
  { id: 'mechanics', name: 'Auto Mechanics', query: 'Mechanic', icon: Car },
  { id: 'masonry', name: 'Masonry & Tiling', query: 'Masonry', icon: HardHat },
  { id: 'cleaning', name: 'Cleaning & Care', query: 'Cleaning', icon: Sparkles },
];

export function TradeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('q') || '';
  const currentView = searchParams.get('view') || 'grid';

  const handleSelect = (categoryQuery: string) => {
    const params = new URLSearchParams();
    if (categoryQuery) {
      params.set('q', categoryQuery);
    }
    if (currentView && currentView !== 'grid') {
      params.set('view', currentView);
    }
    const queryString = params.toString();
    router.push(queryString ? `/artisans?${queryString}` : '/artisans');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:justify-center">
        {TRADE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = cat.query === '' 
            ? currentQuery === ''
            : currentQuery.toLowerCase().includes(cat.query.toLowerCase());

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.query)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 border rounded-none ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-102'
                  : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border/80 hover:border-primary/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
              <span>{cat.name}</span>
              {isActive && <Check className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
