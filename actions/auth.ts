"use server"

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInSchema, SignUpSchema, ResetPasswordSchema, UpdatePasswordSchema } from "@/lib/validations/auth";
import { AuthResponse } from "@/types";

export const signUpAction = async (formData: FormData): Promise<AuthResponse> => {
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    try {
        const result = SignUpSchema.safeParse({ email, password, confirmPassword });
        if (!result.success) {
            const error = result.error.issues[0];
            return { error: error.message };
        }

        const supabase = await createClient();

        // Sign up with Supabase
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`
            }
        });

        if (error) return { error: error.message };

        return {
            success: true,
            message: "Account created! Please check your email to verify your account."
        };
    } catch (error) {
        return { error: "An unexpected error occurred" };
    }
};

export const signInAction = async (formData: FormData): Promise<AuthResponse> => {
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    try {
        const result = SignInSchema.safeParse({ email, password });
        if (!result.success) {
            const error = result.error.issues[0];
            return { error: error.message };
        }

        const supabase = await createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        console.log(error);

        if (error) {
            return { error: error.message };
        }

        return redirect("/");
    } catch (error) {
        return { error: "An unexpected error occurred" };
    }
};

export const forgotPasswordAction = async (formData: FormData): Promise<AuthResponse> => {
    const email = formData.get("email")?.toString() || "";

    try {
        const result = ResetPasswordSchema.safeParse({ email });
        if (!result.success) {
            const error = result.error.issues[0];
            return { error: error.message };
        }

        const supabase = await createClient();
        const origin = (await headers()).get("origin") || process.env.NEXT_PUBLIC_SITE_URL;

        // Check if user exists and is part of an organization
        const { data: user } = await supabase
            .from('organization_members')
            .select('*, users:user_id(*)')
            .eq('auth.users.email', email)
            .single();

        if (!user) {
            return {
                success: true,
                message: "If an account exists with this email, you will receive a password reset link."
            };
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
            redirectTo: `${origin}/api/auth/callback?redirect_to=/reset-password&code=${securityCode}`,
        });

        if (error) {
            console.error(error.message);
            return { error: "Could not reset password" };
        }

        return {
            success: true,
            message: "If an account exists with this email, you will receive a password reset link."
        };
    } catch (error) {
        return { error: "An unexpected error occurred" };
    }
};

export const resetPasswordAction = async (formData: FormData): Promise<AuthResponse> => {
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";
    const securityCode = formData.get("securityCode")?.toString();

    if (!securityCode) {
        return { error: "Security code is required" };
    }

    try {
        const result = UpdatePasswordSchema.safeParse({ password, confirmPassword });
        if (!result.success) {
            const error = result.error.issues[0];
            return { error: error.message };
        }

        const supabase = await createClient();

        // Verify security code
        const { data: reset } = await supabase
            .from('password_resets')
            .select('*')
            .eq('security_code', securityCode)
            .is('used_at', null)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (!reset) {
            return { error: "Invalid or expired security code" };
        }

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            return { error: "Password update failed" };
        }

        // Mark security code as used
        await supabase
            .from('password_resets')
            .update({ used_at: new Date().toISOString() })
            .eq('security_code', securityCode);

        return {
            success: true,
            message: "Password updated successfully"
        };
    } catch (error) {
        return { error: "An unexpected error occurred" };
    }
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
};