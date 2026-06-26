import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Image from 'next/image';

const services = [
  { name: 'Plumbing', description: 'Pipe repairs, installations, drain cleaning, and water heater services.', icon: '🔧' },
  { name: 'Electrical', description: 'Wiring, panel upgrades, outlet installations, and lighting fixtures.', icon: '⚡' },
  { name: 'Carpentry', description: 'Custom furniture, cabinetry, door installations, and wood repairs.', icon: '🪚' },
  { name: 'Painting', description: 'Interior and exterior painting, wallpaper, and surface preparation.', icon: '🎨' },
  { name: 'Masonry', description: 'Bricklaying, tiling, concrete work, and structural repairs.', icon: '🧱' },
  { name: 'Welding & Metalwork', description: 'Gate fabrication, burglar proofing, and metal furniture.', icon: '🔩' },
  { name: 'Auto Mechanics', description: 'Vehicle repairs, servicing, diagnostics, and bodywork.', icon: '🚗' },
  { name: 'Tailoring', description: 'Custom clothing, alterations, and fashion design services.', icon: '🧵' },
  { name: 'Cleaning', description: 'Deep cleaning, office cleaning, and post-construction cleanup.', icon: '🧹' },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-primary/5 rounded-3xl p-8 border border-primary/10">
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Our Services</h1>
          <p className="text-muted-foreground md:text-lg leading-relaxed">
            Browse the categories of skilled tradespeople available on ArtisanConnect. Whether you need an emergency repair or a long-term project, we have the right professional for you.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[400px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-background">
            <Image 
              src="/images/services_hero_1782323600766.png"
              alt="ArtisanConnect Services"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.name} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="text-4xl mb-2">{service.icon}</div>
              <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
