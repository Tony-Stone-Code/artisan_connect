import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-background relative overflow-hidden border-b">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start space-y-6 text-left">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl/none">
                Access Verified <span className="text-primary">Professional</span> Tradespeople
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-lg leading-relaxed">
                A standardized infrastructure connecting skilled tradespeople with verifiable service requirements. Facilitating plumbing, electrical, and carpentry operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button className="w-full h-12 px-8 rounded-none">
                    Engage Services
                  </Button>
                </Link>
                <Link href="/artisans" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full h-12 px-8 rounded-none">
                    View Service Directory
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Rigid Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-[400px] mt-8 md:mt-0 w-full max-w-sm mx-auto md:max-w-none">
              <div className="relative sm:row-span-2 bg-muted border border-border">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/0/05/Electrician_01.jpg" 
                  alt="Professional Electrician" 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="relative bg-muted border border-border">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/5/58/Plumber_01.jpg" 
                  alt="Professional Plumber" 
                  fill 
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="relative bg-muted border border-border hidden sm:block">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Carpenter_Ghana.jpg" 
                  alt="Professional Carpenter" 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Escrow Security Feature Section */}
      <section className="w-full py-12 md:py-16 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Card className="border-border shadow-none rounded-none bg-card overflow-hidden border-2">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-6 border-b bg-muted/50">
                    <div className="bg-primary/10 p-2 rounded-sm text-primary">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold">Escrow Protection Protocol</h3>
                  </div>
                  
                  <div className="divide-y border-t-0">
                    <div className="flex gap-4 p-6">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-primary/20 text-primary font-bold text-sm rounded-sm">1</div>
                      <div>
                        <h4 className="font-semibold text-base">Allocate Capital</h4>
                        <p className="text-muted-foreground text-sm mt-1">Capital is secured in a centralized vault to guarantee liquidity prior to work commencement.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 p-6">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-primary/20 text-primary font-bold text-sm rounded-sm">2</div>
                      <div>
                        <h4 className="font-semibold text-base">Service Execution</h4>
                        <p className="text-muted-foreground text-sm mt-1">The engaged professional executes the specified requirements.</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-6 bg-primary/5">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground font-bold text-sm rounded-sm">3</div>
                      <div>
                        <h4 className="font-semibold text-base text-primary">Disburse Capital</h4>
                        <p className="text-muted-foreground text-sm mt-1">Capital disbursement is contingent upon formal completion approval.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Integrated Transaction Security</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                ArtisanConnect employs a standardized Escrow System to ensure capital is secured prior to commencement and disbursed strictly upon verified completion.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>Deferred Direct Compensation</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>Structured Dispute Resolution</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>Capital Protection Guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-3 border-2 border-border bg-card">
            <div className="flex flex-col items-center space-y-4 text-center p-8 border-b md:border-b-0 md:border-r border-border">
              <div className="flex h-12 w-12 items-center justify-center bg-muted border border-border">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider">Verified Identity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Identity verification via the National Identification Authority is mandatory prior to platform access.</p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 text-center p-8 border-b md:border-b-0 md:border-r border-border">
              <div className="flex h-12 w-12 items-center justify-center bg-muted border border-border">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider">Community Reviews</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Aggregated performance metrics and post-service evaluations inform engagement decisions.</p>
            </div>

            <div className="flex flex-col items-center space-y-4 text-center p-8">
              <div className="flex h-12 w-12 items-center justify-center bg-muted border border-border">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider">Fast Response</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Automated routing alerts available professionals in the designated geographic perimeter to optimize response times.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto text-center border-y border-primary-foreground/20 py-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">Initiate Service Request</h2>
          <p className="max-w-[600px] mx-auto text-primary-foreground/80 mb-8">Register to access the secure marketplace of verified professionals.</p>
          <Link href="/register">
            <Button variant="secondary" className="h-12 px-10 rounded-none font-bold uppercase tracking-wider">
              Register Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
