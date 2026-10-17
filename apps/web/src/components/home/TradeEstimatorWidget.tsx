'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  Zap, 
  Car, 
  Hammer, 
  HardHat, 
  Calculator, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ESTIMATOR_DATA = [
  {
    trade: 'Plumbing',
    icon: Wrench,
    jobs: [
      { name: 'Pipe Leak & Tap Repair', priceRange: 'GHS 120 – 250', duration: '1 – 3 hours', available: '14 artisans available' },
      { name: 'Water Tank & Booster Pump', priceRange: 'GHS 350 – 800', duration: 'Half day', available: '9 artisans available' },
      { name: 'Toilet & Bath Fixture Fit', priceRange: 'GHS 200 – 450', duration: '2 – 4 hours', available: '12 artisans available' },
    ],
  },
  {
    trade: 'Electrical',
    icon: Zap,
    jobs: [
      { name: 'Breaker & Conduit Wiring', priceRange: 'GHS 200 – 450', duration: '2 – 5 hours', available: '16 artisans available' },
      { name: 'Solar Inverter Setup', priceRange: 'GHS 600 – 1,500', duration: '1 – 2 days', available: '7 artisans available' },
      { name: 'Architectural Lighting & Fans', priceRange: 'GHS 150 – 350', duration: '2 – 3 hours', available: '15 artisans available' },
    ],
  },
  {
    trade: 'Auto Mechanics',
    icon: Car,
    jobs: [
      { name: 'OBD-II Computer Diagnostic', priceRange: 'GHS 150 – 300', duration: '45 mins', available: '11 mechanics available' },
      { name: 'Brake Pad Overhaul', priceRange: 'GHS 180 – 400', duration: '1 – 2 hours', available: '13 mechanics available' },
      { name: 'Suspension & Shock Replacement', priceRange: 'GHS 300 – 750', duration: '3 – 5 hours', available: '8 mechanics available' },
    ],
  },
  {
    trade: 'Carpentry',
    icon: Hammer,
    jobs: [
      { name: 'Solid Hardwood Door Fit', priceRange: 'GHS 250 – 600', duration: 'Half day', available: '10 carpenters available' },
      { name: 'Custom Kitchen Cabinetry', priceRange: 'GHS 800 – 2,500', duration: '2 – 4 days', available: '6 carpenters available' },
      { name: 'Roof Truss & Wood Repair', priceRange: 'GHS 400 – 1,200', duration: '1 – 2 days', available: '8 carpenters available' },
    ],
  },
  {
    trade: 'Masonry & Tiling',
    icon: HardHat,
    jobs: [
      { name: 'Floor Porcelain Tiling (per room)', priceRange: 'GHS 350 – 900', duration: '1 – 2 days', available: '12 masons available' },
      { name: 'Compound Paving Blocks', priceRange: 'GHS 500 – 1,800', duration: '2 – 4 days', available: '7 masons available' },
      { name: 'Plastering & Wall Screeding', priceRange: 'GHS 250 – 600', duration: '1 day', available: '9 masons available' },
    ],
  },
];

export function TradeEstimatorWidget() {
  const [selectedTradeIdx, setSelectedTradeIdx] = useState(0);
  const [selectedJobIdx, setSelectedJobIdx] = useState(0);

  const currentTrade = ESTIMATOR_DATA[selectedTradeIdx];
  const currentJob = currentTrade.jobs[selectedJobIdx] || currentTrade.jobs[0];

  return (
    <div className="w-full max-w-5xl mx-auto bg-card border border-border/70 p-6 md:p-10 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6 mb-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
            <Calculator className="w-3.5 h-3.5" />
            Instant Estimator
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Estimate Service Cost in Ghana
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Transparent market rates with 100% escrow protection before you hire.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
          <ShieldCheck className="w-4 h-4" /> Fixed Escrow Guarantee
        </div>
      </div>

      {/* Trade Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-8">
        {ESTIMATOR_DATA.map((t, idx) => {
          const Icon = t.icon;
          const isSelected = selectedTradeIdx === idx;
          return (
            <button
              key={t.trade}
              type="button"
              onClick={() => {
                setSelectedTradeIdx(idx);
                setSelectedJobIdx(0);
              }}
              className={`p-3 border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                isSelected 
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm' 
                  : 'border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold truncate">{t.trade}</span>
            </button>
          );
        })}
      </div>

      {/* Specific Job Options */}
      <div className="grid md:grid-cols-12 gap-8 items-center">
        {/* Left: Job Selection List */}
        <div className="md:col-span-7 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Select Service Type:
          </p>
          <div className="space-y-2">
            {currentTrade.jobs.map((job, idx) => {
              const isSelected = selectedJobIdx === idx;
              return (
                <button
                  key={job.name}
                  type="button"
                  onClick={() => setSelectedJobIdx(idx)}
                  className={`w-full text-left p-3.5 border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-primary/80 bg-primary/5 text-foreground shadow-sm font-bold'
                      : 'border-border/60 bg-card hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  <span className="text-sm">{job.name}</span>
                  <span className="text-xs font-semibold text-primary shrink-0 ml-2">
                    {job.priceRange}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Instant Estimate Breakdown Card */}
        <div className="md:col-span-5 bg-muted/40 border border-border/70 p-6 space-y-5">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Estimated Escrow Range
            </span>
            <p className="text-3xl font-black tracking-tight text-foreground text-primary">
              {currentJob.priceRange}
            </p>
          </div>

          <div className="space-y-2.5 border-t border-border/60 pt-4 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Completion Time
              </span>
              <span className="font-semibold text-foreground">{currentJob.duration}</span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified Artisans
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {currentJob.available}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" /> Payment Protection
              </span>
              <span className="font-semibold text-foreground">100% Escrow</span>
            </div>
          </div>

          <Link 
            href={`/artisans?q=${encodeURIComponent(currentTrade.trade)}`}
            className="block w-full pt-1"
          >
            <Button className="w-full h-11 rounded-none font-bold uppercase tracking-wider text-xs shadow-md cursor-pointer">
              Book {currentTrade.trade} Artisan <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
