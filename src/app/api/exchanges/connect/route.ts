import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const connectSchema = z.object({
  exchangeSlug: z.string().min(1, "Exchange slug is required"),
  exchangeName: z.string().min(1, "Exchange name is required"),
  connectionType: z.string().optional().default("api_key"),
  apiKey: z.string().min(1, "API key is required"),
  apiSecret: z.string().min(1, "API secret is required"),
  apiPassphrase: z.string().optional(),
});

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
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = connectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request body." },
      { status: 400 },
    );
  }

  const { exchangeSlug, exchangeName, connectionType, apiKey, apiSecret, apiPassphrase } =
    parsed.data;

  const { error } = await supabase.from("connected_exchanges").upsert(
    {
      user_id: user.id,
      exchange_slug: exchangeSlug,
      exchange_name: exchangeName,
      connection_type: connectionType,
      api_key: apiKey,
      api_secret: apiSecret,
      api_passphrase: apiPassphrase ?? null,
      is_active: true,
      last_synced_at: null,
    },
    { onConflict: "user_id,exchange_slug" },
  );

  if (error) {
    console.error("Exchange connect error:", error);
    return NextResponse.json({ error: "Failed to save connection." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
