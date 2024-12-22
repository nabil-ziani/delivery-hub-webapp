import { UpdatePasswordForm } from "@/components/auth/update-password-form"
import { Suspense } from "react"
import { Spinner } from "@nextui-org/react"

export default async function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <UpdatePasswordForm />
    </Suspense>
  )
}
