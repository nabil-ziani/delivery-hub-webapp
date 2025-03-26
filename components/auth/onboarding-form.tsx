"use client";

import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
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
import RowSteps from "../onboarding/row-steps";

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
            <Card className="w-full max-w-[900px] min-h-[850px] flex flex-col">
                <CardHeader className="flex flex-col gap-6 items-center py-8">
                    <img
                        src="/logo.png"
                        width={50}
                        height={50}
                        alt="Logo"
                        className="mx-auto"
                    />
                    <div className="text-center space-y-1.5">
                        <h1 className="text-2xl font-semibold">Complete Your Profile</h1>
                        <p className="text-default-500">
                            Just a few more details to get you started
                        </p>
                    </div>
                    <RowSteps
                        key={currentStep}
                        defaultStep={currentStep}
                        steps={onboardingSteps}
                        onStepChange={(step) => {
                            if (step >= onboardingSteps.length) return;

                            if (step > currentStep) {
                                if (!validateCurrentStep()) return;
                            }

                            setCurrentStep(step);
                        }}
                    />
                </CardHeader>
                <CardBody className="px-4 sm:px-8 pb-8 flex-grow flex flex-col">
                    <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                        <div className="flex-grow">
                            {renderStepContent()}
                        </div>

                        <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-divider">
                            {currentStep > 0 && (
                                <Button
                                    variant="flat"
                                    onPress={prevStep}
                                    isDisabled={isLoading}
                                    startContent={<Icon icon="solar:arrow-left-line-duotone" />}
                                >
                                    Previous
                                </Button>
                            )}
                            {currentStep < onboardingSteps.length - 1 ? (
                                <Button
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
                </CardBody>
            </Card>
        </div>
    )
}