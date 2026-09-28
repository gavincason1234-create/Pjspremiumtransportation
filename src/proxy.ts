import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/crypto";
import { ADMIN_COOKIE, DRIVER_COOKIE } from "@/lib/auth";

/**
 * Gate the owner (/admin) and driver (/driver) areas at the edge of the app.
 * Pages and actions still verify the session themselves; this just avoids rendering
 * protected screens for anonymous visitors. (Next.js 16: proxy.ts runs on Node.)
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const ok = verifyToken(req.cookies.get(ADMIN_COOKIE)?.value) === "admin";
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/driver") && pathname !== "/driver/login") {
    const payload = verifyToken(req.cookies.get(DRIVER_COOKIE)?.value);
    if (!payload || !payload.startsWith("driver:")) {
      const url = req.nextUrl.clone();
      url.pathname = "/driver/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/driver/:path*"],
};
