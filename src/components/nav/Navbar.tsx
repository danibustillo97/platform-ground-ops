"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import styles from "@/components/nav/Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { CiLogout } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";

interface NavbarProps {
  toggleSidebar: () => void; // Propiedad para alternar el sidebar
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <header className={`${styles.header}`}>
      <nav className="navbar navbar-expand-lg px-3 py-2 bg-light shadow flex-nowrap">
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

        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="navbar-nav mx-auto">
            {/* Aquí se pueden agregar enlaces si lo deseas */}
          </div>
          <ul className="d-flex align-items-center list-unstyled mb-0">
            {session && session.user ? (
              <li className="nav-item dropdown">
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
            <li className="nav-item">
              <button onClick={toggleSidebar} className="btn btn-outline-primary">
                <RxHamburgerMenu />
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
