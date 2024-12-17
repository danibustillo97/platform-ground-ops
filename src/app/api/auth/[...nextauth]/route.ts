import NextAuth, {User, NextAuthConfig} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const url_local = "http://localhost:8000"

interface AuthUser {
    access_token: string;
    token_type: string;
    user: {
        name: string;
        email: string;
    };
}

interface ExtendedNextAuthUser extends User {
    access_token: string; 
    name: string;
}

interface ExtendedJWT {
    access_token?: string; 
    name?: string;
}

const authOptions: NextAuthConfig = {
    secret: process.env.NEXTAUTH_SECRET,
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
                        // `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login/login`,
                        `${url_local}/api/login/login`,
                        {
                          method: "POST",
                          body: new URLSearchParams({
                            grant_type: 'password',
                            username: credentials?.email ? String(credentials.email) : '', 
                            password: credentials?.password ? String(credentials.password) : '', 
                          }),
                          headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                          },
                        }
                      );

                    if (!res.ok) {
                        const errorData = await res.json();
                        console.error('Error en la autenticación:', errorData);
                        throw new Error('Error en la autenticación');
                    }

                    const data: AuthUser = await res.json();
                    
                    if (!data.access_token) {
                        throw new Error('Access token no recibido o es inválido');
                    }

                    return {
                        id: data.user.email, 
                        access_token: data.access_token,
                        email: data.user.email,
                        name: data.user.name,
                    } as ExtendedNextAuthUser;
                } catch (error) {
                    console.error(error);
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
            session.user.access_token = (token as ExtendedJWT).access_token || ""; 
            session.user.name = (token as ExtendedJWT).name || "";
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
