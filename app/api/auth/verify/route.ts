import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  if (type !== 'invite' || !token) {
    return NextResponse.redirect(`${origin}/sign-in?error=Invalid verification link`);
  }

  const supabase = await createClient();

  // Verify the invite token
  const { error, data } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'invite',
  });

  if (error || !data.session) {
    console.error('Verification error:', error);
    return NextResponse.redirect(`${origin}/sign-in?error=Invalid or expired invite link`);
  }

  // Store verification status in session
  await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token
  });

  // Token is valid, redirect to update password
  return NextResponse.redirect(`${origin}/update-password?token=${token}&type=${type}`);
}