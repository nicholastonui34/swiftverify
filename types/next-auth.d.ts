import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

/**
 * Augment Auth.js types so `session.user.role` / `session.user.id` are typed,
 * and the JWT carries the role for middleware + server checks.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
