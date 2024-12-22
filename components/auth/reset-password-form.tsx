"use client"

import { Button, Input, Form } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export function ResetPasswordForm() {
    // TODO: Add forgot password action
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("handleSubmit");
    };

    return (
        <div className="flex h-full  w-full flex-col items-center justify-center">
            <div className="flex flex-col items-center pb-6">
                <img
                    src="/logo.png"
                    width={50}
                    height={50}
                    alt="Logo"
                    className="mx-auto"
                />
                <p className="text-xl font-medium">Reset Password</p>
                <p className="text-small text-default-500">
                    Enter your email and we'll send you a password reset link
                </p>
            </div>
            <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
                <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
                    <Input isRequired label="Email Address" name="email" type="email" variant="bordered" />
                    <Button
                        className="w-full"
                        color="primary"
                        startContent={
                            <Icon className="pointer-events-none text-2xl" icon="solar:letter-bold" />
                        }
                        type="submit"
                    >
                        Reset Password
                    </Button>
                </Form>
            </div>
        </div>
    )
} 