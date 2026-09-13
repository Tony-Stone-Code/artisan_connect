import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background">
      {/* Image Panel */}
      <div className="relative w-full h-48 sm:h-64 lg:h-auto lg:w-1/2 bg-muted border-b lg:border-b-0 lg:border-r border-border">
        <Image 
          src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Carpenters_roofing_stores_in_Northern_Ghana.jpg"
          alt="Professional Tradesmen"
          fill
          className="object-cover grayscale mix-blend-multiply opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
          <Link href="/" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-primary-foreground bg-primary px-4 py-2 border-2 border-primary hover:bg-background hover:text-primary transition-colors rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Directory
          </Link>
        </div>
      </div>

      {/* Content/Forms */}
      <div className="flex w-full flex-col justify-center px-4 py-12 md:px-8 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
