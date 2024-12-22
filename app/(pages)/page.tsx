import { DeliveryMap } from '@/components/map/delivery-map';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="space-y-8">
      <DeliveryMap />
    </div>
  );
}