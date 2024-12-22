"use client"

import React from "react";
import { Button, Input, Form } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { resetPasswordAction } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Heading from "./heading";

export function UpdatePasswordForm() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const searchParams = useSearchParams();

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            const code = searchParams.get("code");

            if (!code) {
                toast.error("Invalid reset link");
                return;
            }

            formData.append("securityCode", code);
            const result = await resetPasswordAction(formData);

            if (result && "error" in result) {
                toast.error(result.error);
            } else {
                toast.success("Password updated successfully! You can now sign in with your new password.");
            }
        } catch (error) {
            toast.error("An error occurred while updating your password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <Heading title="Update Password" description="Enter your new password" />

            <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
                <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
                    <Input
                        isRequired
                        endContent={
                            <button type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <Icon
                                        className="pointer-events-none text-2xl text-default-400"
                                        icon="solar:eye-closed-linear"
                                    />
                                ) : (
                                    <Icon
                                        className="pointer-events-none text-2xl text-default-400"
                                        icon="solar:eye-bold"
                                    />
                                )}
                            </button>
                        }
                        label="New Password"
                        name="password"
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                        isDisabled={isLoading}
                    />
                    <Input
                        isRequired
                        endContent={
                            <button type="button" onClick={toggleConfirmVisibility}>
                                {isConfirmVisible ? (
                                    <Icon
                                        className="pointer-events-none text-2xl text-default-400"
                                        icon="solar:eye-closed-linear"
                                    />
                                ) : (
                                    <Icon
                                        className="pointer-events-none text-2xl text-default-400"
                                        icon="solar:eye-bold"
                                    />
                                )}
                            </button>
                        }
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={isConfirmVisible ? "text" : "password"}
                        variant="bordered"
                        isDisabled={isLoading}
                    />
                    <Button
                        className="w-full"
                        color="primary"
                        type="submit"
                        isLoading={isLoading}
                    >
                        Update Password
                    </Button>
                </Form>
            </div>
        </div>
    );
}
