'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MessageBadge } from '@/components/notifications/MessageBadge';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar Skeleton */}
        <div className="hidden w-64 flex-col border-r bg-card md:flex p-6">
          <div className="h-8 w-3/4 bg-muted animate-pulse rounded-md mb-8"></div>
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded-md"></div>
            <div className="h-10 bg-muted animate-pulse rounded-md"></div>
            <div className="h-10 bg-muted animate-pulse rounded-md"></div>
          </div>
        </div>
        {/* Main Content Skeleton */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-20 items-center justify-between border-b px-6">
            <div className="h-8 w-48 bg-muted animate-pulse rounded-md"></div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
              <div className="h-10 w-32 bg-muted animate-pulse rounded-full"></div>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8 space-y-6">
            <div className="h-32 bg-muted animate-pulse rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-48 bg-muted animate-pulse rounded-xl"></div>
              <div className="h-48 bg-muted animate-pulse rounded-xl"></div>
              <div className="h-48 bg-muted animate-pulse rounded-xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const initials = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name?.[0] || ''}`
    : user?.email?.[0]?.toUpperCase() || 'U';

  const displayName = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
    : user?.email || 'User';

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-muted/20">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-transform md:sticky md:block ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex h-20 items-center border-b px-6 gap-3">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg">A</div>
          <Link href="/" className="flex items-center font-bold text-xl tracking-tight">
            Artisan<span className="text-primary">Connect</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link href="/dashboard" className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'bg-primary/10 text-primary' : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'}`}>
            <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Overview
          </Link>
          <Link href="/dashboard/requests" className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname.startsWith('/dashboard/requests') ? 'bg-primary/10 text-primary' : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'}`}>
            <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            My Requests
          </Link>
          <Link href="/dashboard/messages" className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname.startsWith('/dashboard/messages') ? 'bg-primary/10 text-primary' : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'}`}>
            <svg className="mr-3 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            Messages
            <MessageBadge />
          </Link>
          <Link href="/dashboard/profile" className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname.startsWith('/dashboard/profile') ? 'bg-primary/10 text-primary' : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'}`}>
            <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Profile Settings
          </Link>
          {user?.user_metadata?.role === 'ARTISAN' && (
            <Link href="/dashboard/identity" className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname.startsWith('/dashboard/identity') ? 'bg-primary/10 text-primary' : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'}`}>
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Identity Verification
            </Link>
          )}

          <div className="my-2 border-t border-border/50"></div>

          <Link href="/" className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground">
            <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Back to Homepage
          </Link>
        </nav>

        {/* Logout at bottom of sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 shadow-sm z-40 sticky top-0">
          <button
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-3 bg-muted/50 p-1.5 pr-4 rounded-full border">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-inner shrink-0">
                {initials}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-semibold leading-none">{displayName}</span>
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider leading-none mt-1.5">
                  {user?.user_metadata?.role || 'CUSTOMER'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
