import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isDevEnv = process.env.ENV === "development";
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/dev/")) {
    if (!isDevEnv) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized: Not in development environment",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/dev/:path*"],
};
