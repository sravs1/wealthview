import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InsightsClient from "@/components/dashboard/InsightsClient";

export default async function InsightsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const { data: exchanges } = await supabase
    .from("connected_exchanges")
    .select("exchange_slug")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const hasExchanges = Boolean(exchanges && exchanges.length > 0);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">AI Insights</h1>
        <p className="text-slate-400 text-sm">
          Personalised portfolio analysis powered by Claude AI.
        </p>
      </div>

      <InsightsClient hasExchanges={hasExchanges} />
    </div>
  );
}
