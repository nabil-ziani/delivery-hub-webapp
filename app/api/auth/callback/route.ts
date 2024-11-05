import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(`${origin}/sign-in?error=Failed to verify email`);
    }

    // Redirect to onboarding after successful verification
    return NextResponse.redirect(`${origin}/onboarding`);
  }

  // Fallback redirect
  return NextResponse.redirect(`${origin}/sign-in`);
}
