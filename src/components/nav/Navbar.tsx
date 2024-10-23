"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import styles from "@/components/nav/Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


// ICONOS
import { FaHome, FaUserCog } from 'react-icons/fa';
import { CiLogout } from "react-icons/ci";
import { LuBaggageClaim } from "react-icons/lu";
import { MdOutlineFlight } from "react-icons/md";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

  // Obtener la ruta actual
  const currentPath = usePathname();


  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg px-4 py-2 bg-light shadow">
        <a className="sidebar-toggler text-gray-500 me-4" href="#">
          <i className="fas fa-align-left"></i>
        </a>
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
        <ul className="navbar-nav mx-auto">
          <li className="nav-item">
            <Link 
              href="/dashboard" 
              className={`nav-link ${styles.navLink} ${currentPath === "/dashboard" ? styles.active : ""}`}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              href="/users" 
              className={`nav-link ${styles.navLink} ${currentPath === "/users" ? styles.active : ""}`}
            >
              <span><FaUserCog /></span> Usuarios 
            </Link>
          </li>
          <li className="nav-item"> 
            <Link 
              href="/baggage_gestion" 
              className={`nav-link ${styles.navLink} ${currentPath === "/baggage_gestion" ? styles.active : ""}`}
            >
              <LuBaggageClaim /> Gestión de Equipajes
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              href="/flights" 
              className={`nav-link ${styles.navLink} ${currentPath === "/flights" ? styles.active : ""}`}
            >
              <MdOutlineFlight /> Vuelos
            </Link>
          </li>
        </ul>
        <ul className="ms-auto d-flex align-items-center list-unstyled mb-0">
          <li className="nav-item dropdown me-2">
            <a className="nav-link nav-link-icon text-gray-400" id="notifications" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i className="icon-notifications"></i>
              <span className="notification-badge bg-green"></span>
            </a>
            <div className="dropdown-menu dropdown-menu-end text-sm" aria-labelledby="notifications">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link href="/flights" className={`nav-link ${styles.navLink}`}>
                    Vuelos
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          {/* User Info */}
          {session && session.user ? (
            <li className="nav-item dropdown ms-auto">
              <a className="nav-link" id="userInfo" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img className={`bg-primary text-white ${styles.avatar}`} src="https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg?semt=ais_hybrid" alt="User Avatar" />
              </a>
              <div className="dropdown-menu dropdown-menu-end" aria-labelledby="userInfo">
                <div className="dropdown-header">
                  <h6 className="text-uppercase">{session.user.name}</h6>
                  <small>{session.user.email}</small>
                </div>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">Activity Logs</a>
                <a className="dropdown-item d-flex justify-content-between" href="#" onClick={handleLogout}>
                  Logout <span><CiLogout className={`${styles.iconLogout}`} /></span>
                </a>
              </div>
            </li>
          ) : (
            <li className="nav-item">
              <Link href="/login" className="nav-link">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
