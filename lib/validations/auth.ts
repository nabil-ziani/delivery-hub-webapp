import * as z from "zod"

export const SignInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

export const SignUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export const ResetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
})

export const UpdatePasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

// Onboarding validation schemas
export const RestaurantDetailsSchema = z.object({
    restaurantName: z.string().min(1, "Restaurant name is required"),
    description: z.string().optional(),
    logo: z.any().optional(), // We'll validate the file type/size in the component
});

export const ContactInfoSchema = z.object({
    phoneNumber: z.string()
        .min(1, "Phone number is required")
        .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Invalid phone number format"),
    email: z.string().email("Invalid email address"),
});

export const LocationSchema = z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string()
        .min(1, "Postal code is required")
        .regex(/^[0-9]{4}$/, "Invalid postal code format (e.g. 1000, 2000, 3000)"),
});

const TimeSchema = z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)");

const DayScheduleSchema = z.object({
    isOpen: z.boolean(),
    open: TimeSchema,
    close: TimeSchema,
});

export const WorkingHoursSchema = z.object({
    monday: DayScheduleSchema,
    tuesday: DayScheduleSchema,
    wednesday: DayScheduleSchema,
    thursday: DayScheduleSchema,
    friday: DayScheduleSchema,
    saturday: DayScheduleSchema,
    sunday: DayScheduleSchema,
}).refine((data) => {
    // Ensure at least one day is open
    return Object.values(data).some(day => day.isOpen);
}, {
    message: "At least one day must be open",
});

// Validation schema for end of onboarding (check for all fields)
export const OnboardingSchema = z.object({
    restaurantName: z.string().min(1, "Restaurant name is required"),
    description: z.string().optional(),
    phoneNumber: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    workingHours: WorkingHoursSchema,
});

export const schemas = {
    signIn: SignInSchema,
    signUp: SignUpSchema,
    resetPassword: ResetPasswordSchema,
    updatePassword: UpdatePasswordSchema,
    onboarding: {
        restaurantDetails: RestaurantDetailsSchema,
        contactInfo: ContactInfoSchema,
        location: LocationSchema,
        workingHours: WorkingHoursSchema,
    }
}