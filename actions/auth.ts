"use server"

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInSchema, SignUpSchema, ResetPasswordSchema, UpdatePasswordSchema } from "@/lib/validations/auth";
import { AuthResponse } from "@/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        const { data: { user }, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`
            }
        });

        if (error) return { error: error.message };

        // Create organization and member
        if (user) {
            try {
                // Create organization
                const organization = await prisma.organization.create({
                    data: {
                        name: "New Restaurant", // This will be updated during onboarding
                        members: {
                            create: {
                                userId: user.id,
                                role: "owner"
                            }
                        }
                    }
                });
            } catch (dbError) {
                console.error("Failed to create organization:", dbError);
                // Don't return error to user as they are already signed up
            }
        }

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

        // First try to verify if this is a password reset
        const { data: reset } = await supabase
            .from('password_resets')
            .select('*')
            .eq('security_code', securityCode)
            .is('used_at', null)
            .gt('expires_at', new Date().toISOString())
            .single();

        // Handle invite token first to establish session
        if (!reset) {
            // Exchange the token for a session
            const { error: sessionError } = await supabase.auth.verifyOtp({
                token_hash: securityCode,
                type: 'invite',
            });

            if (sessionError) {
                return { error: "Invalid invite link" };
            }

            // Get the current user after verifying OTP
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                try {
                    // Check if organization already exists for this user
                    const existingMember = await prisma.organizationMember.findFirst({
                        where: { userId: user.id }
                    });

                    if (!existingMember) {
                        // Create organization for invited user
                        await prisma.organization.create({
                            data: {
                                name: "New Restaurant", // Will be updated during onboarding
                                members: {
                                    create: {
                                        userId: user.id,
                                        role: "owner"
                                    }
                                }
                            }
                        });
                    }
                } catch (dbError) {
                    console.error("Failed to create organization:", dbError);
                }
            }
        }

        // Now that we have a session (either from invite or existing), update the password
        const { error: updateError } = await supabase.auth.updateUser({
            password: password,
        });

        if (updateError) {
            return { error: "Password update failed" };
        }

        // If it was a password reset, mark the code as used
        if (reset) {
            await supabase
                .from('password_resets')
                .update({ used_at: new Date().toISOString() })
                .eq('security_code', securityCode);

            return redirect("/sign-in");
        }

        // For invite flow, redirect to onboarding
        return redirect("/onboarding");
    } catch (error) {
        console.error('Reset password error:', error);
        return { error: "An unexpected error occurred" };
    }
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
};