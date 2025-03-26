"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardBody, Input, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { completeOnboardingAction } from "@/actions/auth";
import { AddressStep } from "@/components/onboarding/address-step";
import { HoursStep } from "@/components/onboarding/hours-step";
import { LogoUpload } from "@/components/onboarding/logo-upload";
import { Icon } from "@iconify/react";
import { schemas } from "@/lib/validations/auth";
import { defaultWorkingHours, onboardingSteps } from "@/constants";
import { User } from "@supabase/supabase-js";

export const OnboardingForm = ({ user }: { user: User }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        restaurantName: "",
        description: "",
        phoneNumber: "",
        email: user.email,
        address: "",
        city: "",
        postalCode: "",
        logo: null as File | null,
        workingHours: defaultWorkingHours,
    });

    const router = useRouter();

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <LogoUpload
                            value={formData.logo}
                            onChange={(file) => handleInputChange("logo", file)}
                            isLoading={isLoading}
                        />
                        <Input
                            isRequired
                            label="Restaurant Name"
                            value={formData.restaurantName}
                            onChange={(e) => handleInputChange("restaurantName", e.target.value)}
                            variant="bordered"
                            isDisabled={isLoading}
                        />
                        <Input
                            label="Description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            variant="bordered"
                            isDisabled={isLoading}
                        />
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-6">
                        <Input
                            isRequired
                            label="Phone Number"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                            type="tel"
                            variant="bordered"
                            isDisabled={isLoading}
                        />
                        <Input
                            isRequired
                            label="Email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            type="email"
                            variant="bordered"
                            isDisabled={true}
                        />
                    </div>
                );
            case 2:
                return (
                    <AddressStep
                        formData={formData}
                        onChange={handleInputChange}
                        isLoading={isLoading}
                    />
                );
            case 3:
                return (
                    <HoursStep
                        value={formData.workingHours}
                        onChange={(hours) => handleInputChange("workingHours", hours)}
                        isLoading={isLoading}
                    />
                );
            default:
                return null;
        }
    };

    const validateCurrentStep = () => {
        try {
            switch (currentStep) {
                case 0:
                    schemas.onboarding.restaurantDetails.parse({
                        restaurantName: formData.restaurantName,
                        description: formData.description,
                        logo: formData.logo,
                    });
                    break;
                case 1:
                    schemas.onboarding.contactInfo.parse({
                        phoneNumber: formData.phoneNumber,
                        email: formData.email,
                    });
                    break;
                case 2:
                    schemas.onboarding.location.parse({
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                    });
                    break;
                case 3:
                    schemas.onboarding.workingHours.parse(formData.workingHours);
                    break;
            }
            return true;
        } catch (error: any) {
            if (error.errors?.[0]?.message) {
                toast.error(error.errors[0].message);
            }
            return false;
        }
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const nextStep = () => {
        if (currentStep < onboardingSteps.length - 1) {
            if (validateCurrentStep()) {
                setCurrentStep(prev => prev + 1);
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Only proceed with submission if we're on the last step
        if (currentStep !== onboardingSteps.length - 1) {
            return;
        }

        if (!validateCurrentStep()) {
            return;
        }

        setIsLoading(true);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "workingHours") {
                    data.append(key, JSON.stringify(value));
                } else if (key === "logo" && value instanceof File) {
                    data.append(key, value);
                } else if (typeof value === "string") {
                    data.append(key, value);
                }
            });

            const result = await completeOnboardingAction(data);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Onboarding completed successfully!");
                if (result?.redirectTo) {
                    setTimeout(() => {
                        router.push(result.redirectTo);
                    }, 1000);
                }
            }
        } catch (error) {
            toast.error("An error occurred while completing onboarding");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <Card className="w-full max-w-[1200px] min-h-[600px]">
                <CardBody className="flex flex-col md:flex-row gap-8 p-0">
                    {/* Left side - Form */}
                    <div className="flex-1 flex flex-col p-8">
                        <div className="flex flex-col items-center text-center mb-8">
                            <img
                                src="/logo.png"
                                width={50}
                                height={50}
                                alt="Logo"
                                className="mb-4"
                            />
                            <h1 className="text-2xl font-semibold">Complete Your Profile</h1>
                            <p className="text-default-500 mt-1.5">
                                Step {currentStep + 1} of {onboardingSteps.length}
                            </p>
                            <p className="text-default-400 text-sm mb-4">
                                {onboardingSteps[currentStep].description}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                            <div className="flex-grow">
                                {renderStepContent()}
                            </div>

                            <div className="flex gap-3 justify-between mt-8 pt-4 border-t border-divider">
                                <Button
                                    type="button"
                                    variant="flat"
                                    onPress={prevStep}
                                    isDisabled={isLoading || currentStep === 0}
                                    startContent={<Icon icon="solar:arrow-left-line-duotone" />}
                                >
                                    Previous
                                </Button>
                                {currentStep < onboardingSteps.length - 1 ? (
                                    <Button
                                        type="button"
                                        color="primary"
                                        onPress={nextStep}
                                        isDisabled={isLoading}
                                        endContent={<Icon icon="solar:arrow-right-line-duotone" />}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        color="primary"
                                        isLoading={isLoading}
                                        endContent={!isLoading && <Icon icon="solar:check-circle-bold" />}
                                    >
                                        Complete Setup
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Right side - Illustration */}
                    <div className="hidden md:flex flex-1 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-900/20">
                        <div className="relative w-full h-full flex items-center justify-center p-8">
                            <Image
                                src={getStepImage(currentStep)}
                                alt={onboardingSteps[currentStep].title}
                                className="max-w-[400px] w-full h-auto object-contain"
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

// Helper function to get the appropriate image for each step
function getStepImage(step: number): string {
    switch (step) {
        case 0:
            return "/images/onboarding/restaurant-info.svg";
        case 1:
            return "/images/onboarding/contact-info.svg";
        case 2:
            return "/images/onboarding/location.svg";
        case 3:
            return "/images/onboarding/working-hours.svg";
        default:
            return "/images/onboarding/restaurant-info.svg";
    }
}