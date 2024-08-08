"use client"; // Marca el componente como Client Component

import React, { useState } from 'react';
import styles from './login.module.css';
import { AuthService } from '../../data/repositories/AuthRepository';
import { AuthAPI } from '../../data/api/AuthAPI';

const authAPI = new AuthAPI();
const authService = new AuthService(authAPI);

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(username, password);
      window.location.href = '/dashboard';  
    } catch (error) {
      console.error('Error durante el inicio de sesión', error);
    }
  };

  return (
    <div className={styles.containerLogin}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Iniciar Sesión</h1>
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Usuario</label>
            <input
              type="text"
              id="username"
              className={styles.input}
              placeholder="Tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.button}>
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
