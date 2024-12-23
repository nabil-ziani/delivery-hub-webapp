"use server"

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInSchema, ResetPasswordSchema, UpdatePasswordSchema, OnboardingSchema } from "@/lib/validations/auth";
import { AuthResponse } from "@/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export const resetPasswordAction = async (formData: FormData): Promise<AuthResponse> => {
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

export const updatePasswordAction = async (formData: FormData): Promise<AuthResponse> => {
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";
    const securityCode = formData.get("securityCode")?.toString();

    console.log('Attempting to verify token:', securityCode);
    console.log('Token length:', securityCode?.length);

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
            // For invite flow, get the existing session
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                return { error: "Invalid or expired invite link" };
            }

            // Get the current user from the session
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

            return { success: true, redirectTo: "/sign-in" };
        }

        // For invite flow, redirect to onboarding
        return { success: true, redirectTo: "/onboarding" };
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

export const completeOnboardingAction = async (formData: FormData) => {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        // Get form data
        const data = {
            restaurantName: formData.get("restaurantName")?.toString() || "",
            description: formData.get("description")?.toString() || "",
            phoneNumber: formData.get("phoneNumber")?.toString() || "",
            email: formData.get("email")?.toString() || "",
            address: formData.get("address")?.toString() || "",
            city: formData.get("city")?.toString() || "",
            postalCode: formData.get("postalCode")?.toString() || "",
            workingHours: JSON.parse(formData.get("workingHours")?.toString() || "{}"),
        };

        // Get logo file if present
        const logo = formData.get("logo") as File | null;

        // Validate input
        const result = OnboardingSchema.safeParse(data);
        if (!result.success) {
            const error = result.error.issues[0];
            return { error: error.message };
        }

        // Get the organization for this user
        const member = await prisma.organizationMember.findFirst({
            where: {
                userId: session.user.id,
            },
            include: {
                organization: true,
            },
        });

        if (!member) {
            return { error: "Organization not found" };
        }

        // Upload logo if present
        let logoUrl: string | undefined;
        if (logo) {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("restaurant-logos")
                .upload(`${member.organizationId}/logo`, logo, {
                    upsert: true,
                });

            if (uploadError) {
                console.error("Logo upload error:", uploadError);
                return { error: "Failed to upload logo" };
            }

            const { data: { publicUrl } } = supabase.storage
                .from("restaurant-logos")
                .getPublicUrl(uploadData.path);

            logoUrl = publicUrl;
        }

        // Update organization name
        await prisma.organization.update({
            where: {
                id: member.organizationId,
            },
            data: {
                name: data.restaurantName,
            },
        });

        // Create or update restaurant profile
        await prisma.restaurantProfile.upsert({
            where: {
                organizationId: member.organizationId,
            },
            create: {
                organizationId: member.organizationId,
                phoneNumber: data.phoneNumber,
                email: data.email,
                address: data.address,
                city: data.city,
                postalCode: data.postalCode,
                settings: {
                    description: data.description,
                    logo: logoUrl,
                    deliveryRadius: 5000, // 5km default
                    workingHours: data.workingHours,
                },
            },
            update: {
                phoneNumber: data.phoneNumber,
                email: data.email,
                address: data.address,
                city: data.city,
                postalCode: data.postalCode,
                settings: {
                    description: data.description,
                    logo: logoUrl,
                    workingHours: data.workingHours,
                },
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Onboarding error:", error);
        return { error: "Failed to complete onboarding" };
    }
}; 