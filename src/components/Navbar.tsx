import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  return (
    <>
      <div className={styles.topBar}>
        <a href="#support" className={styles.topLink}>
          SUPPORT
        </a>
        <span className={styles.separator}>|</span>
        <a href="#agent-portal" className={styles.topLink}>
          AGENT PORTAL
        </a>
        <span className={styles.separator}>|</span>
        <a href="#language" className={styles.topLink}>
          LANGUAGE
        </a>
      </div>

      <nav className={styles.navBar}>
        <div
          className={`${styles.navContainer} container mx-auto px-4 py-2 flex items-center`}
        >
          <div className="flex items-center">
            <Image
              className={styles.logo}
              src="/images/logo.png"
              alt="Logo"
              width={100}
              height={100}
              priority
            />
          </div>
          <div className={`${styles.navItems} flex items-center space-x-4`}>
            <Link href="/" className={styles.navLink}>
              Dashboard
            </Link>
            <Link href="/users" className={styles.navLink}>
              Usuarios
            </Link>
            <Link href="/baggage_gestion" className={styles.navLink}>
              Gestión de Equipajes
            </Link>
            <button className={styles.loginButton}>Login</button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
