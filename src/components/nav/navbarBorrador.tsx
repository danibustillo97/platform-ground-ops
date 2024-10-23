"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css"; // Asegúrate de que esta línea sea correcta
import { signOut, useSession } from "next-auth/react";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [editableName, setEditableName] = useState(session?.user?.email || ""); // Estado para el nombre editable
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  
  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableName(e.target.value); // Actualiza el nombre editable
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-light ${styles.navBar}`}>
      <div className="container-fluid">
        

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={false}
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

                <li
                  className={`nav-item dropdown ${showDropdown ? "show" : ""}`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`nav-link dropdown-toggle ${styles.userButton}`}
                    id="navbarDropdown"
                    role="button"
                    aria-expanded={showDropdown}
                    onClick={toggleDropdown}
                  >
                    {session.user?.email || "User"}
                  </button>
                  <ul
                    className={`dropdown-menu dropdown-menu-end ${showDropdown ? "show" : ""} ${styles.customDropdown}`}
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                    <p className="dropdown-item">
                        <strong>Email:</strong> {session.user?.email || "Desconocido"}
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








