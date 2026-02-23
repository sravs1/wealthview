import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const DEMO_EXCHANGES = [
  {
    exchange_slug: "coinbase",
    exchange_name: "Coinbase",
    connection_type: "api_key",
    api_key: "demo-key-coinbase",
    api_secret: "demo-secret-coinbase",
  },
  {
    exchange_slug: "binance",
    exchange_name: "Binance",
    connection_type: "api_key",
    api_key: "demo-key-binance",
    api_secret: "demo-secret-binance",
  },
  {
    exchange_slug: "alpaca",
    exchange_name: "Alpaca",
    connection_type: "api_key",
    api_key: "demo-key-alpaca",
    api_secret: "demo-secret-alpaca",
  },
];

export async function POST() {
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Upsert all demo exchanges for this user
  const rows = DEMO_EXCHANGES.map((ex) => ({
    user_id: user.id,
    ...ex,
    is_active: true,
    last_synced_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("connected_exchanges")
    .upsert(rows, { onConflict: "user_id,exchange_slug" });

  if (error) {
    console.error("Demo seed error:", error);
    return NextResponse.json({ error: "Failed to seed demo data." }, { status: 500 });
  }

  return NextResponse.json({ success: true, exchangesSeeded: DEMO_EXCHANGES.length });
}
