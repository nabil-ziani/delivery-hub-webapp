"use client";

import React from "react";
import { Button, Input, Link, Form } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { signUpAction } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function SignUpForm() {
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
            const token = searchParams.get("token");
            if (token) {
                formData.append("token", token);
            } else {
                toast.error("Invalid invite link");
                return;
            }

            const result = await signUpAction(formData);

            if (result && "error" in result) {
                toast.error(result.error);
            } else {
                toast.success("Account created successfully! Please check your email to verify your account.");
            }
        } catch (error) {
            toast.error("An error occurred during sign up");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="flex flex-col items-center pb-6">
                <img
                    src="/logo.png"
                    width={50}
                    height={50}
                    alt="Logo"
                    className="mx-auto"
                />
                <p className="text-xl font-medium">Create an account</p>
                <p className="text-small text-default-500">
                    Join us to manage your restaurant deliveries
                </p>
            </div>
            <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
                <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
                    <Input
                        isRequired
                        label="Email Address"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                        variant="bordered"
                        isDisabled={isLoading}
                    />
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
                        label="Password"
                        name="password"
                        placeholder="Enter your password"
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
                        label="Confirm Password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        type={isConfirmVisible ? "text" : "password"}
                        variant="bordered"
                        isDisabled={isLoading}
                    />
                    <Button className="w-full" color="primary" type="submit" isLoading={isLoading}>
                        Create Account
                    </Button>
                </Form>
                <p className="text-center text-small">
                    Already have an account?&nbsp;
                    <Link href="/sign-in" size="sm">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
