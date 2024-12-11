// components/Alert.tsx

import React from 'react';
import styles from './Alert.module.css';
import { MdOutlineReportGmailerrorred } from "react-icons/md";


interface AlertProps {
  type: 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const iconMap = {
    success: '✅',
    warning: '⚠️',
    error: <MdOutlineReportGmailerrorred className={styles.iconError}/>,
  };

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span className={styles.icon}>{iconMap[type]}</span>
      <span>{message}</span>
      {onClose && (
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
