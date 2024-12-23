"use client"

import React from "react";
import { Button, Input, Form } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { resetPasswordAction } from "@/actions/auth";
import toast from "react-hot-toast";
import Heading from "./heading";

export function ResetPasswordForm() {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            const result = await resetPasswordAction(formData);

            if (result && "error" in result) {
                toast.error(result.error);
            } else {
                toast.success("If an account exists with this email, you will receive a password reset link.");
            }
        } catch (error) {
            toast.error("An error occurred while processing your request");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <Heading title="Reset Password" description="Enter your email and we'll send you a password reset link" />

            <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
                <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
                    <Input
                        isRequired
                        label="Email Address"
                        name="email"
                        type="email"
                        variant="bordered"
                        isDisabled={isLoading}
                    />
                    <Button
                        className="w-full"
                        color="primary"
                        startContent={
                            <Icon className="pointer-events-none text-2xl" icon="solar:letter-bold" />
                        }
                        type="submit"
                        isLoading={isLoading}
                    >
                        Reset Password
                    </Button>
                </Form>
            </div>
        </div>
    );
} 