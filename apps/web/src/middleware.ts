import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES: {
  pattern: RegExp;
  allowedRoles: string[];
}[] = [
  {
    pattern: /^\/admin(\/|$)/,
    allowedRoles: ["admin"],
  },
  {
    pattern: /^\/map(\/|$)/,
    allowedRoles: ["parent"],
  },
];

const BYPASS_PATTERN =
  /^(\/api\/auth|\/api\/|\/favicon\.ico|\/icons\/|\/images\/|\/fonts\/|\/manifest\.json|\/robots\.txt|\/sitemap\.xml|\/_next\/)/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (BYPASS_PATTERN.test(pathname)) {
    return NextResponse.next();
  }

  const match = PROTECTED_ROUTES.find(({ pattern }) => pattern.test(pathname));

  if (!match) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const userRole = token.role as string | undefined;

  if (!userRole || !match.allowedRoles.includes(userRole)) {
    return new NextResponse(
      JSON.stringify({ message: "Forbidden: insufficient role" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
