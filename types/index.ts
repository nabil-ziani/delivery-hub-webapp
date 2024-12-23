import { RestaurantProfile } from "@prisma/client";

export type AuthResponse = {
    error: string;
} | {
    success: true;
    message?: string;
    redirectTo?: string;
} | void;

export type OrganizationMember = {
    role: string;
    organization: {
        restaurant_profile: RestaurantProfile;
    };
}
