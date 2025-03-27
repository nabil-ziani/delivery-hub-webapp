import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import NavbarComponent from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";

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
    <div className="min-h-screen bg-background">
      <NavbarComponent />
      <Sidebar />
      <main className="min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}