import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


interface User{
    id: string;
    access_token: string;
}

export default NextAuth({
    pages: {
        signIn: "/login",
    },
        
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Usuario", type: "text", placeholder: "Usuario" },
                password: { label: "Contraseña", type: "password" },
            },
            async authorize(credentials) {
                const body = new URLSearchParams({
                    username: credentials!.username,
                    password: credentials!.password,
                });

                const res = await fetch(`${apiUrl}/api/login/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: body.toString(),
                    credentials: 'include',
                });

                const data = await res.json();

                if (data.error) { throw data; }


                return { id: data.id, access_token: data.access_token }
            },
        }),
    ],

    callbacks: { 
        jwt: async ({ token, user }) => {
          return { ...token, ...user };
        },
        session: async ({ session, token }) => {
          session.user = token as any;
          return session;
        },
      },
});