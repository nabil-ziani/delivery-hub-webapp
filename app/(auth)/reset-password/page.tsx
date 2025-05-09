import { Suspense } from "react"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default async function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordForm />
    </Suspense>
  )
}