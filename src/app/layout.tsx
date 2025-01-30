"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import Sidebar from "@/components/sidebars/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";  // Verificamos si estamos en la página de login
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <html lang="es">
            <body>
                {/* Se asegura de que el contenido esté dentro del contenedor adecuado */}
                <div className="page-holder" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                    {/* Navbar solo se renderiza si no estamos en la página de login */}
                    {!isLoginPage && <Navbar toggleSidebar={toggleSidebar} notifications={[]} session={null} />}
                    <div style={{ display: 'flex', flex: 1 }}>
                        {/* Sidebar */}
                        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        {/* Contenido principal */}
                        <main className={`content ${sidebarOpen ? "shifted" : ""}`} style={{ flex: 1, overflowY: 'auto' }}>
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}
