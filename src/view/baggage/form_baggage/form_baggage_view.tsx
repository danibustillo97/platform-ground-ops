"use client";

import React, { useState } from "react";
import styles from "@/view/baggage/form_baggage/form_baggage_view.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const FormReclamoView: React.FC = () => {
    const [pnr, setPnr] = useState("");
    const [pnrAdded, setPnrAdded] = useState(false);
    const [selectedPassenger, setSelectedPassenger] = useState<string>("");
    const [luggageList, setLuggageList] = useState<string[]>([]);
    const [selectedLuggage, setSelectedLuggage] = useState<
        { luggage: string; phone: string; email: string }[]
    >([]);
    const [formData, setFormData] = useState({ phone: "", email: "" });

    // Información de pasajeros con datos de contacto
    const passengerData: Record<
        string,
        { luggages: string[]; phone: string; email: string }
    > = {
        "1": {
            luggages: ["L001", "L002"],
            phone: "123-456-7890",
            email: "ana.perez@example.com",
        },
        "2": {
            luggages: ["L003", "L004"],
            phone: "987-654-3210",
            email: "luis.garcia@example.com",
        },
        "3": {
            luggages: ["L005"],
            phone: "555-555-5555",
            email: "maria.fernandez@example.com",
        },
    };

    const handleAddPnr = () => {
        if (pnr.trim()) {
            setPnrAdded(true);
        }
    };

    const handlePassengerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const passenger = e.target.value;
        setSelectedPassenger(passenger);
        const passengerInfo =
            passengerData[passenger as keyof typeof passengerData];
        setLuggageList(passengerInfo?.luggages || []);
        setFormData({
            phone: passengerInfo?.phone || "",
            email: passengerInfo?.email || "",
        });
    };

    const handleLuggageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const luggage = e.target.value;
        if (
            luggage &&
            !selectedLuggage.some((item) => item.luggage === luggage)
        ) {
            setSelectedLuggage([
                ...selectedLuggage,
                { luggage, phone: formData.phone, email: formData.email },
            ]);
        }
    };

    const handleRemoveLuggage = (luggage: string) => {
        setSelectedLuggage(
            selectedLuggage.filter((item) => item.luggage !== luggage),
        );
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Registro de Pérdida de Equipaje</h1>
            <form className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="pnr" className={styles.label}>
                        PNR
                    </label>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            id="pnr"
                            className={styles.input}
                            value={pnr}
                            onChange={(e) => setPnr(e.target.value)}
                            disabled={pnrAdded}
                        />
                        <button
                            type="button"
                            className={`${styles.pnrButton} ${
                                pnrAdded ? styles.success : ""
                            }`}
                            onClick={handleAddPnr}
                            disabled={pnrAdded}
                        >
                            {pnrAdded ? (
                                <CheckCircleIcon />
                            ) : (
                                <AddCircleOutlineIcon />
                            )}
                        </button>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="passenger" className={styles.label}>
                        Pasajero
                    </label>
                    <select
                        id="passenger"
                        className={styles.select}
                        value={selectedPassenger}
                        onChange={handlePassengerChange}
                        disabled={!pnrAdded}
                    >
                        <option value="">Seleccionar pasajero</option>
                        <option value="1">Ana Pérez</option>
                        <option value="2">Luis García</option>
                        <option value="3">María Fernández</option>
                    </select>
                </div>

                <div className={styles.inlineFields}>
                    <div className={styles.inlineField}>
                        <label htmlFor="phone" className={styles.label}>
                            Número de Teléfono/Celular
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            className={styles.input}
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })
                            }
                            disabled={!pnrAdded}
                        />
                    </div>
                    <div className={styles.inlineField}>
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            disabled={!pnrAdded}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="luggage" className={styles.label}>
                        Maleta (Código)
                    </label>
                    <select
                        id="luggage"
                        className={styles.select}
                        onChange={handleLuggageSelect}
                        disabled={!selectedPassenger}
                    >
                        <option value="">Seleccionar maleta</option>
                        {luggageList.map((luggage) => (
                            <option key={luggage} value={luggage}>
                                {luggage}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.selectedLuggageContainer}>
                    {selectedLuggage.map(({ luggage, phone, email }) => (
                        <div key={luggage} className={styles.luggageItem}>
                            <div className={styles.luggageHeader}>
                                <span>{luggage}</span>
                                <button
                                    type="button"
                                    className={styles.removeButton}
                                    onClick={() => handleRemoveLuggage(luggage)}
                                >
                                    <DeleteOutlineIcon />
                                </button>
                            </div>
                            <textarea
                                placeholder="Descripción de la maleta"
                                className={styles.textarea}
                                disabled={!pnrAdded}
                            />
                            <div className={styles.inlineFields}>
                                <div className={styles.inlineField}>
                                    <label
                                        htmlFor={`issue-${luggage}`}
                                        className={styles.label}
                                    >
                                        Problema relacionado con
                                    </label>
                                    <select
                                        id={`issue-${luggage}`}
                                        className={styles.select}
                                    >
                                        <option value="">
                                            Seleccionar problema
                                        </option>
                                        <option value="Articulo Perdido">
                                            Artículo Perdido
                                        </option>
                                        <option value="Retraso De Equipaje">
                                            Retraso De Equipaje
                                        </option>
                                        <option value="Daño De Equipaje">
                                            Daño De Equipaje
                                        </option>
                                        <option value="Equipaje Perdido">
                                            Equipaje Perdido
                                        </option>
                                    </select>
                                </div>
                                <div className={styles.inlineField}>
                                    <p>Teléfono: {phone}</p>
                                    <p>Email: {email}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.buttonContainer}>
                    <button type="button" className={styles.backButton}>
                        <ArrowBackIcon />
                        Volver
                    </button>
                    <button type="submit" className={styles.submitButton}>
                        Registrar Evento
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormReclamoView;
