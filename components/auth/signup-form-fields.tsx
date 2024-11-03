"use client"

import { PasswordInput } from "@/components/form/password-input"
import { TextInput } from "@/components/form/text-input"
import { Control } from "react-hook-form"

interface SignUpFormFieldsProps {
    control?: Control<any>
}

export function SignUpFormFields({ control }: SignUpFormFieldsProps) {
    return (
        <div className="grid gap-4">
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