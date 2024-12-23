import { Suspense } from "react"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import SignInForm from "@/components/auth/sign-in-form"

export default async function SignInPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignInForm />
    </Suspense>
  )
}