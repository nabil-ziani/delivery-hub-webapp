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
    const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

    if (memberError) {
        console.error('Error fetching member data:', memberError);
        return redirect("/sign-in");
    }

    if (memberData?.organization_id) {
        const { data: profileData } = await supabase
            .from('restaurant_profiles')
            .select('id')
            .eq('organization_id', memberData.organization_id)
            .single();

        if (profileData?.id) {
            return redirect("/");
        }
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <OnboardingForm user={user} />
        </Suspense>
    );
} 