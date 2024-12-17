"use client";

import React from "react";
import { AiFillWindows } from "react-icons/ai";
import useLoginController from "./useLoginController";
import styles from "./login.module.css";
import Image from "next/image";
import Alert from "../../components/Alerts/Alert";

export default function LoginPage() {
    const { formData, errors, loading, handleChange, handleSubmit } = useLoginController();

    return (
        <div className={styles.pageContainer}>
            <div className={styles.outerContainer}>
                <h1 className={styles.platformTitle}>Plataforma Ods Ground</h1>
                <div className={styles.logoContainer}>
                    <Image
                        src="/images/logo.png"
                        alt="Logo de la Empresa"
                        className={styles.logo}
                        width={120}
                        height={120}
                        priority
                    />
                </div>

                <div className={styles.loginBox}>
                    <h1 className={styles.title}>Iniciar Sesión</h1>
                    <p className={styles.subtitle}>Accede con tu cuenta corporativa</p>

                    {errors.general && <Alert message={errors.general} type="error" />}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input
                                type="text"
                                name="username" 
                                id="username" 
                                placeholder="Ingresa tu email"
                                value={formData.username}
                                onChange={handleChange}
                                className={styles.input}
                            />
                            {errors.username && <p className={styles.error}>{errors.username}</p>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Ingresa tu contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                className={styles.input}
                            />
                            {errors.password && <p className={styles.error}>{errors.password}</p>}
                        </div>

                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? 'Cargando...' : 'Ingresar'}
                        </button>
                        <button type="button" className={styles.microsoftButton}>
                            <AiFillWindows className={styles.microsoftIcon} /> Ingresar con Microsoft
                        </button>
                    </form>

                    <footer className={styles.footer}>
                        <p>
                            © 2024 Arajet. <a href="/terminos">Términos y condiciones</a> |{" "}
                            <a href="/soporte">Soporte</a>
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}