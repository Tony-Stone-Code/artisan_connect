import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  ShieldCheck, 
  Lock, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Wrench, 
  Sparkles, 
  Hammer, 
  Car, 
  HardHat, 
  Paintbrush,
  ChevronRight,
  Award
} from 'lucide-react';
import { HeroSearchForm } from '@/components/home/HeroSearchForm';
import { InteractiveHeroShowcase } from '@/components/home/InteractiveHeroShowcase';
import { InteractiveEscrowFlow } from '@/components/home/InteractiveEscrowFlow';
import { TradeEstimatorWidget } from '@/components/home/TradeEstimatorWidget';

const FEATURED_TRADES = [
  {
    title: 'Plumbing Solutions',
    query: 'Plumbing',
    image: '/images/artisan_plumber_1782323020851.png',
    icon: Wrench,
    tasks: 'Pipe leaks, water tanks, booster pumps & bathroom fixtures',
    price: 'From GHS 120',
  },
  {
    title: 'Electrical & Solar',
    query: 'Electrical',
    image: '/images/artisan_electrician_ghana.jpg',
    icon: Sparkles,
    tasks: 'Breaker panels, building wiring, hybrid inverters & lighting',
    price: 'From GHS 200',
  },
  {
    title: 'Auto Mechanics',
    query: 'Auto Mechanics',
    image: '/images/artisan_mechanic_ghana.jpg',
    icon: Car,
    tasks: 'OBD diagnostics, brake overhaul, engine care & suspension',
    price: 'From GHS 150',
  },
  {
    title: 'Custom Carpentry',
    query: 'Carpentry',
    image: '/images/artisan_carpenter_1782323041206.png',
    icon: Hammer,
    tasks: 'Hardwood doors, custom kitchen cabinets, roof trusses & repair',
    price: 'From GHS 250',
  },
  {
    title: 'Masonry & Tiling',
    query: 'Masonry',
    image: '/images/artisan_mason_ghana.jpg',
    icon: HardHat,
    tasks: 'Floor porcelain tiling, compound paving & structural plastering',
    price: 'From GHS 250',
  },
  {
    title: 'Painting & Surface',
    query: 'Painting',
    image: '/images/ghana_artisan_hero_bg.jpg',
    icon: Paintbrush,
    tasks: 'Weather-shield exterior, interior silk coats & anti-damp sealing',
    price: 'From GHS 180',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center overflow-hidden">
      
      {/* Dynamic Animated Hero Section */}
      <section className="w-full relative min-h-[640px] lg:min-h-[720px] bg-background border-b border-border flex items-center justify-center overflow-hidden py-14 lg:py-20">
        {/* Subtle Ambient Background Texture */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-primary/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 -right-32 w-[480px] h-[480px] bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left animate-fade-in-up">
              
              {/* Trust Badge Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span>Ghana&apos;s Verified Artisan Network</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08]">
                Hire Trusted <span className="text-primary">Artisans</span> in Ghana With Zero Risk.
              </h1>

              {/* Supporting Copy */}
              <p className="max-w-[600px] text-base md:text-lg text-muted-foreground leading-relaxed">
                Connect with verified plumbers, electricians, carpenters, and auto mechanics across Accra. Your payment stays safely in escrow until the job is inspected and approved.
              </p>

              {/* Working Search Form with Dynamic Placeholders */}
              <HeroSearchForm />

              {/* Guarantees Strip */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/70 w-full max-w-lg text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">Ghana Card Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent shrink-0" />
                  <span className="font-semibold text-foreground">Escrow Safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-foreground">Direct MoMo Pay</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Artisan Showcase Column */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <InteractiveHeroShowcase />
            </div>

          </div>
        </div>
      </section>

      {/* Live Impact Ticker Strip */}
      <section className="w-full bg-muted/40 py-8 border-b border-border">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">4,800+</p>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Completed Jobs</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">GHS 0</p>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Customer Fraud Loss</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-accent">100%</p>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Ghana Card Verified</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">4.9 / 5.0</p>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Escrow Security Feature Section */}
      <section className="w-full py-16 lg:py-20 bg-background border-b border-border">
        <div className="container px-4 md:px-6 mx-auto">
          <InteractiveEscrowFlow />
        </div>
      </section>

      {/* Instant Cost & Artisan Estimator */}
      <section className="w-full py-16 lg:py-20 bg-muted/30 border-b border-border">
        <div className="container px-4 md:px-6 mx-auto">
          <TradeEstimatorWidget />
        </div>
      </section>

      {/* Popular Trades Visual Grid */}
      <section className="w-full py-16 lg:py-20 bg-background border-b border-border">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Categories
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Qualified Skilled Trades
              </h2>
            </div>
            <Link href="/artisans">
              <Button variant="outline" className="rounded-none font-bold uppercase tracking-wider text-xs cursor-pointer">
                Explore All Trades <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_TRADES.map((trade) => {
              const Icon = trade.icon;
              return (
                <Link 
                  key={trade.title}
                  href={`/artisans?q=${encodeURIComponent(trade.query)}`}
                  className="group block"
                >
                  <Card className="rounded-none border border-border/70 overflow-hidden bg-card hover:border-primary/60 transition-all duration-300 hover:shadow-lg card-hover-lift flex flex-col h-full">
                    <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                      <Image
                        src={trade.image}
                        alt={trade.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white flex items-center gap-2 text-xs font-bold">
                        <Icon className="w-4 h-4 text-accent" />
                        <span>{trade.title}</span>
                      </div>
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {trade.tasks}
                      </p>
                      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground">{trade.price}</span>
                        <span className="text-primary font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          View Artisans <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 lg:py-20 bg-muted/50 border-b border-border relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10 text-center max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            Standardizing Trade Quality in Ghana
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Ready to Get Quality Work Done?
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Join thousands of homeowners and businesses across Ghana who hire skilled artisans with complete escrow confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/artisans" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8 h-12 rounded-none font-bold uppercase tracking-wider text-xs shadow-lg cursor-pointer">
                Find Verified Artisans
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 rounded-none font-bold uppercase tracking-wider text-xs cursor-pointer">
                Register as an Artisan
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
