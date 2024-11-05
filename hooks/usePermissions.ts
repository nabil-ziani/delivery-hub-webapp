"use client";

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

export function usePermissions() {
    const [permissions, setPermissions] = useState({
        canInviteCouriers: false,
        canViewMap: false,
        canUpdateLocation: false,
    })

    useEffect(() => {
        const loadPermissions = async () => {
            const supabase = createClient();
            const { data: member } = await supabase
                .from('organization_members')
                .select('role')
                .single();

            setPermissions({
                canInviteCouriers: member?.role === 'owner',
                canViewMap: true, // Both roles can view
                canUpdateLocation: member?.role === 'courier',
            });
        };

        loadPermissions();
    }, []);

    return permissions;
} 