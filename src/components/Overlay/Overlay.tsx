"use client"; // Agrega esto al inicio de tu archivo
import React from "react";
import styles from "@/view/dashboard/DashboardPage.module.css"; // Importa tus estilos aquí

const Overlay = () => {
    return (
        <div className={styles.overlay}>
            <div className={styles.spinnerBorder} role="status">
                <span className={styles.visuallyHidden}>Loading...</span>
            </div>
        </div>
    );
};

export default Overlay;
