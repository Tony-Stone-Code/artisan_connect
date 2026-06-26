import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Content/Forms (Bottom on mobile, Left on Desktop) */}
      <div className="flex w-full flex-col justify-center px-4 py-12 md:px-8 lg:w-1/2 lg:px-16 xl:px-24 order-last lg:order-first">
        <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-sm font-medium text-white lg:text-muted-foreground hover:text-white/80 lg:hover:text-foreground transition-colors z-50 mix-blend-difference lg:mix-blend-normal">
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
      
      {/* Image Panel (Top on mobile, Right on Desktop) */}
      <div className="relative w-full h-64 sm:h-80 lg:h-auto lg:w-1/2 bg-primary/10 order-first lg:order-last">
        <Image 
          src="/images/auth_bg_1782323573765.png"
          alt="Professional working"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <blockquote className="space-y-2">
            <p className="text-xl italic font-medium leading-relaxed">
              "ArtisanConnect has completely transformed how I manage my projects and find reliable work. The platform is intuitive, secure, and professional."
            </p>
            <footer className="text-sm font-semibold opacity-80">
              — Satisfied Professional
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
