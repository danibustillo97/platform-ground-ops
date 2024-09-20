// src/view/login/LoginPage.tsx
"use client";
import Overlay from "@/components/Overlay/Overlay";
import React, { useEffect, useState } from "react";
import styles from "@/view/login/login.module.css"
import { useRouter } from "next/navigation";
import useLoginController from "./useLoginController";
// import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl";

// const authRepo = new AuthRepositoryImpl();

export default function LoginPage() {
  const {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
  } = useLoginController();

  return (
    <>
      {loading ? <Overlay /> :
        <div className={styles.pageContainer}>
          <div className={styles.container}>
            <h1 className={styles.title}>Login</h1>
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="username">Usuario</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="username"
                    id="username"
                    placeholder="usuario"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && <p className={styles.error}>{errors.username}</p>}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="password">Contraseña</label>
                  <input
                    className={styles.input}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="contraseña"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <p className={styles.error}>{errors.password}</p>}
                </div>
                <button className={styles.button} type="submit">
                  Ingresar
                </button>
              </form>
            </div>
          </div>
        </div>
      }
    </>
  );
}
