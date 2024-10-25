"use client";
import React from "react";
import styles from "@/components/Overlay/Overlay.module.css"; 
import { MdFlight } from "react-icons/md";
import { GiCommercialAirplane } from "react-icons/gi";

const Overlay: React.FC = () => {
    return (
        <div className={`${styles.spinnerContainer}`} role="status">
            <GiCommercialAirplane className={styles.spinnerFlight} />
            
            <small className={styles.spinnerText}><h1>Cargando</h1></small>
        </div>
    );
};

export default Overlay;
