'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight,
  Wrench,
  Zap,
  Hammer,
  Car,
  HardHat,
  Sparkles,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { getTradeMedia } from '@/lib/tradeMedia';

interface ArtisanCardProps {
  artisan: any;
  priorityIndex?: number;
}

export function ArtisanCard({ artisan, priorityIndex = 0 }: ArtisanCardProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  
  const displayName = artisan.business_name || `${artisan.user?.first_name || 'Artisan'} ${artisan.user?.last_name || ''}`.trim();
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Get primary category/service
  const primaryService = artisan.services?.[0]?.subcategory?.category?.name || 
                         artisan.services?.[0]?.subcategory?.name || 
                         'General Trades';

  const media = getTradeMedia(primaryService);
  
  // Decide avatar: user custom avatar -> trade avatar -> fallback
  const avatarSrc = (!avatarError && artisan.user?.avatar_url) ? artisan.user.avatar_url : media.avatarUrl;
  const coverSrc = (!coverError && media.coverUrl) ? media.coverUrl : '/images/ghana_artisan_hero_bg.jpg';

  // Portfolio items (from DB or fallback from trade media)
  const portfolioItems = (artisan.portfolio && artisan.portfolio.length > 0)
    ? artisan.portfolio.slice(0, 3)
    : media.portfolio.slice(0, 3).map((url, idx) => ({ id: `sample-${idx}`, image_url: url, title: `${primaryService} work` }));

  // Pick trade icon
  const getTradeIcon = (trade: string) => {
    const t = trade.toLowerCase();
    if (t.includes('plumb')) return <Wrench className="w-3.5 h-3.5" />;
    if (t.includes('elect')) return <Zap className="w-3.5 h-3.5" />;
    if (t.includes('carpent') || t.includes('wood')) return <Hammer className="w-3.5 h-3.5" />;
    if (t.includes('auto') || t.includes('mechanic')) return <Car className="w-3.5 h-3.5" />;
    if (t.includes('mason') || t.includes('construct') || t.includes('tile')) return <HardHat className="w-3.5 h-3.5" />;
    if (t.includes('clean') || t.includes('paint')) return <Sparkles className="w-3.5 h-3.5" />;
    return <Briefcase className="w-3.5 h-3.5" />;
  };

  // Price estimate if services have pricing
  const minPrice = artisan.services?.find((s: any) => s.price_min)?.price_min;
  const maxPrice = artisan.services?.find((s: any) => s.price_max)?.price_max;

  return (
    <Link href={`/artisans/${artisan.id}`} className="block group h-full">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 border-border/70 hover:border-primary/60 bg-card rounded-none flex flex-col relative">
        <CardContent className="p-0 h-full flex flex-col">
          
          {/* Cover Area with Real Photo & Visual Treatment */}
          <div className="h-36 relative overflow-hidden bg-muted">
            <Image
              src={coverSrc}
              alt={`${primaryService} workspace`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priorityIndex < 4}
              onError={() => setCoverError(true)}
              className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/20" />

            {/* Top Bar Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              {/* Availability Beacon */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/90 backdrop-blur-md border border-border/80 text-[11px] font-semibold text-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Available Now
              </div>

              {/* Verified Badge */}
              {artisan.is_verified && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground text-[11px] font-bold tracking-wider uppercase shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </div>
              )}
            </div>

            {/* Trade Category Pill at bottom right of cover */}
            <div className="absolute bottom-2.5 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-background/95 backdrop-blur-sm border border-border text-xs font-semibold text-primary">
                {getTradeIcon(primaryService)}
                {primaryService}
              </span>
            </div>
          </div>

          {/* Overlapping Avatar Area */}
          <div className="px-5 pt-0 relative flex justify-between items-end -mt-9 z-20">
            <div className="relative w-18 h-18 rounded-none border-3 border-card bg-background overflow-hidden shadow-lg group-hover:border-primary transition-colors">
              <Image 
                src={avatarSrc} 
                alt={displayName} 
                fill
                sizes="72px"
                onError={() => setAvatarError(true)}
                className="object-cover object-top"
              />
            </div>

            {/* Star Rating Badge */}
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{artisan.average_rating > 0 ? artisan.average_rating.toFixed(1) : '5.0'}</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                ({artisan.review_count || 12})
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 pt-3 flex-1 flex flex-col">
            {/* Title & Name */}
            <div className="mb-2">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {displayName}
              </h3>
              {artisan.business_name && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                  {artisan.user?.first_name} {artisan.user?.last_name}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="line-clamp-1">{artisan.address || 'Greater Accra, Ghana'}</span>
            </div>

            {/* Bio */}
            {artisan.bio && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {artisan.bio}
              </p>
            )}

            {/* Visual Work Samples Strip */}
            <div className="mt-auto pt-3 border-t border-border/60">
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-2">
                <span className="flex items-center gap-1 uppercase tracking-wider text-[10px]">
                  <Camera className="w-3 h-3 text-primary" />
                  Recent Work
                </span>
                {minPrice && (
                  <span className="text-foreground font-bold">
                    From GHS {minPrice}
                  </span>
                )}
              </div>

              {/* 3 Photo Thumbnails */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {portfolioItems.map((item: any, i: number) => (
                  <div 
                    key={item.id || i} 
                    className="relative aspect-square overflow-hidden bg-muted border border-border/80 group-hover:border-primary/40 transition-colors"
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title || 'Work sample'}
                      fill
                      sizes="(max-width: 640px) 30vw, 100px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>

              {/* Sub-specialties */}
              <div className="flex flex-wrap gap-1 mb-4">
                {artisan.services?.slice(0, 2).map((service: any) => (
                  <span 
                    key={service.id} 
                    className="text-[10px] px-2 py-0.5 bg-muted/60 text-muted-foreground border border-border/60 font-medium"
                  >
                    {service.subcategory?.name || service.description}
                  </span>
                ))}
                {artisan.services && artisan.services.length > 2 && (
                  <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground font-medium">
                    +{artisan.services.length - 2} more
                  </span>
                )}
              </div>

              {/* Action Button Strip */}
              <div className="w-full py-2 bg-primary/5 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary text-primary transition-all duration-300 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
                <span>View Profile & Hire</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
