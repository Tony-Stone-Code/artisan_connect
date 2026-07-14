'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, Share2, ShieldCheck, MapPin, MessageCircle, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ArtisanExploreItemProps {
  artisan: any;
}

export function ArtisanExploreItem({ artisan }: ArtisanExploreItemProps) {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const displayName = artisan.business_name || `${artisan.user.first_name} ${artisan.user.last_name}`;
  const initials = artisan.business_name 
    ? artisan.business_name.substring(0, 2).toUpperCase()
    : `${artisan.user.first_name[0]}${artisan.user.last_name[0]}`;

  const primaryService = artisan.services?.[0]?.subcategory?.name || 'Artisan';
  const category = artisan.services?.[0]?.subcategory?.category?.name;

  // Use avatar or a gradient if missing
  const bgImage = artisan.user.avatar_url && !imageError ? artisan.user.avatar_url : null;
  const fallbackGradients = [
    'from-blue-900 to-indigo-900',
    'from-emerald-900 to-teal-900',
    'from-orange-900 to-red-900',
    'from-purple-900 to-pink-900'
  ];
  const gradientIndex = artisan.id.charCodeAt(0) % fallbackGradients.length;
  const fallbackGradient = fallbackGradients[gradientIndex];

  return (
    <div className="relative w-full h-full snap-always snap-center overflow-hidden bg-black text-white">
      {/* Background Media */}
      <div className={`absolute inset-0 w-full h-full ${bgImage ? '' : `bg-gradient-to-br ${fallbackGradient}`}`}>
        {bgImage && (
          <img 
            src={bgImage} 
            alt={displayName}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover opacity-80"
          />
        )}
      </div>

      {/* Heavy vignette for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none" />

      {/* Main Content Area */}
      <div className="absolute inset-0 flex flex-col justify-end pb-6 px-4 pointer-events-none">
        
        {/* Top Header - Category */}
        <div className="absolute top-6 left-4 right-4 flex justify-between items-start pointer-events-auto">
          {category && (
            <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase border border-white/10 shadow-lg">
              {category}
            </div>
          )}
          {artisan.is_verified && (
            <div className="bg-primary/90 text-primary-foreground backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </div>
          )}
        </div>

        <div className="flex items-end justify-between w-full z-10 pointer-events-auto">
          
          {/* Left Side: Info */}
          <div className="flex-1 pr-12 pb-2">
            <Link href={`/artisans/${artisan.id}`} className="block group">
              <h2 className="text-3xl font-extrabold mb-1 drop-shadow-lg group-hover:text-primary transition-colors flex items-center gap-2">
                {displayName}
              </h2>
            </Link>
            
            <div className="flex items-center gap-2 mb-3 text-white/90 font-medium">
              <Wrench className="w-4 h-4 text-primary" />
              <span>{primaryService}</span>
            </div>

            {artisan.bio && (
              <p className="text-white/80 text-sm line-clamp-3 mb-4 leading-relaxed drop-shadow-md max-w-[85%]">
                {artisan.bio}
              </p>
            )}

            {artisan.address && (
              <div className="flex items-center text-white/70 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1 shrink-0" />
                <span className="truncate">{artisan.address}</span>
              </div>
            )}

            <Button asChild variant="default" size="sm" className="rounded-full shadow-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground px-6">
              <Link href={`/artisans/${artisan.id}`}>
                View Profile
              </Link>
            </Button>
          </div>

          {/* Right Side: Action Bar */}
          <div className="flex flex-col items-center gap-6 pb-4">
            {/* Avatar Profile Link */}
            <Link href={`/artisans/${artisan.id}`} className="relative group">
              <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-muted flex items-center justify-center shadow-xl">
                {bgImage ? (
                  <img src={bgImage} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-muted-foreground font-bold">{initials}</span>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white rounded-full p-0.5 shadow-lg group-hover:scale-110 transition-transform">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
            </Link>

            {/* Like Action */}
            <button 
              onClick={() => setIsLiked(!isLiked)} 
              className="flex flex-col items-center gap-1 group transition-transform active:scale-90"
            >
              <div className="p-3 bg-black/20 backdrop-blur-sm rounded-full border border-white/10 group-hover:bg-black/40">
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </div>
              <span className="text-xs font-semibold text-white/90 drop-shadow-md">
                {artisan.average_rating > 0 ? artisan.average_rating.toFixed(1) : 'New'}
              </span>
            </button>

            {/* Reviews Action */}
            <Link href={`/artisans/${artisan.id}#reviews`} className="flex flex-col items-center gap-1 group transition-transform active:scale-90">
              <div className="p-3 bg-black/20 backdrop-blur-sm rounded-full border border-white/10 group-hover:bg-black/40">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-white/90 drop-shadow-md">
                {artisan.review_count || 0}
              </span>
            </Link>

            {/* Share Action */}
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Check out ${displayName} on ArtisanConnect`,
                    url: `${window.location.origin}/artisans/${artisan.id}`
                  });
                }
              }}
              className="flex flex-col items-center gap-1 group transition-transform active:scale-90"
            >
              <div className="p-3 bg-black/20 backdrop-blur-sm rounded-full border border-white/10 group-hover:bg-black/40">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-white/90 drop-shadow-md">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
