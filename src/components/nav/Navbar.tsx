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
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-light ${styles.navBar}`}>
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">
          <Image
            className={styles.logo}
            src="/images/logo.png"
            alt="Logo"
            width={120}
            height={40}
            priority
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {session?.user ? (
              <>
                <li className="nav-item">
                  <Link href="/dashboard" className={`nav-link ${styles.navLink}`}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/users" className={`nav-link ${styles.navLink}`}>
                    Usuarios
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/baggage_gestion" className={`nav-link ${styles.navLink}`}>
                    Gestión de Equipajes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/flights" className={`nav-link ${styles.navLink}`}>
                    Vuelos
                  </Link>
                </li>

                <li className={`nav-item dropdown ${showDropdown ? "show" : ""}`}>
                  <button
                    className={`nav-link dropdown-toggle ${styles.userButton}`}
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded={showDropdown}
                    onClick={toggleDropdown}
                  >
                    {session.user?.email || "User"}
                  </button>
                  <ul
                    className={`dropdown-menu dropdown-menu-end ${showDropdown ? "show" : ""}`}
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <p className="dropdown-item">
                        <strong>Nombre:</strong> {session.user?.email || "Desconocido"}
                      </p>
                    </li>
                    <li>
                      <p className="dropdown-item">
                        <strong>Email:</strong> {session.user?.email || "Desconocido"}
                      </p>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className={`dropdown-item ${styles.logoutButton}`} onClick={handleLogout}>
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link href="/login" className={`nav-link ${styles.navLink}`}>
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
