// RootLayout.tsx
"use client"; 
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react"; 
import Navbar from "@/components/nav/Navbar";
import Sidebar from "@/components/sidebars/Sidebar"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';


function RedirectHandler() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (status === "loading") return;

    if (typeof window !== "undefined") {
      if (session && (isLoginPage || isHomePage)) {
        router.push("/dashboard");
      }
      if (!session && !isLoginPage) {
        router.push("/login");
      }
    }
  }, [session, status, pathname, router, isLoginPage, isHomePage]);

  return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const isLoginPage = pathname === "/login";

  const [sidebarOpen, setSidebarOpen] = useState(true); // Cambiado a true
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    if (typeof window !== "undefined") {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <SessionProvider>
      <RedirectHandler />
      
      <html lang="es">  {/* Etiqueta html añadida aquí */}
        <body>         {/* Etiqueta body añadida aquí */}
          {!isLoginPage && <Navbar toggleSidebar={toggleSidebar} />}
          <div className="page-holder">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <main className={`content ${sidebarOpen ? "shifted" : ""}`}>
              {children}
            </main>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
