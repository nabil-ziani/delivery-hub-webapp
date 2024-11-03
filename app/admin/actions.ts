"use server"

import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";

export const generateAdminInvite = async (email: string) => {
    const supabase = await createClient();

    // Create organization placeholder with a name
    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
            name: `Restaurant - ${new Date().toISOString()}` // Temporary name until onboarding
        })
        .select()
        .single();


    if (orgError || !org) {
        console.error('Organization creation error:', orgError);
        throw new Error('Failed to create organization');
    }

    const token = randomUUID();

    // Generate invite token
    const { data: invite, error: inviteError } = await supabase
        .from('invite_tokens')
        .insert({
            token,
            organization_id: org.id,
            role: 'admin',
            email,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

    if (inviteError || !invite) {
        console.error('Invite creation error:', inviteError);
        throw new Error('Failed to create invite');
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up?token=${invite.token}`;

    // In production, send this via email
    return inviteUrl;
} 