import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Interfaz de respuesta de tu API de autenticación
interface AuthUser {
    id: string;
    access_token: string;
    error?: string;
}

// Extiende NextAuthUser para incluir access_token
interface ExtendedNextAuthUser extends NextAuthUser {
    access_token: string; // Aquí se agrega la propiedad access_token
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

                const user: AuthUser = await res.json();

                if (!res.ok || !user.access_token) {
                    throw new Error(user.error || 'Authorization failed');
                }

                // Retorna un objeto de usuario que cumple con ExtendedNextAuthUser
                return {
                    id: user.id,
                    access_token: user.access_token,
                    email: credentials!.email, // Asegúrate de incluir el email si lo necesitas
                } as ExtendedNextAuthUser; // Se asegura que el objeto devuelto sea del tipo correcto
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.access_token = (user as ExtendedNextAuthUser).access_token; // Asegúrate de hacer un casting correcto
            }
            return token;
        },
        async session({ session, token }) {
            session.user.access_token = token.access_token as string; // Asegúrate de que sea del tipo correcto
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
