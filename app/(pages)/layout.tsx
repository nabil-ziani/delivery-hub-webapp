import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import NavbarComponent from "@/components/ui/navbar";
import CustomSidebar from "@/components/ui/custom-sidebar";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // Check authentication using getUser for better security
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return redirect("/sign-in");
  }

  // First check if user has an organization
  const { data: memberData, error: memberError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (memberError) {
    console.error('Error fetching organization:', memberError);
    return redirect("/sign-in");
  }

  if (!memberData?.organization_id) {
    return redirect("/onboarding");
  }

  // Then check if organization has a restaurant profile
  const { data: profileData, error: profileError } = await supabase
    .from('restaurant_profiles')
    .select('id')
    .eq('organization_id', memberData.organization_id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') { // Ignore not found error
    console.error('Error fetching profile:', profileError);
    return redirect("/sign-in");
  }

  if (!profileData?.id) {
    return redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-foreground">
      <div className="fixed left-4 top-4 z-50">
        <CustomSidebar />
      </div>
      <NavbarComponent />
      <main className="pt-24 pl-[calc(7rem+1rem)] pr-4 transition-all duration-300">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}