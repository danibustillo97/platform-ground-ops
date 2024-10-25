"use client";
import React from "react";
import styles from "@/components/Overlay/Overlay.module.css"; 
import { MdFlight } from "react-icons/md";

const Overlay: React.FC = () => {
    return (
        <div className={`${styles.spinnerContainer}`} role="status">
            <MdFlight className={styles.spinnerFlight} />
            <small className={styles.spinnerText}><h1>Cargando</h1></small>
        </div>
    );
};

export default Overlay;
