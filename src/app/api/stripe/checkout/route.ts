import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getStripe } from "@/lib/stripe";

// Inline price data — no pre-created Stripe products needed (works in sandbox)
const PLANS: Record<
  string,
  { name: string; amount: number; tier: string }
> = {
  pro: { name: "Wealthview Pro", amount: 999, tier: "pro" },          // $9.99/mo
  enterprise: { name: "Wealthview Enterprise", amount: 2999, tier: "enterprise" }, // $29.99/mo
};

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await request.json();
  const planConfig = PLANS[plan];

  if (!planConfig) {
    return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.email,
    metadata: { userId: user.id, tier: planConfig.tier },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          recurring: { interval: "month" },
          product_data: {
            name: planConfig.name,
            description: `Wealthview ${planConfig.name} — monthly subscription`,
          },
          unit_amount: planConfig.amount,
        },
      },
    ],
    success_url: `${origin}/dashboard/billing?success=true`,
    cancel_url: `${origin}/dashboard/billing?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
