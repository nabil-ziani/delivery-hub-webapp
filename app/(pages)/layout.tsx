import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import NavbarComponent from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return redirect("/sign-in");
  }

  // Check organization profile
  const { data: member } = await supabase
    .from('organization_members')
    .select(`
      organization:organizations (
        restaurant_profile:restaurant_profiles (
          id,
          phone_number,
          email,
          address,
          city,
          postal_code,
          settings
        )
      )
    `)
    .eq('user_id', user.id)
    .single();

  console.log('Member data:', member);

  // Redirect to onboarding if no profile exists
  if (!member?.organization?.restaurant_profile) {
    console.log("Redirecting back to onboarding");
    return redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background">
      <NavbarComponent />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}