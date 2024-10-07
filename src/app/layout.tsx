"use client"; // Ruta: RootLayout

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/nav/Navbar";

function RedirectHandler() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (status === "loading") return;

    if (session && isLoginPage) {
      router.push("/dashboard");
    }

    if (!session && !isLoginPage) {
      router.push("/login");
    }
  }, [session, status, pathname, router, isLoginPage]);

  return null; // No renderiza nada
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <RedirectHandler />
      <html lang="es">
        <body>
          <Navbar />
          <main>{children}</main>
        </body>
      </html>
    </SessionProvider>
  );
}
