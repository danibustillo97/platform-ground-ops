import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
    access_token: string;
    error?: string;
}

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "test@test.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login/login`,
                    {
                        method: "POST",
                        body: new URLSearchParams({
                            grant_type: 'password',
                            username: credentials?.email || '',
                            password: credentials?.password || '',
                        }),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "ngrok-skip-browser-warning": "true",
                        },
                    }
                );

                const user: User = await res.json();

                if (!res.ok || !user.access_token) {
                    throw new Error(user.error || 'Authorization failed');
                }

                return user as NextAuthUser;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.access_token = user.access_token;
                
            }
            return token;
        },
        async session({ session, token }) {
            session.user.access_token = token.access_token as string;
     
            return session;
        },
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            },
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
