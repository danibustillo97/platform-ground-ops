"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import styles from "@/components/nav/Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ICONOS
import { FaHome, FaUserCog } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { LuBaggageClaim } from "react-icons/lu";
import { MdOutlineFlight } from "react-icons/md";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const toggleNavbar = () => setNavbarOpen(!navbarOpen);

  const currentPath = usePathname();

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg px-4 py-2 bg-light shadow">
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
        
        {/* User Info (Avatar) moved before the toggle button */}
        <ul className="ms-auto d-flex align-items-center list-unstyled mb-0">
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

        {/* Toggle button for mobile view */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleNavbar} 
          aria-controls="navbarContent"
          aria-expanded={navbarOpen ? "true" : "false"} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible menu */}
        <div className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`} id="navbarContent">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link 
                href="/dashboard" 
                className={`nav-link ${styles.navLink} ${currentPath === "/dashboard" ? styles.active : ""}`}
              >
                <FaHome /> Dashboard
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
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
