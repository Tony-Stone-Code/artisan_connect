'use client';

import { useState } from 'react';
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

          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-10 md:py-12 pb-28 md:pb-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">A</div>
                <span className="font-bold text-lg tracking-tight">Artisan<span className="text-primary">Connect</span></span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ghana&apos;s trusted marketplace for verified skilled professionals.
              </p>
            </div>

            {/* Platform */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
                <li><Link href="/artisans" className="hover:text-primary transition-colors">Find Artisans</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider">Account</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/register" className="hover:text-primary transition-colors">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} ArtisanConnect. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built by <a href="https://gammacube.vercel.app" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-primary transition-colors">GammaCube</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Rigid Corporate Vibe) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t-2 border-border flex items-center justify-around pb-safe pt-1 shadow-none">
        <Link href="/" className={`flex flex-col items-center p-2 ${pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Home</span>
        </Link>
        <Link href="/services" className={`flex flex-col items-center p-2 ${pathname.startsWith('/services') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Briefcase className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Services</span>
        </Link>
        
        {/* Prominent Center Search Button */}
        <Link href="/artisans" className="flex flex-col items-center -mt-6">
          <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center border-4 border-background shadow-none rounded-none">
            <Search className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-semibold tracking-wider uppercase mt-1 ${pathname.startsWith('/artisans') ? 'text-primary' : 'text-muted-foreground'}`}>Search</span>
        </Link>
        
        <Link href="/about" className={`flex flex-col items-center p-2 ${pathname.startsWith('/about') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Info className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">About</span>
        </Link>

        {user ? (
          <Link href={user.user_metadata?.role === 'ADMIN' || user.user_metadata?.role === 'SUPERADMIN' ? "/admin" : "/dashboard"} className={`flex flex-col items-center p-2 ${pathname.startsWith('/dashboard') || pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <UserIcon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-semibold tracking-wider uppercase">Profile</span>
          </Link>
        ) : (
          <Link href="/login" className={`flex flex-col items-center p-2 ${pathname.startsWith('/login') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <UserIcon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-semibold tracking-wider uppercase">Log In</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
