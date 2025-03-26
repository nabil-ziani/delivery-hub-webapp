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
    console.log('User ID:', user.id);
    const { data, error: memberError } = await supabase
        .from('organization_members')
        .select('*')

    console.log('Member error:', memberError);
    console.log('User data:', user);
    console.log('Member data:', data);

    // Redirect to dashboard if already completed
    if (data?.organization?.restaurant_profile) {
        return redirect("/");
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <OnboardingForm user={user} />
        </Suspense>
    );
} 