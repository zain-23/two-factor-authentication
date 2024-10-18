import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PROTECTED_ROUTE, PUBLIC_ROUTE } from "./lib/constant";
import { decrypt } from "./lib/session";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTE.includes(path);
  const isPrivateRoute = PROTECTED_ROUTE.includes(path);
  // get session from cookie
  const session = await cookies().get("session")?.value;
  // TODO decrypt cookie
  const payload = await decrypt(session);

  if (isPrivateRoute && !payload?.payload.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  if (isPublicRoute && payload?.payload.userId) {
    return NextResponse.redirect(new URL("/profile", req.nextUrl));
  }
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
