"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { completeOnboardingAction } from "@/actions/onboarding";
import { Icon } from "@iconify/react";
import { AddressStep } from "@/components/onboarding/address-step";
import { HoursStep } from "@/components/onboarding/hours-step";
import { LogoUpload } from "@/components/onboarding/logo-upload";

type Step = {
    title: string;
    description: string;
    icon: string;
};

const steps: Step[] = [
    {
        title: "Restaurant Details",
        description: "Tell us about your restaurant",
        icon: "solar:shop-2-bold",
    },
    {
        title: "Contact Information",
        description: "How can customers reach you",
        icon: "solar:phone-bold",
    },
    {
        title: "Location",
        description: "Where are you located",
        icon: "solar:map-point-bold",
    },
    {
        title: "Opening Hours",
        description: "When are you open",
        icon: "solar:clock-circle-bold",
    },
];

const defaultWorkingHours = {
    monday: { open: "09:00", close: "22:00" },
    tuesday: { open: "09:00", close: "22:00" },
    wednesday: { open: "09:00", close: "22:00" },
    thursday: { open: "09:00", close: "22:00" },
    friday: { open: "09:00", close: "23:00" },
    saturday: { open: "09:00", close: "23:00" },
    sunday: { open: "09:00", close: "22:00" },
};

export default function OnboardingPage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        restaurantName: "",
        description: "",
        phoneNumber: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        logo: null as File | null,
        workingHours: defaultWorkingHours,
    });

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/sign-in");
                return;
            }
            setUser(session.user);
            setFormData(prev => ({ ...prev, email: session.user.email || "" }));
        };

        checkSession();
    }, [router, supabase.auth]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
                router.push("/dashboard");
            }
        } catch (error) {
            toast.error("An error occurred while completing onboarding");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <>
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
                            placeholder="Enter your restaurant's name"
                            variant="bordered"
                            isDisabled={isLoading}
                        />
                        <Input
                            label="Description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Tell us about your restaurant"
                            variant="bordered"
                            isDisabled={isLoading}
                        />
                    </>
                );
            case 1:
                return (
                    <>
                        <Input
                            isRequired
                            label="Phone Number"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                            placeholder="Enter your phone number"
                            type="tel"
                            variant="bordered"
                            isDisabled={isLoading}
                        />
                        <Input
                            isRequired
                            label="Email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Enter your email"
                            type="email"
                            variant="bordered"
                            isDisabled={true}
                        />
                    </>
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

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-xl">
                <CardHeader className="flex flex-col gap-1 items-center pb-8">
                    <img
                        src="/logo.png"
                        width={50}
                        height={50}
                        alt="Logo"
                        className="mx-auto mb-4"
                    />
                    <h1 className="text-xl font-semibold">Complete Your Profile</h1>
                    <p className="text-small text-default-500">
                        Just a few more details to get you started
                    </p>
                    {/* Stepper */}
                    <div className="flex w-full justify-between mt-8 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-default-100 -translate-y-1/2" />
                        {steps.map((step, index) => (
                            <div
                                key={step.title}
                                className={`relative flex flex-col items-center gap-2 ${index <= currentStep ? "text-primary" : "text-default-400"
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                                    ${index <= currentStep
                                            ? "bg-primary text-white"
                                            : "bg-default-100 text-default-400"
                                        }`}
                                >
                                    <Icon icon={step.icon} className="text-xl" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">{step.title}</p>
                                    <p className="text-xs text-default-400">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {renderStepContent()}
                        <div className="flex gap-3 mt-4">
                            {currentStep > 0 && (
                                <Button
                                    variant="flat"
                                    onPress={prevStep}
                                    isDisabled={isLoading}
                                >
                                    Previous
                                </Button>
                            )}
                            {currentStep < steps.length - 1 ? (
                                <Button
                                    color="primary"
                                    onPress={nextStep}
                                    isDisabled={isLoading}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    color="primary"
                                    isLoading={isLoading}
                                >
                                    Complete Setup
                                </Button>
                            )}
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
} 