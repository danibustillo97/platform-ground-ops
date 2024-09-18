// src/view/components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "@/components/Navbar.module.css"

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {}, [router]);

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    router.push("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          <Link href="/dashboard" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/users" className={styles.navLink}>
            Usuarios
          </Link>
          <Link href="/baggage_gestion" className={styles.navLink}>
            Gestión de Equipajes
          </Link>

          <div className={styles.dropdown}>
            <button
              className={styles.navLink}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {userInfo?.displayName || "User"}
            </button>
            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <p>
                  <strong>Name:</strong> {userInfo?.displayName}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {userInfo?.mail || userInfo?.userPrincipalName}
                </p>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>

          <Link href="/login" className={styles.loginButton}>
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
