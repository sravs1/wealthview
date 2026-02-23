import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Check, Zap, CreditCard, Crown } from "lucide-react";
import BillingActions from "./BillingActions";
import ManageBillingButton from "./ManageBillingButton";

const TIER_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  free:       { label: "Free",       color: "text-slate-400",  bg: "bg-slate-500/10" },
  pro:        { label: "Pro",        color: "text-emerald-400", bg: "bg-emerald-500/10" },
  enterprise: { label: "Enterprise", color: "text-violet-400",  bg: "bg-violet-500/10" },
};

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For personal use",
    features: [
      "Up to 2 exchanges",
      "Basic portfolio view",
      "15-minute refresh",
      "Community support",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    period: "month",
    description: "For active investors",
    features: [
      "Unlimited exchanges",
      "Real-time sync",
      "AI-powered insights",
      "Advanced analytics",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$29.99",
    period: "month",
    description: "For power users & teams",
    features: [
      "Everything in Pro",
      "API access",
      "Team collaboration",
      "Custom reports",
      "Dedicated support",
    ],
    highlighted: false,
  },
];

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, stripe_customer_id, stripe_subscription_id")
    .eq("id", user.id)
    .single();

  const currentTier = profile?.subscription_tier ?? "free";
  const hasSubscription = !!profile?.stripe_customer_id;
  const tierMeta = TIER_LABELS[currentTier] ?? TIER_LABELS.free;
  const params = await searchParams;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Billing & Plans</h1>
        <p className="text-slate-400 text-sm">Choose the plan that fits your investing style.</p>
      </div>

      {/* Current plan banner */}
      <div className="glass rounded-2xl p-5 border border-white/[0.06] mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${tierMeta.bg} rounded-xl flex items-center justify-center`}>
            <Crown size={18} className={tierMeta.color} />
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-0.5">Current plan</p>
            <div className="flex items-center gap-2">
              <p className="text-white font-bold text-lg">{tierMeta.label}</p>
              {currentTier !== "free" && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tierMeta.bg} ${tierMeta.color}`}>
                  Active
                </span>
              )}
            </div>
          </div>
        </div>
        {hasSubscription && <ManageBillingButton />}
      </div>

      {/* Alerts */}
      {params.success && (
        <div className="glass rounded-xl p-4 border border-emerald-500/25 bg-emerald-500/[0.05] mb-6 flex items-center gap-3">
          <Check size={18} className="text-emerald-400 flex-shrink-0" />
          <p className="text-emerald-300 text-sm font-medium">
            Subscription activated! Welcome to Wealthview {currentTier === "enterprise" ? "Enterprise" : "Pro"}.
          </p>
        </div>
      )}
      {params.canceled && (
        <div className="glass rounded-xl p-4 border border-slate-500/25 mb-6">
          <p className="text-slate-400 text-sm">Checkout was canceled. No charge was made.</p>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const isCurrent = currentTier === plan.id;
          return (
            <div
              key={plan.id}
              className={`glass rounded-2xl p-6 flex flex-col relative ${
                isCurrent
                  ? "border-emerald-500/30 bg-emerald-500/[0.03]"
                  : plan.highlighted
                  ? "border-white/[0.12]"
                  : "border-white/[0.06]"
              }`}
            >
              {plan.highlighted && !isCurrent && (
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full mb-4 self-start">
                  <Zap size={10} />
                  Most popular
                </div>
              )}
              {isCurrent && (
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full mb-4 self-start">
                  <Check size={10} />
                  Your plan
                </div>
              )}

              <h2 className="text-white font-bold text-lg mb-0.5">{plan.name}</h2>
              <p className="text-slate-500 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                {plan.period !== "forever" && (
                  <span className="text-slate-500 text-sm ml-1">/ {plan.period}</span>
                )}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-slate-300 text-sm">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full text-center py-2.5 rounded-xl text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  Current plan
                </div>
              ) : plan.id === "free" ? (
                <div className="w-full text-center py-2.5 rounded-xl text-sm text-slate-600">
                  —
                </div>
              ) : (
                <BillingActions plan={plan.id} highlighted={plan.highlighted} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 glass rounded-2xl p-5 flex items-start gap-3">
        <CreditCard size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-slate-500 text-sm leading-relaxed">
          Cancel anytime — no long-term commitment. All billing is managed securely through Stripe.
          {hasSubscription && (
            <> Click <span className="text-white font-medium">Manage Subscription</span> above to update payment details, view invoices, or cancel.</>
          )}
        </p>
      </div>
    </div>
  );
}
