'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const steps = [
    {
        id: 'restaurant-details',
        fields: ['name', 'address', 'phone'],
        title: 'Restaurant Details'
    },
    {
        id: 'preferences',
        fields: ['operating_hours', 'delivery_radius'],
        title: 'Delivery Preferences'
    },
    // Add more steps as needed
];

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        // Save step data
        // If last step, redirect to dashboard
        if (currentStep === steps.length - 1) {
            router.push('/dashboard');
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-8">
                {steps[currentStep].title}
            </h1>

            {/* Render current step form */}
            <form action={handleSubmit}>
                {/* Form fields based on current step */}
            </form>
        </div>
    );
}