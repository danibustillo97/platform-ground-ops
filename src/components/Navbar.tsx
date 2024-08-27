// src/view/components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Providers } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
import { useIsSignedIn } from "@microsoft/mgt-react";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    Providers.globalProvider = new Msal2Provider({
      clientId: "bc659d2e-d885-4653-89a9-64a249dcad75",
      authority:
        "https://login.microsoftonline.com/e91262c3-f4c7-4e85-9e7c-70df74040857",
      redirectUri: "http://localhost:3000",
      scopes: ["user.read", "profile"],
    });

    const checkAuthentication = async () => {
      const provider = Providers.globalProvider;
      if (provider) {
        try {
          const isSignedIn = (await provider.getAccessToken()) !== null;
          setIsAuthenticated(isSignedIn);
          if (provider.graph) {
            const userData = await provider.graph.client.api("/me").get();
            setUserInfo(userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    checkAuthentication();
  }, [router]);

  const handleLogout = async () => {
    const provider = Providers.globalProvider;
    if (provider && typeof provider.logout === "function") {
      try {
        await provider.logout();
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
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
          {isAuthenticated ? (
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
                  <button
                    className={styles.logoutButton}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
