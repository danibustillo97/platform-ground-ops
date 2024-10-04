"use client"; // Asegúrate de incluir esto al principio

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react"; // Importa SessionProvider
import { usePathname } from "next/navigation";
import Navbar from "@/components/nav/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <SessionProvider>
      <html lang="en">
        <body>
          {!isLoginPage && <Navbar />}
          <main>
            {children}
          </main>
        </body>
      </html>
    </SessionProvider>
  );
}
