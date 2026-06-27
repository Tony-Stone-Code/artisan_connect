'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Star, ShieldCheck, Briefcase } from 'lucide-react';

interface ArtisanCardProps {
  artisan: any;
}

import { useState } from 'react';

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const displayName = artisan.business_name || `${artisan.user.first_name} ${artisan.user.last_name}`;
  const initials = artisan.business_name 
    ? artisan.business_name.substring(0, 2).toUpperCase()
    : `${artisan.user.first_name[0]}${artisan.user.last_name[0]}`;

  // Get primary category/service (just taking the first one for the badge)
  const primaryService = artisan.services?.[0]?.subcategory?.category?.name || 'Artisan';

  return (
    <Link href={`/artisans/${artisan.id}`} className="block group h-full">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 hover:border-primary/50 bg-card">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header/Cover Area */}
          <div className="h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative">
            <div className="absolute -bottom-10 left-6">
              {artisan.user.avatar_url && !imageError ? (
                <img 
                  src={artisan.user.avatar_url} 
                  alt={displayName} 
                  onError={() => setImageError(true)}
                  className="w-20 h-20 rounded-full border-4 border-card object-cover bg-muted"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-card bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  {initials}
                </div>
              )}
            </div>
            {artisan.is_verified && (
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur text-primary px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </div>
            )}
          </div>

          {/* Body */}
          <div className="pt-12 px-6 pb-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {displayName}
                </h3>
                {artisan.business_name && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {artisan.user.first_name} {artisan.user.last_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-4 h-4 fill-current" />
                  {artisan.average_rating > 0 ? artisan.average_rating.toFixed(1) : 'New'}
                </div>
                <span className="text-xs text-muted-foreground">
                  {artisan.review_count} {artisan.review_count === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">{artisan.address || 'Location not specified'}</span>
            </div>

            {artisan.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                {artisan.bio}
              </p>
            )}

            <div className="mt-auto pt-4 border-t border-border/50 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent">
                {primaryService}
              </Badge>
              {artisan.services?.slice(1, 3).map((service: any) => (
                <Badge key={service.id} variant="outline" className="text-muted-foreground border-border/50">
                  {service.subcategory?.name}
                </Badge>
              ))}
              {artisan.services?.length > 3 && (
                <Badge variant="outline" className="text-muted-foreground border-border/50">
                  +{artisan.services.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
