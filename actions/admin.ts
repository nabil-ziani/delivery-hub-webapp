"use server"

import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { sendRestaurantInviteEmail } from "@/utils/emails";

export const generateRestaurantInvite = async (email: string) => {
    const supabase = await createClient();

    try {
        // Create organization placeholder with a name
        const { data: org, error: orgError } = await supabase
            .from('organizations')
            .insert({
                name: `Restaurant - ${new Date().toISOString()}`
            })
            .select()
            .single();

        if (orgError || !org) {
            throw new Error('Failed to create organization');
        }

        const token = randomUUID();

        // Generate invite token
        const { data: invite, error: inviteError } = await supabase
            .from('invite_tokens')
            .insert({
                token,
                organization_id: org.id,
                role: 'owner',
                email,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .select()
            .single();

        if (inviteError || !invite) {
            console.log(inviteError)
            throw new Error('Failed to create invite token');
        }

        const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up?token=${invite.token}`;

        // Send the invite email
        try {
            await sendRestaurantInviteEmail(email, inviteUrl);
            return inviteUrl;
        } catch (error) {
            throw new Error('Failed to send invite email');
        }
    } catch (error) {
        throw error;
    }
} 