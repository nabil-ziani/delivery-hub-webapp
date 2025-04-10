"use client";

import { Input } from "@heroui/react";

type AddressStepProps = {
    formData: {
        address: string;
        city: string;
        postalCode: string;
    };
    onChange: (key: string, value: string) => void;
    isLoading: boolean;
};

export function AddressStep({ formData, onChange, isLoading }: AddressStepProps) {
    return (
        <div className="space-y-6">
            <Input
                isRequired
                label="Street Address"
                value={formData.address}
                onChange={(e) => onChange("address", e.target.value)}
                variant="bordered"
                isDisabled={isLoading}
            />
            <Input
                isRequired
                label="City"
                value={formData.city}
                onChange={(e) => onChange("city", e.target.value)}
                variant="bordered"
                isDisabled={isLoading}
            />
            <Input
                isRequired
                label="Postal Code"
                value={formData.postalCode}
                onChange={(e) => onChange("postalCode", e.target.value)}
                variant="bordered"
                isDisabled={isLoading}
            />
        </div>
    );
} 