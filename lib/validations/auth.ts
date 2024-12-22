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

export const schemas = {
    signIn: SignInSchema,
    signUp: SignUpSchema,
    resetPassword: ResetPasswordSchema,
    updatePassword: UpdatePasswordSchema
}