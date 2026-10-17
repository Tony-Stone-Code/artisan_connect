import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Scale, 
  Users, 
  Wrench, 
  Zap, 
  Car, 
  Hammer,
  Target,
  HeartHandshake,
  X
} from 'lucide-react';

export const metadata = {
  title: 'Our Story | ArtisanConnect',
  description: 'How ArtisanConnect is transforming the informal artisan economy in Ghana through institutional trust, biometric verification, and escrow security.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      
      {/* Hero Section with Cinematic Background */}
      <section className="relative min-h-[440px] md:min-h-[500px] border-b border-border flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/ghana_artisan_hero_bg.jpg"
            alt="Artisan workshop in Accra"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-background/90 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(#2563eb18_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Our Mission &amp; Heritage
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-4">
            Built in Ghana, for Ghana: Solving the <span className="text-primary">Artisan Trust Dilemma</span>
          </h1>

          <div className="w-16 h-1 bg-primary mx-auto mb-6" />

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Every homeowner in Accra has experienced the anxiety of hiring an unverified artisan. We built ArtisanConnect to replace guesswork with institutional trust, escrow protection, and verified craftsmanship.
          </p>
        </div>
      </section>

      {/* The Problem vs Solution Matrix */}
      <section className="py-20 border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
              Rethinking How Trades Operate in Africa
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For decades, hiring a tradesperson meant risking upfront deposits on empty promises. Here is how we revolutionized the equation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* The Old Way */}
            <div className="bg-card border-2 border-destructive/30 p-8 space-y-5 rounded-none shadow-sm relative overflow-hidden">
              <div className="inline-block px-3 py-1 bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-wider">
                The Roadside Lottery (The Old Way)
              </div>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span><strong>Vanishing Upfront Payments:</strong> Tradespeople demanding 70% advance, then disappearing for weeks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span><strong>Zero Identity Accountability:</strong> Anonymous roadside phone numbers with no verified address or Ghana Card on record.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span><strong>One-Sided Arguments:</strong> When poor work is delivered, the customer has no recourse or refund mechanism.</span>
                </li>
              </ul>
            </div>

            {/* The ArtisanConnect Way */}
            <div className="bg-card border-2 border-primary/50 p-8 space-y-5 rounded-none shadow-lg relative overflow-hidden">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                The ArtisanConnect Guarantee
              </div>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Secure Escrow Protection:</strong> Funds are safely held and only released when you inspect and approve the job.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Biometric Ghana Card Verification:</strong> Every artisan is vetted with official government credentials and verified local workshop addresses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>AI Neutrality &amp; Fair Dispute Scoring:</strong> Transparent mediation ensures artisans get paid for honest work while customers are protected from defects.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* The 3 Core Pillars of Institutional Trust */}
      <section className="py-20 border-b border-border bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              Engineered for Stability
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">
              Our Three Pillars of Integrity
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <Card className="rounded-none border-2 border-border bg-card p-6 space-y-3 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase">Biometric Verification</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We bridge informal trades into the formal digital economy using Ghana Card national identity verification, criminal background review, and verified location mapping.
              </p>
            </Card>

            <Card className="rounded-none border-2 border-border bg-card p-6 space-y-3 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-accent/15 text-accent flex items-center justify-center border border-accent/30">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase">Escrow Custody Engine</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By removing cash advances, we eliminate 99.8% of marketplace friction. Artisans work with the peace of mind that funds are locked, and customers maintain complete control.
              </p>
            </Card>

            <Card className="rounded-none border-2 border-border bg-card p-6 space-y-3 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase">AI-Assisted Fairness</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our machine learning dispute assessment models evaluate quote scopes, in-app communications, and photographic evidence to produce impartial, mathematically fair resolutions.
              </p>
            </Card>

          </div>
        </div>
      </section>

      {/* Meet the Ghanaian Master Artisans */}
      <section className="py-20 border-b border-border bg-muted/40">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              Our Community
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">
              The Real Faces of Ghanaian Craft
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Meet a few of the dedicated professional artisans powering homes and businesses every day in Accra.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Kwame Mensah',
                role: 'Master Plumber',
                location: 'Osu, Accra',
                image: '/images/artisan_plumber_1782323020851.png',
                icon: Wrench,
                experience: '10+ Years Exp.',
              },
              {
                name: 'Ama Osei',
                role: 'Solar & Electrical Engineer',
                location: 'East Legon, Accra',
                image: '/images/artisan_electrician_ghana.jpg',
                icon: Zap,
                experience: '8+ Years Exp.',
              },
              {
                name: 'Yaw Adom',
                role: 'Auto Diagnostics Specialist',
                location: 'Spintex, Accra',
                image: '/images/artisan_mechanic_ghana.jpg',
                icon: Car,
                experience: '12+ Years Exp.',
              },
              {
                name: 'Kofi Boateng',
                role: 'Custom Hardwood Carpenter',
                location: 'Dansoman, Accra',
                image: '/images/artisan_carpenter_1782323041206.png',
                icon: Hammer,
                experience: '15+ Years Exp.',
              },
            ].map((artisan) => {
              const Icon = artisan.icon;
              return (
                <div key={artisan.name} className="bg-card border-2 border-border overflow-hidden rounded-none shadow-sm hover:border-primary/50 transition-all group">
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <Image
                      src={artisan.image}
                      alt={artisan.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 250px"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="font-bold text-sm text-foreground">{artisan.name}</p>
                    <p className="text-xs text-primary font-semibold flex items-center gap-1">
                      <Icon className="w-3.5 h-3.5" /> {artisan.role}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{artisan.location} • {artisan.experience}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="py-20 bg-background text-center">
        <div className="container mx-auto px-4 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" /> Join The Movement
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
            Experience Transparent Trade in Ghana
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Whether you are looking to hire verified expertise or you are an artisan seeking guaranteed payments for your talent, ArtisanConnect is your home.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link href="/artisans">
              <Button size="lg" className="w-full sm:w-auto px-8 h-12 rounded-none font-bold uppercase tracking-wider text-xs">
                Browse Verified Artisans
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 rounded-none font-bold uppercase tracking-wider text-xs">
                Register as an Artisan
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
