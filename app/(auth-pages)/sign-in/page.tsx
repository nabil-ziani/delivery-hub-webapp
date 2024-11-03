"use server"

import AuthForm from "@/components/auth-form"
import { signInAction } from "@/app/actions"
import Link from "next/link"
import Image from "next/image"
import { SignInFormFields } from "@/components/signin-fields"

export default async function SignInPage() {
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
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in
        </p>
      </div>
      <AuthForm action={signInAction} schemaKey="signIn" submitText="Sign in">
        <SignInFormFields />
      </AuthForm>

      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link href="/forgot-password" className="hover:text-brand underline underline-offset-4">
          Forgot password?
        </Link>
      </p>
    </div>
  )
}