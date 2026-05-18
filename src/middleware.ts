import { NextResponse } from "next/server";
import NextAuth from "next-auth";

const { auth } = NextAuth({
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session.user && token) {
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
  },
});

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Protect /dashboard — require login
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Protect /admin/* — require login + ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    if ((session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
