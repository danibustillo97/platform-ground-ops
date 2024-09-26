"use client";
import { SessionProvider } from "next-auth/react";

interface Props {
    children: React.ReactNode;
}

const SessionAuthProvider = ({ children }: Props) => {
    return <SessionProvider baseUrl={'https://localhost:3000'} basePath={process.env.NEXTAUTH_URL}>{children}</SessionProvider>;
};

export default SessionAuthProvider;
