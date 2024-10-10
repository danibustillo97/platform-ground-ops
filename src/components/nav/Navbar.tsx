"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";
import { signOut, useSession } from "next-auth/react";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleDropdown = () => setShowDropdown(prev => !prev);

  return (
    <nav className={styles.navBar}>
      <div className={styles.navContainer}>
        <Image
          className={styles.logo}
          src="/images/logo.png"
          alt="Logo"
          width={120}
          height={40}
          priority
        />
        <button className={styles.menuToggle} onClick={toggleMenu}>
          &#9776;
        </button>
        <div className={`${styles.navItems} ${isMenuOpen ? styles.open : ""}`}>
          {session?.user ? (
            <>
              <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
              <Link href="/users" className={styles.navLink}>Usuarios</Link>
              <Link href="/baggage_gestion" className={styles.navLink}>Gestión de Equipajes</Link>
              <Link href="/flights" className={styles.navLink}>Vuelos</Link>
              <div className={styles.dropdown}>
                <button className={styles.userButton} onClick={toggleDropdown}>
                  {session.user?.email || "User"}
                </button>
                {showDropdown && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.userInfo}>
                      <p><strong>Nombre:</strong> {session.user?.email || "Desconocido"}</p>
                      <p><strong>Email:</strong> {session.user?.email || "Desconocido"}</p>
                    </div>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/login" className={styles.loginButton}>Iniciar Sesión</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
