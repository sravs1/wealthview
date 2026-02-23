import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

  const body = await request.json();
  const { exchangeSlug, exchangeName, connectionType, apiKey, apiSecret, apiPassphrase } = body;

  if (!exchangeSlug || !exchangeName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const { error } = await supabase.from("connected_exchanges").upsert(
    {
      user_id: user.id,
      exchange_slug: exchangeSlug,
      exchange_name: exchangeName,
      connection_type: connectionType ?? "api_key",
      api_key: apiKey,
      api_secret: apiSecret,
      api_passphrase: apiPassphrase ?? null,
      is_active: true,
      last_synced_at: null,
    },
    { onConflict: "user_id,exchange_slug" }
  );

  if (error) {
    console.error("Exchange connect error:", error);
    return NextResponse.json({ error: "Failed to save connection." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
