'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MessageBadge } from '@/components/notifications/MessageBadge';
import { 
  LayoutDashboard, 
  ClipboardList, 
  MessageSquare, 
  User, 
  ShieldCheck, 
  ShieldAlert,
  LogOut, 
  Menu, 
  ArrowLeft,
  X
} from 'lucide-react';

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
          <div className="h-8 w-3/4 bg-muted animate-pulse mb-8" />
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse" />
            <div className="h-10 bg-muted animate-pulse" />
            <div className="h-10 bg-muted animate-pulse" />
          </div>
        </div>
        {/* Main Content Skeleton */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b px-6">
            <div className="h-8 w-48 bg-muted animate-pulse" />
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-muted animate-pulse" />
              <div className="h-10 w-32 bg-muted animate-pulse" />
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8 space-y-6">
            <div className="h-28 bg-muted animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="h-32 bg-muted animate-pulse" />
              <div className="h-32 bg-muted animate-pulse" />
              <div className="h-32 bg-muted animate-pulse" />
              <div className="h-32 bg-muted animate-pulse" />
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

  const userRole = user?.user_metadata?.role || 'CUSTOMER';
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-border bg-card transition-transform md:sticky md:block ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight">
            <div className="w-7 h-7 bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">A</div>
            <span>Artisan<span className="text-primary">Connect</span></span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1.5 p-4">
          <Link 
            href="/dashboard" 
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              pathname === '/dashboard' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="mr-3 h-4 w-4 shrink-0" />
            Overview
          </Link>

          <Link 
            href="/dashboard/requests" 
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              pathname.startsWith('/dashboard/requests') 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <ClipboardList className="mr-3 h-4 w-4 shrink-0" />
            {userRole === 'ARTISAN' ? 'Job Requests' : 'My Requests'}
          </Link>

          <Link 
            href="/dashboard/messages" 
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              pathname.startsWith('/dashboard/messages') 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <div className="flex items-center">
              <MessageSquare className="mr-3 h-4 w-4 shrink-0" />
              <span>Messages</span>
            </div>
            <MessageBadge />
          </Link>

          <Link 
            href="/dashboard/profile" 
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              pathname.startsWith('/dashboard/profile') 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <User className="mr-3 h-4 w-4 shrink-0" />
            Profile &amp; Settings
          </Link>

          {userRole === 'ARTISAN' && (
            <Link 
              href="/dashboard/identity" 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                pathname.startsWith('/dashboard/identity') 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <ShieldCheck className="mr-3 h-4 w-4 shrink-0 text-primary" />
              Ghana Card Verification
            </Link>
          )}

          {isAdmin && (
            <>
              <div className="my-2 border-t border-border/70 pt-2">
                <span className="px-3 text-[10px] font-black uppercase tracking-widest text-primary">
                  Administration
                </span>
              </div>
              <Link 
                href="/admin" 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  pathname.startsWith('/admin') 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <ShieldAlert className="mr-3 h-4 w-4 shrink-0 text-amber-500" />
                Admin Portal
              </Link>
            </>
          )}

          <div className="my-2 border-t border-border/70" />

          <Link 
            href="/" 
            className="flex items-center px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-3 h-4 w-4 shrink-0" />
            Back to Marketplace
          </Link>
        </nav>

        {/* Logout at bottom of sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
          >
            <LogOut className="mr-2.5 h-4 w-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6 z-40 sticky top-0">
          <button
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-1 items-center justify-end space-x-3">
            <ThemeToggle />
            <div className="flex items-center space-x-3 bg-muted/60 p-1.5 pr-3 border border-border/80">
              <div className="h-8 w-8 bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs shrink-0">
                {initials}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-foreground leading-none">{displayName}</span>
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider leading-none mt-1">
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
