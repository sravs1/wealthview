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

  const { exchangeSlug } = await request.json();
  if (!exchangeSlug) {
    return NextResponse.json({ error: "Missing exchangeSlug." }, { status: 400 });
  }

  const { error } = await supabase
    .from("connected_exchanges")
    .update({ is_active: false, api_key: null, api_secret: null, api_passphrase: null })
    .eq("user_id", user.id)
    .eq("exchange_slug", exchangeSlug);

  if (error) {
    return NextResponse.json({ error: "Failed to disconnect." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
