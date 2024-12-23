import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import OnboardingForm from "@/components/auth/onboarding-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Suspense } from "react";

export default async function OnboardingPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect("/sign-in")
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <OnboardingForm user={user} />
        </Suspense>
    );
} 