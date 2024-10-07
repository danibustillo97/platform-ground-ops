// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      access_token: string;
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    access_token: string;
    id: string;
  }
}
