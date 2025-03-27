import { RestaurantProfile } from "@prisma/client";
import type { SVGProps } from "react";
import { Database } from "./database.types";

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

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};