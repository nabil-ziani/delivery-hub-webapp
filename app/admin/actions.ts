"use server"

import { createClient } from "@/utils/supabase/server";

export const generateAdminInvite = async (email: string) => {
    const supabase = await createClient();

    // Create organization placeholder
    const { data: org } = await supabase
        .from('organizations')
        .insert({})
        .select()
        .single();

    // Generate invite token
    const { data: invite } = await supabase
        .from('invite_tokens')
        .insert({
            organization_id: org.id,
            role: 'admin',
            email,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        })
        .select()
        .single();

    return `/sign-up?token=${invite.token}`;
} 