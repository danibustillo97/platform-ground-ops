// Sidebar.tsx
import React from "react";
import { FaHome, FaUserCog } from "react-icons/fa";
import { LuBaggageClaim } from "react-icons/lu";
import { MdOutlineFlight } from "react-icons/md";
import styles from "./Sidebar.module.css";
import { GrLinkTop } from "react-icons/gr";
import { usePathname } from "next/navigation"; 
import Link from "next/link"; // Importar Link

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname(); 

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <FaHome className={styles.icon} /> },
    {
      href: "/users",
      label: "Usuarios",
      icon: <FaUserCog className={styles.icon} />,
      submenu: [
        { href: "/users/roles", label: "Roles" },
      ],
    },
    {
      href: "/baggage_gestion",
      label: "Equipaje",
      icon: <LuBaggageClaim className={styles.icon} />,
      submenu: [
        { href: "/baggage_gestion", label: "Gestionar" },
        { href: "/baggage_gestion/baggage_form_reclamo", label: "Añadir Caso" },
      ],
    },
    {
      href: "/flights",
      label: "Vuelos",
      icon: <MdOutlineFlight className={styles.icon} />,
      submenu: [
        { href: "/flights", label: "Gestionar vuelos" },
        { href: "#", label: "Registros" },
      ],
    },
  ];

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <button onClick={toggleSidebar} className={styles.closeButton}>
        <GrLinkTop />
      </button>

      <ul className={`${styles.menu}`}>
        {links.map((link, index) => (
          <li key={index} className={styles.sidebarListItem}>
            <Link href={link.href} className={`${styles.sidebarLink} ${pathname === link.href ? styles.active : ''}`}>
              {link.icon}
              <span className={styles.menuText}>{link.label}</span>
            </Link>
            {link.submenu && (
              <ul className={styles.sidebarMenu}>
                {link.submenu.map((subLink, subIndex) => (
                  <li key={subIndex} className={styles.sidebarListItem}>
                    <Link href={subLink.href} className={styles.sidebarLink}>
                      {subLink.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
