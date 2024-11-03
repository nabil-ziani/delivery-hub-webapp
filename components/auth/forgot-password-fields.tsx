"use client"

import { TextInput } from "@/components/form/text-input"
import { useFormContext } from "react-hook-form"

export function ForgotPasswordFields() {
    const { control } = useFormContext()

    return (
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <TextInput
                control={control}
                name="email"
                label="Email"
                type="email"
                placeholder="name@example.com"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
            />
        </div>
    )
} 