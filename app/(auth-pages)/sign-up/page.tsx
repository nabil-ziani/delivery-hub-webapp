import Link from "next/link"
import Image from "next/image"

import { signUpAction } from "@/app/actions"
import { SignUpFormFields } from "@/components/auth/signup-form-fields"

import AuthForm from "@/components/auth/auth-form"
import { FormMessage, Message } from "@/components/form/form-message"

export default async function SignUpPage({ searchParams }: { searchParams: { token?: string; message?: string } & Message }) {

  // Show error message if present
  if (searchParams.message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={{ error: searchParams.message }} />
      </div>
    )
  }

  // If no token is provided, show access denied
  if (!searchParams.token) {
    return (
      <div className="flex h-screen w-screen flex-col justify-center space-y-6 sm:w-[350px] mx-auto">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Access Denied
          </h1>
          <p className="text-sm text-muted-foreground">
            You need an invitation link to sign up.
          </p>
        </div>
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
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to create your account
        </p>
      </div>

      <AuthForm action={signUpAction} schemaKey="signUp" submitText="Sign up">
        <input type="hidden" name="token" value={searchParams.token} />
        <SignUpFormFields />
      </AuthForm>
    </div>
  )
}