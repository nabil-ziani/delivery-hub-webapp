'use client';

import { sendInviteEmail } from "@/utils/emails";
import { createClient } from "@/utils/supabase/client";

export async function InviteCourier() {
    const handleInvite = async (formData: FormData) => {
        const email = formData.get('email');
        const supabase = createClient();

        const { data: org } = await supabase
            .from('organization_members')
            .select('organization_id')
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
            .single();

        // Generate courier invite
        const { data: invite } = await supabase
            .from('invite_tokens')
            .insert({
                organization_id: org?.organization_id,
                role: 'courier',
                email,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            })
            .select()
            .single();

        // Send email with invite link
        await sendInviteEmail(email as string, `/sign-up?token=${invite.token}`);
    };

    return (
        <form action={handleInvite}>
            <input name="email" type="email" placeholder="Courier's email" />
            <button type="submit">Send Invite</button>
        </form>
    );
} 