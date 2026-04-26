import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Custom domain routing — check if this hostname matches a player's custom domain
  // Skip for your own domain and localhost
  const ownDomains = (process.env.NEXT_PUBLIC_APP_DOMAIN ?? "").split(",").map((d) => d.trim()).filter(Boolean);
  const isOwnDomain =
    hostname === "localhost" ||
    hostname.endsWith(".vercel.app") ||
    ownDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`));

  if (!isOwnDomain && pathname === "/") {
    // Look up which player owns this custom domain
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    const { data: player } = await supabaseAdmin
      .from("players")
      .select("slug")
      .eq("custom_domain", hostname)
      .eq("is_published", true)
      .single();

    if (player?.slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/${player.slug}`;
      return NextResponse.rewrite(url);
    }
  }

  // Standard auth handling
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes (except login)
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login") &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login page
  if (request.nextUrl.pathname === "/admin/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
