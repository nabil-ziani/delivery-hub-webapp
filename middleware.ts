import { createClient } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { OrganizationMember } from '@/types';
const PUBLIC_ROUTES = ['/sign-in', '/reset-password', '/verify'];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

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

    // Get authenticated user data
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Check if user has completed onboarding and has a restaurant profile
    const { data: member } = await supabase
      .from('organization_members')
      .select(`
        role,
        organization:organizations (
          restaurant_profile:restaurant_profiles (*)
        )
      `)
      .eq('user_id', user.id)
      .returns<OrganizationMember[]>()
      .single()

    if (pathname === '/onboarding') {
      if (member?.organization?.restaurant_profile) {
        // Setup is complete, redirect to root
        return NextResponse.redirect(new URL('/', request.url));
      }
    } else if (!member || !member.organization?.restaurant_profile) {
      // If setup is incomplete and trying to access any other protected route
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
};
