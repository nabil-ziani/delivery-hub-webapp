import Link from "next/link"
import Image from "next/image"

import { forgotPasswordAction } from "@/app/actions"
import { ForgotPasswordFields } from "@/components/auth/forgot-password-fields"
import AuthForm from "@/components/auth/auth-form"
import { FormMessage, Message } from "@/components/form/form-message"

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<Message> }) {
  const message = await searchParams

  if ("message" in message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={message} />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen flex-col justify-center space-y-6 sm:w-[350px] mx-auto">
      <div className="flex flex-col space-y-2 text-center">
        <Image
          src="/logo.png"
          width={50}
          height={50}
          alt="Logo"
          className="mx-auto"
        />
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to reset your password
        </p>
      </div>

      <AuthForm action={forgotPasswordAction} schemaKey="resetPassword" submitText="Send Reset Link">
        <ForgotPasswordFields />
      </AuthForm>

      <FormMessage message={message} />

      <p className="px-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/sign-in" className="hover:text-brand underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  )
}
