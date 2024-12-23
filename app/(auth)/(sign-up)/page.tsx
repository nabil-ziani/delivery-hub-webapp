import { Suspense } from "react"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import SignUpForm from "@/components/auth/signup-form"

export default async function SignUpPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignUpForm />
    </Suspense>
  )
}