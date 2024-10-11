import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      access_token: string;
      email: string;
      token: string;
    };
  }
}
