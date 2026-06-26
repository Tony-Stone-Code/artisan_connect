import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Bridging the gap between <span className="text-primary">skill</span> and <span className="text-primary">need</span>.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              ArtisanConnect is a modern marketplace designed to empower local tradespeople while providing customers with reliable, verified services.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-background transform md:rotate-2">
              <Image 
                src="/images/about_hero_1782323590841.png"
                alt="About ArtisanConnect"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="space-y-4 bg-muted/30 p-6 rounded-2xl border">
            <h3 className="text-2xl font-semibold">For Customers</h3>
            <p className="text-muted-foreground">
              Finding a reliable plumber, electrician, or carpenter shouldn&apos;t be a gamble. We verify all artisans on our platform, providing transparent reviews, secure payments, and a seamless booking experience.
            </p>
          </div>
          <div className="space-y-4 bg-primary/5 p-6 rounded-2xl border border-primary/20">
            <h3 className="text-2xl font-semibold text-primary">For Artisans</h3>
            <p className="text-muted-foreground">
              Focus on what you do best—your craft. We handle the marketing, scheduling, and invoicing, helping you grow your business and connect with customers who value quality work.
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <h2 className="text-2xl font-bold mb-6">Join the Community</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">Sign Up Now</Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Explore Services</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
