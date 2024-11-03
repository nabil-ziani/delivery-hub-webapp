'use client'

import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "../ui/button"
import { Control } from "react-hook-form"
import { FormField, FormMessage } from "../ui/form"
import { FormItem } from "../ui/form"
import { FormLabel } from "../ui/form"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
    control: Control<any>
    label?: string
}

export function PasswordInput({ error, ...props }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    const { control, name, label } = props

    return (
        <div className="relative">
            <FormField
                control={control}
                name={name!}
                render={({ field }) => (
                    <FormItem className="flex-1">
                        {label && (
                            <FormLabel className="shad-input-label">{label}</FormLabel>
                        )}
                        <Input
                            {...field}
                            {...props}
                            type={showPassword ? "text" : "password"}
                            className={`pr-10 ${error ? 'border-red-500' : ''}`}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="sr-only">
                                {showPassword ? "Hide password" : "Show password"}
                            </span>
                        </Button>

                        <FormMessage className="shad-error" />
                    </FormItem>
                )}
            />
        </div>
    )
}