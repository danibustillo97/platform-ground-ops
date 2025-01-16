import React, { useRef, useState } from "react";
import { useFormBaggageController } from "./form_baggage_controller";
import styles from "@/view/baggage/form_baggage/form_baggage_view.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MdOutlineClear } from "react-icons/md";
import Alert from "@/components/Alerts/Alert";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import Select from 'react-select';
import { CircularProgress } from "@mui/material"; // Importar el cargador

const FormReclamoView: React.FC = () => {
    const {
        loading,
        pnr,
        setPnr,
        pnrAdded,
        handleAddPnr,
        passengerData,
        selectedPassenger,
        setSelectedPassenger,
        luggageList,
        selectedLuggage,
        formData,
        setFormData,
        handlePassengerChange,
        handleLuggageSelect,
        handleRemoveLuggage,
        handleDescriptionChange,
        handleIssueChange,
        handleCreateCases,
        alert,
        setAlert,
        resetForm,
        isLoading, // Agregar el estado de carga
    } = useFormBaggageController();

    const toast = useRef<Toast>(null);

    const accept = () => {
        toast.current?.show({ severity: "info", summary: "Confirmado", detail: "Acción confirmada", life: 3000 });
        handleCreateCases();
    };

    const reject = () => {
        toast.current?.show({ severity: "warn", summary: "Rechazado", detail: "Acción cancelada", life: 3000 });
    };

    const handleCreateCase = () => {
        handleCreateCases();
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const address = e.target.value;
        const regex = /^(Cra|Calle|Av\.|APT)\s?\d+.*$/;

        if (regex.test(address)) {
            setFormData({ ...formData, address });
        } else {
            setFormData({ ...formData, address: address });
        }
    };

    const popUpCreateCase = (event: { currentTarget: any; }) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            acceptClassName: `${styles.customButton}`,
            rejectClassName: `${styles.customButton} ${styles.customRejectButton}`,
            className: `${styles.customPopup}`,
            accept: accept,
            reject
        });
    };

    const popUpBack = (event: { currentTarget: any }) => {
        confirmPopup({
            target: event.currentTarget,
            message: "¿Estás seguro de que deseas volver?",
            icon: "pi pi-exclamation-triangle",
            accept: () => window.history.back(),
            reject,
            className: "custom-confirm-popup"
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        console.log("Archivo seleccionado:", file);
    };

    const handleCancelPnr = () => {
        resetForm();
        setPnr("");
        setSelectedPassenger(null); // Limpiar la selección de pasajero
    };

    const passengerOptions = passengerData.map((passenger) => ({
        value: `${passenger.Pax_Name}|${passenger.From_Airport}|${passenger.To_Airport}`,
        label: (
            <div>
                <strong>{passenger.Pax_Name}</strong>
                <br />
                <small style={{ color: 'gray' }}>{passenger.From_Airport} - {passenger.To_Airport}</small>
                <br />
                <small style={{ color: 'gray' }}>"DM-{passenger.Flight_Num}"</small>
            </div>
        ),
    }));

    const luggageOptions = luggageList.map((luggage) => ({
        value: luggage,
        label: luggage,
    }));

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Registro de Pérdida de Equipaje</h1>

            {loading ? (
                <h1>Cargando...</h1>
            ) : (
                <>
                    {alert && (
                        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                    )}
                    <form className={styles.form}>
                        <div className={styles.formGroupPnr}>
                            <label htmlFor="pnr" className={styles.label}>PNR</label>
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
                                    className={`${styles.pnrButton} ${pnrAdded ? styles.success : ""}`}
                                    onClick={handleAddPnr}
                                    disabled={pnrAdded || isLoading}
                                >
                                    {isLoading ? <CircularProgress size={24} /> : pnrAdded ? <CheckCircleIcon /> : <AddCircleOutlineIcon />}
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.pnrButton} ${pnrAdded ? styles.error : ""}`}
                                    onClick={handleCancelPnr}
                                    disabled={!pnrAdded || isLoading}
                                >
                                    {!pnrAdded ? <MdOutlineClear /> : <MdOutlineClear />}
                                </button>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="passenger" className={styles.label}>Pasajero</label>
                            <Select
                                id="passenger"
                                className={styles.select}
                                value={passengerOptions.find((option) => option.value === `${selectedPassenger?.Pax_Name}|${selectedPassenger?.fromAirport}|${selectedPassenger?.toAirport}`)}
                                onChange={(selectedOption) => {
                                    const [Pax_Name, fromAirport, toAirport] = selectedOption?.value.split('|') || [];
                                    setSelectedPassenger({ Pax_Name, fromAirport, toAirport });
                                    handlePassengerChange({
                                        target: { value: selectedOption?.value || "" },
                                    } as React.ChangeEvent<HTMLSelectElement>);
                                }}
                                options={passengerOptions}
                                isDisabled={!pnrAdded || isLoading}
                            />
                        </div>

                        <div className={styles.inlineFields}>
                            <div className={styles.inlineField}>
                                <label htmlFor="phone" className={styles.label}>Número de Teléfono/Celular</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className={styles.input}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!pnrAdded || isLoading}
                                />
                            </div>
                            <div className={styles.inlineField}>
                                <label htmlFor="email" className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={styles.input}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!pnrAdded || isLoading}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="luggage" className={styles.label}>Maleta (Código)</label>
                            <Select
                                id="luggage"
                                className={styles.select}
                                value={luggageOptions.find((option) => option.value === selectedLuggage.find((luggage) => luggage.luggage)?.luggage)}
                                onChange={(selectedOption) => {
                                    handleLuggageSelect({
                                        target: { value: selectedOption?.value || "" },
                                    } as React.ChangeEvent<HTMLSelectElement>);
                                }}
                                options={luggageOptions}
                                isDisabled={!selectedPassenger || isLoading}
                            />
                        </div>

                        <div className={styles.selectedLuggageContainer}>
                            {selectedLuggage.map(({ id, luggage, phone, email, flightNum, departureDate, fromAirport, toAirport, passengerName, description, issue }) => (
                                <div key={id} className={styles.luggageItem}>
                                    <div className={styles.luggageHeader}>
                                        <span className={styles.passengerName}>{passengerName} - Tag: <span className={styles.tagName}>{luggage}</span></span>
                                        <button
                                            type="button"
                                            className={styles.removeButton}
                                            onClick={() => handleRemoveLuggage(id)}
                                            disabled={isLoading}
                                        >
                                            <DeleteOutlineIcon />
                                        </button>
                                    </div>
                                    <div className={styles.luggageDetails}>
                                        <p><strong>Número de Teléfono:</strong> {phone}</p>
                                        <p><strong>Email:</strong> {email}</p>
                                        <p><strong>Número de Vuelo:</strong> {flightNum}</p>
                                        <p><strong>Fecha de Salida:</strong> {departureDate}</p>
                                        <p><strong>Aeropuerto de Origen:</strong> {fromAirport}</p>
                                        <p><strong>Aeropuerto de Destino:</strong> {toAirport}</p>
                                        <div className={styles.luggageField}>
                                            <label htmlFor={`description-${id}`} className={styles.label}>Descripción</label>
                                            <textarea
                                                id={`description-${id}`}
                                                className={styles.textarea}
                                                value={description}
                                                onChange={(e) => handleDescriptionChange(id, e.target.value)}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className={styles.luggageField}>
                                            <label htmlFor={`issue-${id}`} className={styles.label}>Tipo de Problema</label>
                                            <select
                                                id={`issue-${id}`}
                                                className={styles.select}
                                                value={issue}
                                                onChange={(e) => handleIssueChange(id, e.target.value)}
                                                disabled={isLoading}
                                            >
                                                <option value="">Seleccionar tipo</option>
                                                <option value="Daño">Daño</option>
                                                <option value="Pérdida">Pérdida</option>
                                                <option value="Retraso">Retraso</option>
                                                <option value="Sobrante">Sobrante</option>
                                            </select>
                                        </div>
                                        {issue === 'Daño' && (
                                            <div className={styles.luggageField}>
                                                <label htmlFor="file" className={styles.label}>Adjuntar Archivo</label>
                                                <input
                                                    type="file"
                                                    id="file"
                                                    className={styles.input}
                                                    onChange={handleFileChange}
                                                    multiple
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        )}
                                        {issue === 'Retraso' && (
                                            <div className={styles.luggageField}>
                                                <label htmlFor={`address-${id}`} className={styles.label}>Dirección</label>
                                                <div className={styles.addressContainer}>
                                                    <input
                                                        type="text"
                                                        id={`address-${id}`}
                                                        className={styles.input}
                                                        placeholder="Ej. Cra Calle 45 #123 APT 202"
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                        disabled={isLoading}
                                                    />
                                                    <small className={styles.infoText}>
                                                        Usa prefijos como: "Cra", "Calle", "Av.", "APT", etc. Ejemplo: "Cra 15 #45-67 APT 305"
                                                    </small>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.buttonContainer}>
                            <button
                                type="button"
                                className={styles.createButton}
                                onClick={handleCreateCase}
                                disabled={loading || selectedLuggage.length === 0 || isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Crear Casos'}
                            </button>
                        </div>
                    </form>
                    <Toast ref={toast} />
                </>
            )}
            {isLoading && (
                <div className={styles.overlay}>
                    <CircularProgress size={50} style={{ color: '#510C76' }} />
                </div>
            )}
        </div>
    );
};

export default FormReclamoView;
