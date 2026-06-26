import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section with Images */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start space-y-6 text-left">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
                Ghana's #1 Artisan Network
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                Find the Best <span className="text-primary relative inline-block">
                  Artisans
                  <svg className="absolute -bottom-2 w-full h-3 text-amber-400" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 7c53.333-5.333 118.4-6.8 196 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span> in Town
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                Connecting skilled tradespeople with customers who need reliable, high-quality services. Plumbing, electrical, carpentry, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full text-lg h-14 px-8 shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
                    Hire an Artisan
                  </Button>
                </Link>
                <Link href="/artisans" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full text-lg h-14 px-8 bg-background/50 backdrop-blur">
                    Browse Directory
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Image Collage */}
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] block mt-8 md:mt-0 w-full max-w-sm mx-auto md:max-w-none">
              <div className="absolute top-0 right-0 w-[80%] h-[80%] md:w-3/4 md:h-3/4 rounded-2xl overflow-hidden shadow-2xl border-4 border-background transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image 
                  src="/images/artisan_electrician_1782323029739.png" 
                  alt="Professional Electrician" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-[70%] h-[70%] md:w-2/3 md:h-2/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-background transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
                <Image 
                  src="/images/artisan_plumber_1782323020851.png" 
                  alt="Professional Plumber" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="absolute top-1/4 -left-12 w-1/2 h-1/2 rounded-2xl overflow-hidden shadow-xl border-4 border-background transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-20 hidden lg:block">
                <Image 
                  src="/images/artisan_carpenter_1782323041206.png" 
                  alt="Professional Carpenter" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Escrow Security Feature Section */}
      <section className="w-full py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Card className="border-border shadow-xl bg-background/50 backdrop-blur overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full text-emerald-600 dark:text-emerald-400">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold">100% Escrow Protection</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">1</div>
                        <div className="w-0.5 h-full bg-border my-1"></div>
                      </div>
                      <div className="pb-4">
                        <h4 className="font-semibold text-lg">Fund the Project</h4>
                        <p className="text-muted-foreground text-sm">Your payment is held securely in our vault. The artisan starts work knowing the funds are guaranteed.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">2</div>
                        <div className="w-0.5 h-full bg-border my-1"></div>
                      </div>
                      <div className="pb-4">
                        <h4 className="font-semibold text-lg">Work gets done</h4>
                        <p className="text-muted-foreground text-sm">The verified artisan completes the job as agreed upon in the request.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">3</div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-emerald-600 dark:text-emerald-400">Release Payment</h4>
                        <p className="text-muted-foreground text-sm">Funds are only released to the artisan when you are 100% satisfied and approve the completion.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Peace of mind with every hire</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We've built ArtisanConnect on a foundation of trust. Our integrated Escrow System ensures that customers never lose money to incomplete jobs, and artisans never work without guaranteed pay.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>No upfront direct payments</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>Dispute resolution support</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>Full refund if artisan doesn't deliver</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 items-center md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl hover:bg-muted/50 transition-colors">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Verified Identity</h3>
              <p className="text-muted-foreground leading-relaxed">Every artisan must verify their identity using their official Ghana Card before accepting requests.</p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl hover:bg-muted/50 transition-colors">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Community Reviews</h3>
              <p className="text-muted-foreground leading-relaxed">Authentic ratings and detailed reviews from real customers help you make an informed hiring decision.</p>
            </div>

            <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl hover:bg-muted/50 transition-colors">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Fast Response</h3>
              <p className="text-muted-foreground leading-relaxed">Our platform instantly notifies relevant artisans in your area, getting your job started faster.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">Ready to get your project done?</h2>
          <p className="max-w-[600px] mx-auto text-primary-foreground/80 text-lg mb-8">Join thousands of satisfied customers who have found reliable artisans through our secure platform.</p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg h-14 px-10 rounded-full font-bold shadow-lg hover:-translate-y-1 transition-transform">
              Join ArtisanConnect Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
