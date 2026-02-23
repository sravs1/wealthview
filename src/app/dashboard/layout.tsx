import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = (profile?.subscription_tier ?? "free") as "free" | "pro" | "enterprise";

  return (
    <div className="flex h-screen bg-[#050a14] overflow-hidden">
      <Sidebar tier={tier} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
