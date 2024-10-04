// import CredentialsProvider from "next-auth/providers/credentials";
// import { JWT } from 'next-auth/jwt';
// import { NextAuthOptions } from 'next-auth';
// import NextAuth from 'next-auth';

// const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// interface User {
//   id: string;  // ID del usuario
//   access_token: string;  // Token de acceso
//   name: string;  // Nombre del usuario
//   email: string;  // Correo del usuario
// }

// export const authOptions: NextAuthOptions = {
//   pages: {
//     signIn: "/login",  // Página de inicio de sesión
//     signOut: "/login",  // Página de cierre de sesión
//   },
//   providers: [
//     CredentialsProvider({
//       id: "Credentials",
//       name: "Credentials",
//       credentials: {
//         username: { label: "Usuario", type: "text", placeholder: "Usuario" },
//         password: { label: "Contraseña", type: "password" },
//       },
//       async authorize(credentials) {
//         // Comprueba si hay credenciales y lanza un error si faltan
//         if (!credentials?.username || !credentials?.password) {
//           throw new Error("Username and password are required.");
//         }

//         // Cuerpo de la solicitud
//         const body = JSON.stringify({
//           username: credentials.username,
//           password: credentials.password,
//         });

//         const res = await fetch(`${apiUrl}/api/login/login`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             "ngrok-skip-browser-warning": "true",
//           },
//           body: body,
//           credentials: 'include',  // Especifica el manejo de cookies
//         });

//         // Manejo de errores en la respuesta
//         if (!res.ok) {
//           console.error("Login failed:", res.status, res.statusText);
//           throw new Error("Login failed");
//         }

//         const data = await res.json();

//         // Comprueba si hay un token de acceso en los datos
//         if (data.access_token) {
//           return {
//             id: data.user.email,  // Usamos el email como ID (puedes cambiar esto según tu lógica)
//             access_token: data.access_token,
//             name: data.user.name,
//             email: data.user.email,
//           } as User;
//         }

//         // Si no hay token de acceso, devuelve null
//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     jwt: async ({ token, user }) => {
//       if (user) {
//         token.access_token = user.access_token;
//         token.name = user.name;
//         token.email = user.email;
//         token.id = user.id;
//       }
//       return token;
//     },
//     session: async ({ session, token }) => {
//       session.user = {
//         ...session.user,
//         name: token.name,
//         email: token.email,
//         access_token: token.access_token as string,
//         id: token.id as string,
//       };
//       return session;
//     },
//   },
// };

// export default NextAuth(authOptions);
