'use client';

import { generateRestaurantInvite } from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function GenerateInviteForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();

    async function handleGenerateInvite(formData: FormData) {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await generateRestaurantInvite(formData.get('email') as string);
            toast({
                title: "Success",
                description: "Invite sent successfully",
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to send invite",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleGenerateInvite}>
            <input
                type="email"
                name="email"
                placeholder="Restaurant owner's email"
                className="w-full p-2 border rounded mb-4"
                required
                disabled={isSubmitting}
            />
            <button
                type="submit"
                className="w-full bg-primary text-white p-2 rounded disabled:opacity-50"
                disabled={isSubmitting}
            >
                {isSubmitting && <Spinner />}
                {isSubmitting ? 'Sending...' : 'Generate Invite Link'}
            </button>
        </form>
    );
} 