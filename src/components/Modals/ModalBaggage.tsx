import React from "react";
import styles from "./Modal.module.css";
import { BaggageCase, Status } from "@/types/BaggageCase";
import useModalBaggageController from "./useModalBaggageController";

interface ModalBaggageProps {
  isOpen: boolean;
  onClose: () => void;
  details: BaggageCase;
  onSave: (updatedDetails: BaggageCase) => void;
}

const ModalBaggage: React.FC<ModalBaggageProps> = ({ isOpen, onClose, details, onSave }) => {
  // Mover la llamada al hook fuera de la condición
  const {
    phone,
    email,
    status,
    handlePhoneChange,
    handleEmailChange,
    handleStatusChange,
    handleSubmit,
  } = useModalBaggageController(details, onSave);

  // Verificar si el modal debe estar abierto
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Información</h2>
        <form onSubmit={handleSubmit}>
          <p>
            <strong>Baggage Code:</strong> {details.baggage_code}
          </p>
          <p>
            <strong>Teléfono:</strong>
            <input
              type="phone"
              value={phone}
              onChange={handlePhoneChange}
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
          <button type="submit" className={styles.saveButton}>
            Actualizar
          </button>
          <button type="button" onClick={onClose} className={styles.closeButton}>
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalBaggage;
