"use server"

import Link from "next/link"
import Image from "next/image"
import { signInAction } from "@/app/actions"
import { SignInFormFields } from "@/components/auth/signin-form-fields"
import AuthForm from "@/components/auth/auth-form"
import { FormMessage, Message } from "@/components/form/form-message"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SignInPage({ searchParams }: { searchParams: Promise<Message> }) {
  const message = await searchParams

  if ("message" in message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={message} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/70 dark:bg-gray-900/50 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-200">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="relative w-16 h-16 mb-2">
              <Image
                src="/logo.png"
                fill
                alt="Logo"
                className="object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">Welcome back!</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm action={signInAction} schemaKey="signIn" submitText="Sign in">
            <SignInFormFields />
          </AuthForm>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}