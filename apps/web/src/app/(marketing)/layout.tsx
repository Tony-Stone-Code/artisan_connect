'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Home, Briefcase, Search, Info, User as UserIcon, Menu, X } from 'lucide-react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/30 selection:text-primary">
      <header className="sticky top-0 z-50 w-full border-b bg-background transition-all shadow-sm">
        <div className="container mx-auto flex h-20 items-center px-4 md:px-6">
          <div className="mr-4 hidden md:flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2 mr-4 group">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg">
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
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <Link href={user.user_metadata?.role === 'ADMIN' || user.user_metadata?.role === 'SUPERADMIN' ? "/admin" : "/dashboard"}>
                        <Button className="rounded-none">{user.user_metadata?.role === 'ADMIN' || user.user_metadata?.role === 'SUPERADMIN' ? "Admin Panel" : "Dashboard"}</Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        onClick={async () => {
                          const { createClient } = await import('@/lib/supabase/client');
                          const supabase = createClient();
                          await supabase.auth.signOut();
                          window.location.href = '/';
                        }} 
                        className="text-muted-foreground hover:text-foreground rounded-none"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" className="font-semibold hover:bg-muted/50 rounded-none px-6">Log in</Button>
                      </Link>
                      <Link href="/register">
                        <Button className="rounded-none font-semibold px-6 shadow-none border border-primary">Get Started</Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-4 shadow-md">
            <nav className="flex flex-col space-y-3">
              <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold hover:text-primary transition-colors py-2 border-b">
                Services
              </Link>
              <Link href="/artisans" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold hover:text-primary transition-colors py-2 border-b">
                Find Artisans
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold hover:text-primary transition-colors py-2 border-b">
                Our Story
              </Link>
            </nav>
            <div className="flex flex-col space-y-2 pt-2">
              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <Link href={user.user_metadata?.role === 'ADMIN' || user.user_metadata?.role === 'SUPERADMIN' ? "/admin" : "/dashboard"} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full rounded-none">{user.user_metadata?.role === 'ADMIN' || user.user_metadata?.role === 'SUPERADMIN' ? "Admin Panel" : "Dashboard"}</Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        onClick={async () => {
                          const { createClient } = await import('@/lib/supabase/client');
                          const supabase = createClient();
                          await supabase.auth.signOut();
                          window.location.href = '/';
                        }} 
                        className="w-full rounded-none"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-none">Log in</Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full rounded-none">Get Started</Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            This project is built by <a href="https://gammacube.vercel.app" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-primary transition-colors">GammaCube</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
