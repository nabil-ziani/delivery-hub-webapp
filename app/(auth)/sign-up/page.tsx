"use server"

import Link from "next/link"
import Image from "next/image"
import { signUpAction } from "@/app/actions"
import { SignUpFormFields } from "@/components/auth/signup-form-fields"
import AuthForm from "@/components/auth/auth-form"
import { FormMessage, Message } from "@/components/form/form-message"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SignUpPage({ searchParams }: { searchParams: Promise<Message> }) {
  const message = await searchParams

  if ("message" in message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={message} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
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
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Join us to manage your restaurant deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm action={signUpAction} schemaKey="signUp" submitText="Create account">
            <SignUpFormFields />
          </AuthForm>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground text-center w-full">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}