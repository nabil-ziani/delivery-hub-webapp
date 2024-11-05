"use client"

import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { Form } from '../ui/form'
import { schemas } from '@/lib/validations/auth'
import { SubmitButton } from '../form/submit-button'

interface AuthFormProps {
    schemaKey: keyof typeof schemas
    action: (formData: FormData) => Promise<Response | { error: string } | { redirect: string }>
    submitText: string
    children: ReactNode
    initialValues?: Record<string, string>
}

const AuthForm = ({ children, action, schemaKey, submitText, initialValues = {} }: AuthFormProps) => {
    const { toast } = useToast()
    const router = useRouter()

    const schema = schemas[schemaKey]
    const defaultValues = Object.keys(schema instanceof z.ZodEffects ? schema._def.schema.shape : schema.shape).reduce((acc, key) => ({
        ...acc,
        [key]: initialValues[key] || ''
    }), {})

    console.log(defaultValues)

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues
    })

    const onSubmit = async (data: z.infer<typeof schema>) => {
        const formData = new FormData()

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string)
        })

        try {
            const response = await action(formData)

            if (response instanceof Response && response.redirected) {
                router.push(response.url)
                return
            }

            if ('error' in response) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: response.error,
                })
                return
            }

            if ('redirect' in response) {
                router.push(response.redirect)
                return
            }

            router.push('/')
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Something went wrong",
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {children}
                <SubmitButton pendingText="Loading...">
                    {submitText}
                </SubmitButton>
            </form>
        </Form>
    )
}

export default AuthForm