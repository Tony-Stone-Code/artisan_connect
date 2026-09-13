import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 border-x border-border max-w-5xl bg-card">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 pb-8 border-b border-border">
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Standardizing <span className="text-primary">Labor</span> for Structural <span className="text-primary">Requirements</span>
            </h1>
            <p className="text-muted-foreground md:text-lg">
              ArtisanConnect functions as a robust marketplace infrastructure, standardizing local trades while ensuring verifiable and reliable service delivery.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-none overflow-hidden border-2 border-border">
              <Image 
                src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Carpenters_roofing_stores_in_Northern_Ghana.jpg"
                alt="About ArtisanConnect"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="space-y-3 bg-muted/50 p-6 rounded-none border border-border">
            <h3 className="text-xl font-bold uppercase tracking-wide">Consumer Sector</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sourcing dependable structural and maintenance services is optimized through mandatory verification, aggregated performance metrics, and standardized payment escrow protocols.
            </p>
          </div>
          <div className="space-y-3 bg-primary/5 p-6 rounded-none border border-primary/20">
            <h3 className="text-xl font-bold uppercase tracking-wide text-primary">Professional Sector</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Focus operational bandwidth on core technical competencies. The platform automates client acquisition, logistics, and financial reconciliation.
            </p>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-border mt-8">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-6">Initiate Registration</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button className="w-full sm:w-auto h-12 px-8 rounded-none">Register Account</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-none">View Service Directory</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
