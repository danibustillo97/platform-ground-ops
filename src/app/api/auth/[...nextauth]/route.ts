import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


interface AuthUser {
    id: string;
    access_token: string;
    error?: string;
    name: string;
}

interface ExtendedNextAuthUser extends NextAuthUser {
    access_token: string; 
    name: string;
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
                try {
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
            
                   
                    if (!res.ok) {
                        console.error('Error en la respuesta:', res.status, res.statusText);
                        throw new Error('Error en la autenticación');
                    }
            
                    const data: AuthUser = await res.json();

                    if (!data.access_token) {
                        throw new Error('Access token no recibido');
                    }
            
                    return {
                        id: data.id, 
                        access_token: data.access_token,
                        email: credentials?.email,
                        name: data.name 
                    } as ExtendedNextAuthUser; 
            
                } catch (error) {
                    console.error('Error en authorize:', error);
                    throw new Error('Authorization failed');
                }
            }
            
            
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.access_token = (user as ExtendedNextAuthUser).access_token; 
                token.name = (user as ExtendedNextAuthUser).name; 
            }
            return token;
        },
        async session({ session, token }) {
            session.user.access_token = token.access_token as string; 
            session.user.name = token.name as string;
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
