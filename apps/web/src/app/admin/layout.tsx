'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else {
        const role = user.user_metadata?.role;
        if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
          router.push('/dashboard');
        }
      }
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || (user.user_metadata?.role !== 'ADMIN' && user.user_metadata?.role !== 'SUPERADMIN')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const displayName = user?.user_metadata?.first_name 
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
    : user?.email;

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-20 items-center border-b border-border px-6 gap-3">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">
            A
          </div>
          <Link href="/" className="flex items-center font-bold text-xl tracking-tight text-foreground">
            Admin<span className="text-primary">Panel</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link href="/admin" className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === '/admin' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            Dashboard
          </Link>
          <Link href="/admin/verification" className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname.startsWith('/admin/verification') ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            ID Verification
          </Link>
          <Link href="/admin/users" className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname.startsWith('/admin/users') ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            Users
          </Link>
          <Link href="/admin/reports" className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname.startsWith('/admin/reports') ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            Reports
          </Link>
          <div className="my-2 border-t border-border"></div>
          <Link href="/" className="rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground">
            Back to Homepage
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-6 sticky top-0 z-40">
          <div className="flex items-center">
            <span className="font-semibold text-foreground">SuperAdmin Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-3 bg-muted p-1.5 pr-4 rounded-full border border-border">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-inner">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="text-sm font-semibold text-foreground">{displayName}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
