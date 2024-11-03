"use server"

import { createClient } from "@/utils/supabase/server";

export const generateAdminInvite = async (email: string) => {
    const supabase = await createClient();

    // Create organization placeholder with a name
    const { data: org } = await supabase
        .from('organizations')
        .insert({
            name: `Restaurant - ${new Date().toISOString()}` // Temporary name until onboarding
        })
        .select()
        .single();

    if (!org) {
        throw new Error('Failed to create organization');
    }

    // Generate invite token
    const { data: invite } = await supabase
        .from('invite_tokens')
        .insert({
            organization_id: org.id,
            role: 'admin',
            email,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

    if (!invite) {
        throw new Error('Failed to create invite');
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up?token=${invite.token}`;
    
    // In production, send this via email
    return inviteUrl;
} 