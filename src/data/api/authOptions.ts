import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from 'next-auth/jwt';
import { sign } from "crypto";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
 
    interface User{
        id: string;
        access_token: string;
    }
   
    export const authOptions = {
        pages: {
            signIn: "/login",
            signOut: "/login"
        },
            
        providers: [
            CredentialsProvider({
                id: "Credentials",
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
                            'Content-Type': 'application/json',
                            "ngrok-skip-browser-warning": "true",
                        },
                        body: body.toString(),
                        credentials: 'include',
                    });


                    if (!res.ok) {
                        console.error("Login failed:", res.status, res.statusText);
                        throw new Error("Login failed");
                    }

                    // const data = await res.json();

                    const contentType = res.headers.get("content-type");

                    // Check if response is JSON
                    if (contentType && contentType.includes("application/json")) {
                        const data = await res.json();
                        return { id: data.id, access_token: data.access_token, token_type: data.token_type };
                    } else {
                        throw new Error("Expected JSON response");
                    }


                    // return {id: data.id, access_token: data.access_token, token_type:data.token_type};
                },
            }),
        ],
    
        callbacks: { 
            jwt: async ({ token, user }: { token: JWT; user?: any }) => {
              return { ...token, ...user };
            },
            session: async ({ session, token }: { session: any; token: JWT }) => {
              session.user = token;
              return session;
            },
        },
    };