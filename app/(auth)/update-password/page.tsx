import { UpdatePasswordForm } from "@/components/auth/update-password-form"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default async function UpdatePasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UpdatePasswordForm />
    </Suspense>
  )
}
