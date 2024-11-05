"use server"

import { encodedRedirect } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const token = formData.get("token")?.toString();

  if (!token) {
    return { error: "Invite token is required" };
  }

  const supabase = await createClient();

  // Verify invite token
  const { data: invite, error: inviteErr } = await supabase
    .from('invite_tokens')
    .select('*, organizations(*)')
    .eq('token', token)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!invite) {
    return { error: "Invalid or expired invite link" };
  }

  // Create user
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { data: { user }, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        organization_id: invite.organization_id,
        role: invite.role
      }
    }
  });

  if (error) return { error: error.message };

  // Mark invite as used
  await supabase
    .from('invite_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token);

  // We'll handle organization membership after email confirmation
  return { success: "Check your email to confirm your account" };
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  // Check if user exists and is part of an organization
  const { data: user } = await supabase
    .from('organization_members')
    .select('*, users:user_id(*)')
    .eq('auth.users.email', email)
    .single();

  if (!user) {
    // Return same message as success to prevent email enumeration
    return encodedRedirect(
      "success",
      "/forgot-password",
      "If an account exists with this email, you will receive a password reset link."
    );
  }

  // Add additional security token
  const securityCode = Math.random().toString(36).slice(-6).toUpperCase();

  // Store the security code with an expiration
  await supabase.from('password_resets')
    .insert({
      user_id: user.user_id,
      security_code: securityCode,
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
    });

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password&code=${securityCode}`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "If an account exists with this email, you will receive a password reset link."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const securityCode = formData.get("securityCode") as string;

  // Verify security code
  const { data: reset } = await supabase
    .from('password_resets')
    .select('*')
    .eq('security_code', securityCode)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!reset) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Invalid or expired security code"
    );
  }

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Password update failed",
    );
  }

  return encodedRedirect(
    "success",
    "/reset-password",
    "Password updated successfully"
  );
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};