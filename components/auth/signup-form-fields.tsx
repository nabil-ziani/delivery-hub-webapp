"use client"

import { PasswordInput } from "../form/password-input"
import { useFormContext } from "react-hook-form"
import { TextInput } from "../form/text-input"

export function SignUpFormFields({ token }: { token: string }) {
    const { control } = useFormContext()

    return (
        <div className="grid gap-4">
            <input type="hidden" name="token" value={token} />
            <TextInput
                control={control!}
                name="email"
                label="Email"
                type="email"
                placeholder="name@example.com"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
            />
            <PasswordInput
                control={control!}
                name="password"
                label="Password"
                placeholder="Enter your password"
            />
            <PasswordInput
                control={control!}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
            />
        </div>
    )
}