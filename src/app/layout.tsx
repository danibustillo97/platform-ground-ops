"use client";

import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { usePathname } from "next/navigation";
import Overlay from "@/components/Overlay/Overlay";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body>
        {!isLoginPage && <Navbar />}
        <main>
          <Suspense fallback={<Overlay />}>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
};

export default Layout;
