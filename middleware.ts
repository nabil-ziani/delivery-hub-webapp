import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  /**
   * const supabase = createClient(request);
   * const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        const isProtectedRoute = !request.nextUrl.pathname.startsWith('/sign-in') &&
          !request.nextUrl.pathname.startsWith('/reset-password') &&
          !request.nextUrl.pathname.startsWith('/api/auth');

        if (isProtectedRoute) {
          return NextResponse.redirect(new URL('/sign-in', request.url));
        }
      }
   * 
   */

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
};
