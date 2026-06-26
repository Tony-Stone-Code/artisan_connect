'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
              <Link href="/match" className={`flex items-center gap-1 transition-colors hover:text-primary ${pathname.startsWith('/match') ? 'text-primary border-b-2 border-primary pb-1' : ''}`}>
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                AI Match
              </Link>
              <Link href="/about" className={`transition-colors hover:text-foreground ${pathname.startsWith('/about') ? 'text-primary border-b-2 border-primary pb-1' : ''}`}>Our Story</Link>
            </nav>
          </div>

          {/* Mobile brand and menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg">A</div>
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

        {/* Mobile Navigation Full-Screen Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[80px] left-0 right-0 h-[calc(100vh-80px)] bg-background/95 backdrop-blur-2xl border-t flex flex-col p-6 animate-in slide-in-from-top-4 duration-300 z-40 overflow-y-auto">
            <nav className="flex flex-col space-y-6 text-xl font-bold tracking-tight">
              <Link 
                onClick={() => setIsMobileMenuOpen(false)} 
                href="/services" 
                className={`flex items-center justify-between pb-4 border-b border-border/50 transition-colors ${pathname.startsWith('/services') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'}`}
              >
                <span>Services</span>
                <svg className="h-6 w-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
              <Link 
                onClick={() => setIsMobileMenuOpen(false)} 
                href="/artisans" 
                className={`flex items-center justify-between pb-4 border-b border-border/50 transition-colors ${pathname.startsWith('/artisans') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'}`}
              >
                <span>Find Artisans</span>
                <svg className="h-6 w-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
              <Link 
                onClick={() => setIsMobileMenuOpen(false)} 
                href="/match" 
                className={`flex items-center justify-between pb-4 border-b border-border/50 transition-colors ${pathname.startsWith('/match') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'}`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                  AI Match
                </span>
                <svg className="h-6 w-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
              <Link 
                onClick={() => setIsMobileMenuOpen(false)} 
                href="/about" 
                className={`flex items-center justify-between pb-4 border-b border-border/50 transition-colors ${pathname.startsWith('/about') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'}`}
              >
                <span>Our Story</span>
                <svg className="h-6 w-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </nav>
            
            <div className="mt-auto pb-8 pt-8 space-y-6">
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center">
                <h3 className="font-bold text-lg mb-2">Ready to start?</h3>
                <p className="text-sm text-muted-foreground mb-4">Join thousands of users on ArtisanConnect.</p>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/register">
                  <Button className="w-full rounded-full font-bold h-12">Create Account</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by ArtisanConnect Inc. The source code is available on GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
}
