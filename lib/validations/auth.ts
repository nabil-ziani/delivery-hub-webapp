import * as z from "zod"

export const SignInSchema = z.object({
    email: z.string().min(1, { message: 'Field is required' }).email({ message: 'Invalid email' }),
    password: z.string().min(8, { message: "Password too short, 8 characters required" }),
})

export const SignUpSchema = z.object({
    email: z.string().min(1, { message: 'Field is required' }).email({ message: 'Invalid email' }),
    password: z.string().min(8, { message: "Password too short, 8 characters required" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export const ResetPasswordSchema = z.object({
    email: z.string().min(1, { message: 'Field is required' }).email({ message: "Email is required" }),
})

export const UpdatePasswordSchema = z.object({
    password: z.string().min(8, { message: "Password too short, 8 characters required" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export const schemas = {
    signIn: SignInSchema,
    signUp: SignUpSchema,
    resetPassword: ResetPasswordSchema,
    updatePassword: UpdatePasswordSchema
}