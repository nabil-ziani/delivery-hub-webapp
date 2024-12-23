import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/auth/onboarding-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default async function OnboardingPage() {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        return redirect("/sign-in");
    }

    // Check if onboarding is already completed
    const { data: member } = await supabase
        .from('organization_members')
        .select(`
            organization:organizations (
                restaurant_profile:restaurant_profiles (*)
            )
        `)
        .eq('user_id', user.id)
        .single();

    // Redirect to dashboard if already completed
    if (member?.organization?.restaurant_profile) {
        return redirect("/");
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <OnboardingForm user={user} />
        </Suspense>
    );
} 