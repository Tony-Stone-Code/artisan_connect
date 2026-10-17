import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Wrench, 
  Zap, 
  Car, 
  Hammer, 
  HardHat, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export const metadata = {
  title: 'Our Services | ArtisanConnect',
  description: 'Explore verified skilled trade services across Ghana: plumbing, electrical, carpentry, auto mechanics, masonry, and painting with 100% escrow protection.',
};

const SERVICES = [
  {
    name: 'Plumbing Solutions',
    query: 'Plumbing',
    image: '/images/artisan_plumber_1782323020851.png',
    icon: Wrench,
    badge: 'High Demand',
    badgeColor: 'bg-primary/10 text-primary',
    description: 'Complete water distribution systems, sanitary installations, and emergency pressure leak interception.',
    tasks: ['Burst pipe repair & leak detection', 'Overhead water tank & pump installation', 'Water heater fitting & servicing', 'Bathroom & kitchen fixture replacement'],
    pricing: 'From GHS 150',
  },
  {
    name: 'Electrical & Solar Power',
    query: 'Electrical',
    image: '/images/artisan_electrician_ghana.jpg',
    icon: Zap,
    badge: 'Certified Master',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    description: 'Safe residential and commercial wiring, backup inverters, solar panels, and automatic generator switchovers.',
    tasks: ['Complete building rewiring & conduit runs', 'Inverter battery bank & solar setup', 'Breaker panel troubleshooting & load testing', 'Chandelier & architectural LED lighting'],
    pricing: 'From GHS 200',
  },
  {
    name: 'Auto Mechanics & Diagnostics',
    query: 'Mechanic',
    image: '/images/artisan_mechanic_ghana.jpg',
    icon: Car,
    badge: 'Computerized OBD-II',
    badgeColor: 'bg-rose-500/10 text-rose-600',
    description: 'Expert automotive mechanics for Japanese, Korean, and European vehicles with digital diagnostic scanners.',
    tasks: ['Engine check light diagnostic scanning', 'Brake pad replacement & hydraulic bleeding', 'Suspension bushes, shocks & steering rack', 'Automatic transmission oil flush & calibration'],
    pricing: 'From GHS 250',
  },
  {
    name: 'Custom Carpentry & Hardwood',
    query: 'Carpentry',
    image: '/images/artisan_carpenter_1782323041206.png',
    icon: Hammer,
    badge: 'Ghanaian Hardwood',
    badgeColor: 'bg-orange-500/10 text-orange-600',
    description: 'Artisanal furniture craftsmanship using Odum, Mahogany, and Teak for doors, luxury kitchens, and roofing.',
    tasks: ['Solid wood security doors & frame fitting', 'Custom kitchen cabinets with soft-close drawers', 'Wardrobe building & acoustic paneling', 'Roof truss construction & structural wood repairs'],
    pricing: 'From GHS 300',
  },
  {
    name: 'Masonry & Modern Tiling',
    query: 'Masonry',
    image: '/images/artisan_mason_ghana.jpg',
    icon: HardHat,
    badge: 'Precision Finish',
    badgeColor: 'bg-emerald-500/10 text-emerald-600',
    description: 'Structural blockwork, precision porcelain tiling, screeding, and reinforced concrete foundations.',
    tasks: ['Floor & wall porcelain / ceramic tiling', 'Interlocking paving stones & driveways', 'Building plastering & screeding', 'Crack repair & reinforced concrete beams'],
    pricing: 'From GHS 250',
  },
  {
    name: 'Painting & Surface Protection',
    query: 'Painting',
    image: '/images/ghana_artisan_hero_bg.jpg',
    icon: Sparkles,
    badge: 'Weather-Shield',
    badgeColor: 'bg-blue-500/10 text-blue-600',
    description: 'Interior and exterior architectural coating, weather-proof sealing, damp proofing, and decorative finishes.',
    tasks: ['Exterior weather-shield acrylic painting', 'Interior silk emulsion & feature walls', 'Anti-damp wall treatment & plaster sealing', 'Roof coating & waterproof membrane application'],
    pricing: 'From GHS 180',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      
      {/* Services Hero Section */}
      <section className="relative min-h-[420px] md:min-h-[460px] border-b border-border flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/ghana_artisan_hero_bg.jpg"
            alt="Artisan services catalog"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-background/90 to-background" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Trade Catalog
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-4">
            Professional <span className="text-primary">Trade Services</span> in Ghana
          </h1>

          <div className="w-16 h-1 bg-primary mx-auto mb-6" />

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Every booking is backed by biometric Ghana Card identity vetting, standardized pricing estimates, and 100% money-back escrow protection.
          </p>
        </div>
      </section>

      {/* Emergency Assistance Notice Bar */}
      <div className="bg-primary/5 border-b border-primary/20 py-4 px-4 text-center">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-primary">
            <Clock className="w-4 h-4 text-accent" />
            <span>Need Emergency Same-Day Repairs?</span>
          </div>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <span className="text-muted-foreground">Find on-call artisans available immediately in Greater Accra.</span>
          <Link href="/artisans" className="font-bold text-primary underline underline-offset-4 hover:text-primary/80">
            View On-Call Artisans &rarr;
          </Link>
        </div>
      </div>

      {/* Main Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.name} 
                className="bg-card border-2 border-border overflow-hidden rounded-none shadow-sm hover:border-primary/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Photo Header */}
                <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 ${service.badgeColor} bg-background/90 backdrop-blur-sm border border-border/80`}>
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Icon on Cover */}
                  <div className="absolute bottom-3 left-4 right-4 text-white z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-bold">{service.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>

                    {/* Common Tasks Checklist */}
                    <div className="space-y-2 pt-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">Common Work Scopes:</p>
                      <ul className="space-y-1.5">
                        {service.tasks.map((task) => (
                          <li key={task} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer Bar with Price & Action */}
                  <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Typical Scope</p>
                      <p className="text-sm font-black text-foreground">{service.pricing}</p>
                    </div>

                    <Link href={`/artisans?q=${encodeURIComponent(service.query)}`}>
                      <Button size="sm" className="rounded-none text-xs font-bold uppercase tracking-wider px-5 shadow-sm group-hover:bg-primary/90">
                        Book Artisan <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Escrow Guarantee Banner */}
      <section className="py-16 bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <div className="w-12 h-12 bg-accent/15 text-accent mx-auto flex items-center justify-center border border-accent/30">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
            All Services Include 100% Escrow Protection
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Never lose money to uncompleted or abandoned jobs again. When you hire on ArtisanConnect, your payment is guarded until you confirm the work is completed to your satisfaction.
          </p>
          <div className="pt-4">
            <Link href="/artisans">
              <Button size="lg" className="rounded-none font-bold uppercase tracking-wider text-xs px-8 h-12 shadow-lg">
                Find a Verified Artisan Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
