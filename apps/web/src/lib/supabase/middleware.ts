import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Avoid calling auth.getUser() between client creation and session refresh.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Protected routes: /dashboard and /admin require authenticated session
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');

  if (!user && (isDashboardRoute || isAdminRoute)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(redirectUrl);
    // Copy updated cookies to redirect response
    request.cookies.getAll().forEach((c) => response.cookies.set(c.name, c.value));
    return response;
  }

  // 2. Admin routes require ADMIN or SUPERADMIN role
  if (user && isAdminRoute) {
    const userRole = user.user_metadata?.role;
    if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      const response = NextResponse.redirect(redirectUrl);
      request.cookies.getAll().forEach((c) => response.cookies.set(c.name, c.value));
      return response;
    }
  }

  // 3. Auth routes (/login, /register): if already signed in, redirect to dashboard
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  if (user && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    const response = NextResponse.redirect(redirectUrl);
    request.cookies.getAll().forEach((c) => response.cookies.set(c.name, c.value));
    return response;
  }

  return supabaseResponse;
}
