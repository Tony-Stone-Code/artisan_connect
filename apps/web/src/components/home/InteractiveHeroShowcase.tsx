'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Star, 
  Wrench, 
  Zap, 
  Car, 
  CheckCircle2, 
  MapPin, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const FEATURED_ARTISANS = [
  {
    id: 'plumber-kwame',
    name: 'Kwame Mensah',
    trade: 'Master Plumber',
    location: 'Osu & Cantonments, Accra',
    rating: 4.9,
    reviews: 28,
    jobsCompleted: 84,
    avatar: '/images/artisan_plumber_1782323020851.png',
    icon: Wrench,
    specialty: 'Leak detection, pressure booster pumps, bathroom fitting',
    status: 'Available Today',
    query: 'Plumbing',
  },
  {
    id: 'electrician-ama',
    name: 'Ama Osei',
    trade: 'Solar & Electrical Engineer',
    location: 'East Legon & Airport, Accra',
    rating: 5.0,
    reviews: 34,
    jobsCompleted: 112,
    avatar: '/images/artisan_electrician_ghana.jpg',
    icon: Zap,
    specialty: 'Conduit wiring, solar hybrid inverters, load balancing',
    status: 'Available Today',
    query: 'Electrical',
  },
  {
    id: 'mechanic-yaw',
    name: 'Yaw Adom',
    trade: 'Auto Diagnostics & Engine Care',
    location: 'Spintex & Tema Corridor',
    rating: 4.8,
    reviews: 42,
    jobsCompleted: 96,
    avatar: '/images/artisan_mechanic_ghana.jpg',
    icon: Car,
    specialty: 'Computer diagnostics, brake systems, transmission service',
    status: 'On Call',
    query: 'Mechanic',
  },
];

export function InteractiveHeroShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeArtisan = FEATURED_ARTISANS[activeIdx];
  const Icon = activeArtisan.icon;

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Background Frame with Workshop Image */}
      <div className="relative w-full aspect-[4/3] border border-border/70 shadow-2xl overflow-hidden bg-card">
        <Image
          src="/images/ghana_artisan_hero_bg.jpg"
          alt="Authentic Ghanaian master artisan workshop in Accra"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 520px"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

        {/* Top Trust Ribbon */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Artisan Roster</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/90 text-primary-foreground font-semibold text-[11px]">
            <Lock className="w-3 h-3" /> Escrow Safe
          </div>
        </div>

        {/* Bottom Spotlight Summary on Hero Photo */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-[11px] font-bold uppercase tracking-wider text-accent mb-0.5">
            Verified Ghanaian Craftsmanship
          </p>
          <p className="text-xs sm:text-sm font-medium text-white/90 leading-snug">
            Every professional holds a biometric Ghana Card with verified background and workshop location.
          </p>
        </div>
      </div>

      {/* Interactive Artisan Card Overlap */}
      <div className="mt-4 bg-card border border-border/70 p-4 shadow-xl space-y-3">
        {/* Tab switchers */}
        <div className="flex items-center gap-1 border-b border-border/60 pb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1 shrink-0">
            Featured:
          </span>
          {FEATURED_ARTISANS.map((artisan, idx) => (
            <button
              key={artisan.id}
              onClick={() => setActiveIdx(idx)}
              className={`px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {artisan.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Active Artisan Detail */}
        <div className="flex items-start gap-3.5 pt-1">
          <div className="relative w-14 h-14 bg-muted border border-border/80 shrink-0 overflow-hidden">
            <Image
              src={activeArtisan.avatar}
              alt={activeArtisan.name}
              fill
              sizes="56px"
              className="object-cover object-top"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate">
                  {activeArtisan.name}
                </h4>
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" title="Ghana Card Verified" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                {activeArtisan.status}
              </span>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
              <Icon className="w-3.5 h-3.5 text-primary" /> {activeArtisan.trade}
            </p>

            <div className="flex items-center gap-3 text-xs pt-0.5">
              <span className="text-amber-500 font-bold flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-current" /> {activeArtisan.rating} ({activeArtisan.reviews})
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-[11px]">
                {activeArtisan.jobsCompleted} jobs completed
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
          {activeArtisan.specialty}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3 text-muted-foreground" /> {activeArtisan.location}
          </span>
          <Link
            href={`/artisans?q=${encodeURIComponent(activeArtisan.query)}`}
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Hire with Escrow <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
