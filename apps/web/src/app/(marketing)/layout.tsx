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
              <Link href="/services" className={`group flex items-center gap-2 transition-colors hover:text-foreground ${pathname.startsWith('/services') ? 'text-primary border-b-2 border-primary pb-1' : ''}`}>
                <Briefcase className="w-5 h-5" />
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${pathname.startsWith('/services') ? 'max-w-[100px] opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100'}`}>Services</span>
              </Link>
              <Link href="/artisans" className={`group flex items-center gap-2 transition-colors hover:text-foreground ${pathname.startsWith('/artisans') ? 'text-primary border-b-2 border-primary pb-1' : ''}`}>
                <Search className="w-5 h-5" />
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${pathname.startsWith('/artisans') ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100'}`}>Find Artisans</span>
              </Link>
              <Link href="/about" className={`group flex items-center gap-2 transition-colors hover:text-foreground ${pathname.startsWith('/about') ? 'text-primary border-b-2 border-primary pb-1' : ''}`}>
                <Info className="w-5 h-5" />
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${pathname.startsWith('/about') ? 'max-w-[100px] opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100'}`}>Our Story</span>
              </Link>
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
        <Link href="/" className={`group flex flex-col items-center p-2 ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Home className="w-6 h-6" />
          <span className={`text-[10px] font-medium transition-all duration-300 overflow-hidden ${pathname === '/' ? 'max-h-4 opacity-100 mt-1' : 'max-h-0 opacity-0 group-hover:max-h-4 group-hover:opacity-100 group-hover:mt-1'}`}>Home</span>
        </Link>
        <Link href="/services" className={`group flex flex-col items-center p-2 ${pathname.startsWith('/services') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Briefcase className="w-6 h-6" />
          <span className={`text-[10px] font-medium transition-all duration-300 overflow-hidden ${pathname.startsWith('/services') ? 'max-h-4 opacity-100 mt-1' : 'max-h-0 opacity-0 group-hover:max-h-4 group-hover:opacity-100 group-hover:mt-1'}`}>Services</span>
        </Link>
        
        {/* Prominent Center Button */}
        <Link href="/artisans" className="group flex flex-col items-center -mt-5">
          <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg border-4 border-background group-hover:scale-105 transition-transform">
            <Search className="w-6 h-6" />
          </div>
          <span className={`text-[10px] font-medium transition-all duration-300 overflow-hidden ${pathname.startsWith('/artisans') ? 'text-primary max-h-4 opacity-100 mt-1' : 'text-muted-foreground max-h-0 opacity-0 group-hover:max-h-4 group-hover:opacity-100 group-hover:mt-1'}`}>Search</span>
        </Link>
        
        <Link href="/about" className={`group flex flex-col items-center p-2 ${pathname.startsWith('/about') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Info className="w-6 h-6" />
          <span className={`text-[10px] font-medium transition-all duration-300 overflow-hidden ${pathname.startsWith('/about') ? 'max-h-4 opacity-100 mt-1' : 'max-h-0 opacity-0 group-hover:max-h-4 group-hover:opacity-100 group-hover:mt-1'}`}>About</span>
        </Link>

        {user ? (
          <Link href={user.user_metadata?.role === 'ADMIN' || user.user_metadata?.role === 'SUPERADMIN' ? "/admin" : "/dashboard"} className={`group flex flex-col items-center p-2 ${pathname.startsWith('/dashboard') || pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'}`}>
            <UserIcon className="w-6 h-6" />
            <span className={`text-[10px] font-medium transition-all duration-300 overflow-hidden ${pathname.startsWith('/dashboard') || pathname.startsWith('/admin') ? 'max-h-4 opacity-100 mt-1' : 'max-h-0 opacity-0 group-hover:max-h-4 group-hover:opacity-100 group-hover:mt-1'}`}>Profile</span>
          </Link>
        ) : (
          <Link href="/login" className={`group flex flex-col items-center p-2 ${pathname.startsWith('/login') ? 'text-primary' : 'text-muted-foreground'}`}>
            <UserIcon className="w-6 h-6" />
            <span className={`text-[10px] font-medium transition-all duration-300 overflow-hidden ${pathname.startsWith('/login') ? 'max-h-4 opacity-100 mt-1' : 'max-h-0 opacity-0 group-hover:max-h-4 group-hover:opacity-100 group-hover:mt-1'}`}>Log In</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
