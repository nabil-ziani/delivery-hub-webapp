import { createClient } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/sign-in', '/sign-up', '/reset-password'];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Handle Supabase invite URLs
  if (pathname === '/verify' && searchParams.get('type') === 'invite') {
    // Keep all query parameters when redirecting
    return NextResponse.redirect(new URL(`/sign-up?${searchParams.toString()}`, request.url));
  }

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check authentication for all other routes
  try {
    const supabase = createClient(request);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Special case for onboarding
    if (pathname === '/onboarding') {
      const { data: member } = await supabase
        .from('organization_members')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (member) {
        // User already completed onboarding, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Check admin access
    if (pathname.startsWith('/admin')) {
      const { data: member } = await supabase
        .from('organization_members')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (!member || member.role !== 'owner') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png (logo file)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
};
