"use client";

import React from "react";
import { Button, Input, Checkbox, Link, Form } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { signInAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignInForm() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const router = useRouter();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            const result = await signInAction(formData);

            if (result && "error" in result) {
                toast.error(result.error);
            } else {
                toast.success("Successfully signed in!");
                router.push("/dashboard");
            }
        } catch (error) {
            toast.error("An error occurred during sign in");
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
                <p className="text-xl font-medium">Welcome Back</p>
                <p className="text-small text-default-500">Log in to your account to continue</p>
            </div>
            <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
                <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
                    <Input
                        isRequired
                        label="Email Address"
                        name="email"
                        placeholder="you@example.com"
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
                        placeholder="********"
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                        isDisabled={isLoading}
                    />
                    <div className="flex w-full items-center justify-between px-1 py-2">
                        <Checkbox name="remember" size="sm" isDisabled={isLoading}>
                            Remember me
                        </Checkbox>
                        <Link className="text-default-500" href="/forgot-password" size="sm">
                            Forgot password?
                        </Link>
                    </div>
                    <Button className="w-full" color="primary" type="submit" isLoading={isLoading}>
                        Log In
                    </Button>
                </Form>
                <p className="text-center text-small">
                    Need to create an account?&nbsp;
                    <Link href="/sign-up" size="sm">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}