"use client";

import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";
import Image from "next/image";

type LogoUploadProps = {
    value?: File | null;
    onChange: (file: File | null) => void;
    isLoading?: boolean;
};

export function LogoUpload({ value, onChange, isLoading }: LogoUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = useCallback((file: File | null) => {
        onChange(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    }, [onChange]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            handleFileChange(file);
        }
    }, [handleFileChange]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    return (
        <div className="space-y-4">
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${isLoading ? "opacity-50" : "hover:border-primary cursor-pointer"
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {preview ? (
                    <div className="relative w-32 h-32 mx-auto">
                        <Image
                            src={preview}
                            alt="Logo preview"
                            fill
                            className="object-contain"
                        />
                        <Button
                            isIconOnly
                            color="danger"
                            variant="flat"
                            size="sm"
                            className="absolute -top-2 -right-2"
                            onPress={() => handleFileChange(null)}
                            isDisabled={isLoading}
                        >
                            <Icon icon="solar:close-circle-bold" className="text-xl" />
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Icon icon="solar:gallery-add-bold" className="text-4xl mx-auto mb-2" />
                        <p className="text-default-500">
                            Drag and drop your logo here, or{" "}
                            <label className="text-primary cursor-pointer">
                                browse
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileChange(file);
                                    }}
                                    disabled={isLoading}
                                />
                            </label>
                        </p>
                        <p className="text-small text-default-400 mt-1">
                            PNG, JPG or GIF up to 5MB
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 