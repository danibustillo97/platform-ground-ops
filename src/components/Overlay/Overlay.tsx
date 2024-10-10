//Cargador
import React from "react";
import styles from "./Overlay.module.css";


const Overlay: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
            <p className={styles.message}>Cargando...</p>
        </div>
    );
}

export default Overlay;


