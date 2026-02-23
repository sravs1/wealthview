import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "";

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your account preferences.</p>
      </div>

      <div className="space-y-4">
        {/* Profile section */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Settings size={16} className="text-slate-400" />
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Full name</label>
              <input
                type="text"
                defaultValue={displayName}
                disabled
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-slate-300 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Email address</label>
              <input
                type="email"
                defaultValue={user.email ?? ""}
                disabled
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-slate-300 text-sm cursor-not-allowed"
              />
            </div>
          </div>
          <p className="text-slate-600 text-xs mt-4">
            Profile editing will be available in a future update.
          </p>
        </div>

        {/* Account section */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-2">Account ID</h2>
          <p className="text-slate-500 text-xs font-mono break-all">{user.id}</p>
        </div>
      </div>
    </div>
  );
}
