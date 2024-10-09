"use client"; 
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/nav/Navbar";
import "./globals.css";

function RedirectHandler() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (status === "loading") return;
    
    if (session && (isLoginPage || isHomePage)) {
      router.push("/dashboard");
    }
    if (!session && !isLoginPage) {
      router.push("/login");
    }
  }, [session, status, pathname, router, isLoginPage, isHomePage]);

  return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
