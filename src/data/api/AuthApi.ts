import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


interface User {
    access_token: string;
}

export default NextAuth({
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
                });

                const data = await res.json();

                if (data.error) { throw data; }


                return data;
            },
        }),
    ],

});
