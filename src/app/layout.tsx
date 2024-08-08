"use client"; // Marca el componente como Client Component

import React from "react";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { usePathname } from "next/navigation";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname(); // Obtén la ruta actual

  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body>
        {!isLoginPage && <Navbar />}{" "}
        {/* Muestra el Navbar solo si no es la página de login */}
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;
