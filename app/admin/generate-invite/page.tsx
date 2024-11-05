import { generateAdminInvite } from "@/app/admin/actions";

export default function GenerateInvitePage() {
    async function handleGenerateInvite(formData: FormData) {
        'use server'
        const email = formData.get('email') as string;
        const inviteLink = await generateAdminInvite(email);
        // In production, you would send this link via email
        console.log(inviteLink);
        return inviteLink;
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Generate Restaurant Owner Invite</h1>
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
        </div>
    );
} 