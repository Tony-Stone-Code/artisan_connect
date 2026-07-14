'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Home, Briefcase, Search, Info, User as UserIcon } from 'lucide-react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/30 selection:text-primary">
      <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 transition-all shadow-sm">
        <div className="container mx-auto flex h-20 items-center px-4 md:px-6">
          <div className="mr-4 hidden md:flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2 mr-4 group">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg group-hover:rotate-12 transition-transform">
                A
              </div>
              <span className="hidden font-bold sm:inline-block text-xl tracking-tight">
                Artisan<span className="text-primary">Connect</span>
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-semibold text-muted-foreground">
              <Link href="/services" className={`transition-colors hover:text-foreground ${pathname.startsWith('/services') ? 'text-primary border-b-2 border-primary pb-1' : ''}`}>Services</Link>
              <Link href="/artisans" className={`transition-colors hover:text-foreground ${pathname.startsWith('/artisans') ? 'text-primary border-b-2 border-primary pb-1' : ''}`}>Find Artisans</Link>
              <Link href="/about" className={`transition-colors hover:text-foreground ${pathname.startsWith('/about') ? 'text-primary border-b-2 border-primary pb-1' : ''}`}>Our Story</Link>
            </nav>
          </div>

          {/* Mobile brand */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg">A</div>
              <span className="font-bold text-xl tracking-tight">ArtisanConnect</span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Link href={user.user_metadata?.role === 'ADMIN' || user.user_metadata?.role === 'SUPERADMIN' ? "/admin" : "/dashboard"}>
                      <Button>{user.user_metadata?.role === 'ADMIN' || user.user_metadata?.role === 'SUPERADMIN' ? "Admin Panel" : "Dashboard"}</Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={async () => {
                        const { createClient } = await import('@/lib/supabase/client');
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        window.location.href = '/';
                      }} 
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="hidden sm:block">
                      <Button variant="ghost" className="font-semibold hover:bg-muted/50 rounded-full px-6">Log in</Button>
                    </Link>
                    <Link href="/register">
                      <Button className="rounded-full font-semibold px-4 sm:px-6 shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform">Get Started</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

      </header>
      <main className="flex-1 md:pb-0 pb-20">{children}</main>
      <footer className="border-t py-6 md:py-0 pb-24 md:pb-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            This project is built by <a href="https://gammacube.vercel.app" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-primary transition-colors">GammaCube</a>.
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (TikTok Vibe) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t flex items-center justify-around pb-safe pt-2 px-2 shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.1)]">
        <Link href="/" className={`flex flex-col items-center gap-1 p-2 ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/services" className={`flex flex-col items-center gap-1 p-2 ${pathname.startsWith('/services') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Briefcase className="w-6 h-6" />
          <span className="text-[10px] font-medium">Services</span>
        </Link>
        
        {/* Prominent Center Button */}
        <Link href="/artisans" className="flex flex-col items-center gap-1 -mt-5">
          <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg border-4 border-background hover:scale-105 transition-transform">
            <Search className="w-6 h-6" />
          </div>
          <span className={`text-[10px] font-medium ${pathname.startsWith('/artisans') ? 'text-primary' : 'text-muted-foreground'}`}>Search</span>
        </Link>
        
        <Link href="/about" className={`flex flex-col items-center gap-1 p-2 ${pathname.startsWith('/about') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Info className="w-6 h-6" />
          <span className="text-[10px] font-medium">About</span>
        </Link>

        {user ? (
          <Link href={user.user_metadata?.role === 'ADMIN' || user.user_metadata?.role === 'SUPERADMIN' ? "/admin" : "/dashboard"} className={`flex flex-col items-center gap-1 p-2 ${pathname.startsWith('/dashboard') || pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'}`}>
            <UserIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        ) : (
          <Link href="/login" className={`flex flex-col items-center gap-1 p-2 ${pathname.startsWith('/login') ? 'text-primary' : 'text-muted-foreground'}`}>
            <UserIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium">Log In</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
