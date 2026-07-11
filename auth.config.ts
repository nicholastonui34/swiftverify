import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Edge-safe Auth.js config. Contains NO database or bcrypt imports so it can run
 * in the middleware (edge runtime). The Credentials provider that talks to
 * Prisma lives in `auth.ts` (Node runtime only). Callbacks here move `role`/`id`
 * into the JWT + session and gate access to `/admin`.
 */
export const authConfig = {
  // Trust the deployment host. Vercel auto-detects this; setting it explicitly
  // also makes `next start` / self-hosting work without an AUTH_URL.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [], // real providers are added in auth.ts
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminArea = pathname.startsWith("/admin");
      if (isAdminArea) {
        return auth?.user?.role === "ADMIN" || auth?.user?.role === "SUPER_ADMIN";
      }
      const isAccountArea =
        pathname.startsWith("/account") &&
        pathname !== "/account/login" &&
        pathname !== "/account/signup";
      if (isAccountArea && !auth?.user) {
        // Override the default `pages.signIn` redirect (which points at the
        // staff /login) so unauthenticated clients land on /account/login.
        const url = new URL("/account/login", request.nextUrl);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
