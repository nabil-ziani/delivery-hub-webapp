"use client"

import { PasswordInput } from "@/components/form/password-input"
import { useFormContext } from "react-hook-form"

export function ResetPasswordFields() {
    const { control } = useFormContext()

    return (
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <PasswordInput
                control={control}
                name="password"
                label="New Password"
                placeholder="Enter your new password"
            />
            <PasswordInput
                control={control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your new password"
            />
        </div>
    )
}
