import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Edge middleware — uses the DB-free authConfig so it can run on the edge.
 * The `authorized` callback blocks `/admin` for anyone who isn't an ADMIN and
 * redirects them to the sign-in page.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // Run on /admin + /account routes. Auth API + static assets are excluded.
  matcher: ["/admin/:path*", "/account/:path*"],
};
