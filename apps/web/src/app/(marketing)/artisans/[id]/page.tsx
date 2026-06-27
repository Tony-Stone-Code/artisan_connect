import { notFound } from 'next/navigation';
import { getArtisanById } from '@/app/actions/artisans';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MapPin, Star, ShieldCheck, Briefcase, Calendar, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ReportButton } from '@/components/ui/ReportButton';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artisan = await getArtisanById(id);
  if (!artisan || !artisan.user) return { title: 'Artisan Not Found' };
  
  const displayName = artisan.business_name || `${artisan.user.first_name} ${artisan.user.last_name}`;
  return {
    title: `${displayName} | ArtisanConnect`,
    description: artisan.bio || `Hire ${displayName} on ArtisanConnect.`,
  };
}

export default async function ArtisanPublicProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artisan = await getArtisanById(id);

  if (!artisan || !artisan.user) {
    notFound();
  }

  const displayName = artisan.business_name || `${artisan.user.first_name} ${artisan.user.last_name}`;
  const initials = artisan.business_name 
    ? artisan.business_name.substring(0, 2).toUpperCase()
    : `${artisan.user.first_name[0]}${artisan.user.last_name[0]}`;

  return (
    <div className="min-h-screen bg-muted/20 pb-24">
      {/* Cover Banner */}
      <div className="h-48 md:h-64 lg:h-80 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background relative border-b">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 h-full relative">
          <Link href="/artisans" className="absolute top-6 left-4 md:left-6 inline-flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors bg-background/50 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Directory
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 md:-mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Core Identity & Sticky Actions */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  {artisan.user.avatar_url ? (
                    <img 
                      src={artisan.user.avatar_url} 
                      alt={displayName} 
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-card object-cover bg-muted shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-card bg-primary text-primary-foreground flex items-center justify-center text-4xl font-bold shadow-md">
                      {initials}
                    </div>
                  )}
                  {artisan.is_verified && (
                    <div className="absolute bottom-2 right-2 bg-background text-primary p-1.5 rounded-full shadow-md border" title="Verified Artisan">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{displayName}</h1>
                {artisan.business_name && (
                  <p className="text-muted-foreground flex items-center gap-1.5 mb-4">
                    <Briefcase className="w-4 h-4" />
                    {artisan.user.first_name} {artisan.user.last_name}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-base">{artisan.average_rating > 0 ? artisan.average_rating.toFixed(1) : 'New'}</span>
                    <span className="text-muted-foreground">({artisan.review_count} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {artisan.address || 'Location unknown'}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(artisan.user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div className="w-full space-y-3 pt-6 border-t border-border/50">
                  <Link href={`/dashboard/requests/new?artisan_id=${artisan.id}`} className="w-full">
                    <Button size="lg" className="w-full font-semibold rounded-full shadow-md">
                      Request Service
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="w-full rounded-full bg-background">
                    <MessageSquare className="w-4 h-4 mr-2" /> Message
                  </Button>
                  
                  <div className="pt-4 flex justify-center">
                    <ReportButton 
                      targetId={artisan.user.id} 
                      targetType="USER" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specialties/Services Quick List */}
            {artisan.services && artisan.services.length > 0 && (
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {artisan.services.map((service: any) => (
                      <Badge key={service.id} variant="secondary" className="bg-muted">
                        {service.subcategory?.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Details, Services, Portfolio, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">About {artisan.business_name || artisan.user.first_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                  {artisan.bio || (
                    <span className="italic text-muted-foreground/60">This artisan hasn't added a bio yet.</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Services & Pricing */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Services & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {artisan.services && artisan.services.length > 0 ? (
                  artisan.services.map((service: any) => (
                    <div key={service.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{service.subcategory?.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{service.description || 'No detailed description provided.'}</p>
                      </div>
                      <div className="shrink-0 text-left sm:text-right">
                        {(service.price_min || service.price_max) ? (
                          <div className="font-bold text-primary">
                            GH₵ {service.price_min?.toString() || '0'} {service.price_max ? `- ${service.price_max.toString()}` : '+'}
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-muted-foreground">Price on Request</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">No specific services listed yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Portfolio */}
            {artisan.portfolio && artisan.portfolio.length > 0 && (
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">Portfolio</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                    {artisan.portfolio.map((item: any) => (
                      <div key={item.id} className="aspect-square relative group bg-muted overflow-hidden">
                        <img 
                          src={item.image_url} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <p className="text-white font-medium text-sm truncate">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {artisan.reviews && artisan.reviews.length > 0 ? (
                  <div className="space-y-6 divide-y divide-border/50">
                    {artisan.reviews.map((review: any) => (
                      <div key={review.id} className="pt-6 first:pt-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {review.customer.user.avatar_url ? (
                              <img src={review.customer.user.avatar_url} className="w-10 h-10 rounded-full object-cover bg-muted" alt="" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                {review.customer.user.first_name[0]}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm text-foreground">{review.customer.user.first_name} {review.customer.user.last_name}</p>
                              <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'fill-muted text-muted'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                          "{review.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 bg-muted/30 rounded-xl border border-dashed border-border">
                    <Star className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-foreground font-medium mb-1">No reviews yet</p>
                    <p className="text-sm text-muted-foreground">Be the first to hire and review this artisan!</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
