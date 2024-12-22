import { createClient } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/sign-in', '/sign-up', '/reset-password', '/verify', '/update-password'];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Handle Supabase invite URLs
  if (pathname === '/verify' && searchParams.get('type') === 'invite') {
    // Keep all query parameters when redirecting
    return NextResponse.redirect(new URL(`/update-password?${searchParams.toString()}`, request.url));
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

    // Check if user has completed onboarding
    const { data: member } = await supabase
      .from('organization_members')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    // Special case for onboarding
    if (pathname === '/onboarding') {
      if (member) {
        // User already completed onboarding, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else if (!member && pathname !== '/onboarding') {
      // If user hasn't completed onboarding and tries to access any other protected route
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // Check admin access
    if (pathname.startsWith('/admin')) {
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
