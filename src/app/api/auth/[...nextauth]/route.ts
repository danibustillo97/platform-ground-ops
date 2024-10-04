import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "test@test.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login/login`,
                    {
                        method: "POST",
                        body: new URLSearchParams({
                            grant_type: 'password',
                            username: credentials?.email || '', 
                            password: credentials?.password || '',
                            scope: '',  
                            client_id: '',  
                            client_secret: '',  
                        }),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "ngrok-skip-browser-warning": "true",  
                        },
                    }
                );

                const user = await res.json();
                console.log(user.data);

                if (!res.ok || user.error) {
                    throw new Error(user.error || 'Authorization failed');
                }

                return user;
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
          return { ...token, ...user };
        },
        async session({ session, token }) {
          session.user = token as any;
          return session;
        },
      },
});

export { handler as GET, handler as POST };
