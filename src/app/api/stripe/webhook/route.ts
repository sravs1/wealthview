import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

// Supabase admin client for webhook (bypasses RLS)
async function getAdminClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set — required for webhook.");
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    const supabase = await getAdminClient();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier ?? "pro"; // set in checkout route
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (userId) {
        await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_tier: tier,
          })
          .eq("id", userId);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await supabase
        .from("profiles")
        .update({ subscription_tier: "free", stripe_subscription_id: null })
        .eq("stripe_customer_id", customerId);
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const tier = subscription.status === "active" ? "pro" : "free";

      await supabase
        .from("profiles")
        .update({ subscription_tier: tier })
        .eq("stripe_customer_id", customerId);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
