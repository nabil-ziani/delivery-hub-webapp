"use server"

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const WorkingHoursSchema = z.record(z.object({
    open: z.string(),
    close: z.string(),
}));

const OnboardingSchema = z.object({
    restaurantName: z.string().min(1, "Restaurant name is required"),
    description: z.string().optional(),
    phoneNumber: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    workingHours: WorkingHoursSchema,
});

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

        // TODO: Geocode address to get latitude/longitude
        // We can add this later using Google Maps or OpenStreetMap API

        return { success: true };
    } catch (error) {
        console.error("Onboarding error:", error);
        return { error: "Failed to complete onboarding" };
    }
}; 