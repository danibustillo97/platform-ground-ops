"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { usePathname } from "next/navigation";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body>
        {!isLoginPage && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;
