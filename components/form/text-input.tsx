'use client'

import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { FormField, FormMessage } from "../ui/form"
import { FormItem } from "../ui/form"
import { FormLabel } from "../ui/form"

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
    control: Control<any>
    label?: string
}

export function TextInput({ error, ...props }: TextInputProps) {
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
                            type="text"
                            className={`pr-10 ${error ? 'border-red-500' : ''}`}
                        />
                        <FormMessage className="shad-error" />
                    </FormItem>
                )}
            />
        </div>
    )
}