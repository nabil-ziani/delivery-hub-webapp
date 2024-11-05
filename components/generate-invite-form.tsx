'use client';

import { generateRestaurantInvite } from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";

export function GenerateInviteForm() {
    const { toast } = useToast();

    async function handleGenerateInvite(formData: FormData) {
        const email = formData.get('email') as string;
        
        try {
            const inviteLink = await generateRestaurantInvite(email);
            toast({
                title: "Success",
                description: "Invite sent successfully",
                variant: "default",
            });
            return inviteLink;
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to send invite",
                variant: "destructive",
            });
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
            />
            <button type="submit" className="w-full bg-primary text-white p-2 rounded">
                Generate Invite Link
            </button>
        </form>
    );
} 