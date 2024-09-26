"use client";

import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { usePathname } from "next/navigation";
import Overlay from "@/components/Overlay/Overlay";
import SessionAuthProvider from "@/domain/context/SessionAuthProvider";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <SessionAuthProvider>
    <html lang="en">
      <body>
        {!isLoginPage && <Navbar />}
        <main>
          {children} 
        </main>
      </body>
    </html>
    </SessionAuthProvider>
  );
};

export default Layout;
