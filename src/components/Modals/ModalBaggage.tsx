import React from "react";
import styles from "./Modal.module.css";
import { BaggageCase, Status } from "@/types/BaggageCase";
import useModalBaggageController from "./useModalBaggageController";

interface ModalBaggageProps {
  isOpen: boolean;
  onClose: () => void;
  details: BaggageCase | null; // Permitir que details sea null
  onSave: (updatedDetails: BaggageCase) => void;
}

const ModalBaggage: React.FC<ModalBaggageProps> = ({ isOpen, onClose, details, onSave }) => {
  // Si details es null, no se puede utilizar
  if (!details) return null;

  const {
    phone,
    email,
    status,
    handlePhoneChange,
    handleEmailChange,
    handleStatusChange,
    handleSubmit,
  } = useModalBaggageController(details, onSave);


  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Información de Equipaje</h2>
        <form onSubmit={handleSubmit}>
          <p>
            <strong>Código de Equipaje:</strong> {details.baggage_code}
          </p>
          <p>
            <strong>Teléfono:</strong>
            <input
              type="tel" 
              value={phone}
              onChange={handlePhoneChange}
              required 
              className={styles.input} // Aplicar clase de módulo
            />
          </p>
          <p>
            <strong>Nombre Pasajero:</strong> {details.passenger_name}
          </p>
          <p>
            <strong>Email:</strong>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required // Asegura que el campo no esté vacío
              className={styles.input} // Aplicar clase de módulo
            />
          </p>
          <p>
            <strong>Tipo de Problema:</strong> {details.issue_type}
          </p>
          <p>
            <strong>Estado:</strong>
            <select
              value={status}
              onChange={handleStatusChange}
              className={styles.select} // Aplicar clase de módulo
            >
              {Object.values(Status).map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </p>
          <p>
            <strong>Fecha de Creación:</strong> {new Date(details.date_create.split("T")[0]).toLocaleDateString()}
          </p>
          <div className={styles.buttonGroup}>
            <button type="submit" className={`${styles.button} ${styles.saveButton}`}>
              Actualizar
            </button>
            <button type="button" onClick={onClose} className={`${styles.button} ${styles.closeButton}`}>
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalBaggage;
