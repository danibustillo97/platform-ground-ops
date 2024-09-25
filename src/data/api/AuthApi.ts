import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                password: {  label: "Password", type: "password" }
            },
            async authorize (credentials) {
                try {
                    const response = await fetch(`${apiUrl}/api/login/login`, {
                        method: "POST",
                        headers: {
                            "ngrok-skip-browser-warning": "true",
                            "Content-Type": "application/x-www-form-urlencoded", 
                        },
                        body: .toString(),
                    });

                } catch (error) {
                    
                }
            }
        }),
    ],
})  


export const authUser = async (username: string, password: string | number) => {
    try {
        const formBody = new URLSearchParams(); 
        formBody.append("username", username.toString());
        formBody.append("password", password.toString());

        const response = await fetch(`${apiUrl}/api/login/login`, {
            method: "POST",
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/x-www-form-urlencoded", 
            },
            body: formBody.toString(),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                errors: data.detail || [{ msg: "Error en la autenticación" }]
            };
        }

        return {
            success: true,
            data,
        };

    } catch (error) {
        console.log("Error en el servidor", error);
        return {
            success: false,
            errors: [{ msg: "Error en el servidor. Inténtalo más tarde" }]
        };
    }
};