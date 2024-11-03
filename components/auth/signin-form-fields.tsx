"use client"

import { PasswordInput } from "../form/password-input"
import { useFormContext } from "react-hook-form"
import { TextInput } from "../form/text-input"

export function SignInFormFields() {
    const { control } = useFormContext()

    return (
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <TextInput
                control={control}
                name="email"
                label="Email"
                placeholder="you@example.com"
            />
            <PasswordInput
                control={control}
                name="password"
                label="Password"
                placeholder="********"
            />
        </div>
    )
}