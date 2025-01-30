"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import Sidebar from "@/components/sidebars/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import BaggageTable from "@/view/baggage/BaggageTable/BaggageTable";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const [notifications, setNotifications] = useState<{ message: string; time: string }[]>([]);


    // const handleNotificationChange = (newNotifications: { message: string; time: string }[]) => {
    //     setNotifications(newNotifications);
    // };



   

    return (
        <html lang="es">
            <body>
                <div className="page-holder">
                    <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                    <main className={`content ${sidebarOpen ? "shifted" : ""}`}>
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
