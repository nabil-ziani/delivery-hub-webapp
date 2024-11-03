import Image from "next/image"

import { resetPasswordAction } from "@/app/actions"
import { ResetPasswordFields } from "@/components/auth/reset-password-fields"
import AuthForm from "@/components/auth/auth-form"
import { FormMessage, Message } from "@/components/form/form-message"

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<Message> }) {
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
          Enter your new password below
        </p>
      </div>

      <AuthForm action={resetPasswordAction} schemaKey="updatePassword" submitText="Reset Password">
        <ResetPasswordFields />
      </AuthForm>

      <FormMessage message={message} />
    </div>
  )
}
