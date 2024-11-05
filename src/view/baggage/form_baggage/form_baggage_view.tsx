"use client";
import React, { useRef } from "react";
import { useFormBaggageController } from "./form_baggage_controller";
import styles from "@/view/baggage/form_baggage/form_baggage_view.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Alert from "@/components/Alerts/Alert";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";

const FormReclamoView: React.FC = () => {
    const {
        loading,
        pnr,
        setPnr,
        pnrAdded,
        handleAddPnr,
        passengerData,
        selectedPassenger,
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
    } = useFormBaggageController();

    const toast = useRef<Toast>(null);

    const accept = () => {
        toast.current?.show({ severity: "info", summary: "Confirmado", detail: "Acción confirmada", life: 3000 });
        handleCreateCases();
    };

    const reject = () => {
        toast.current?.show({ severity: "warn", summary: "Rechazado", detail: "Acción cancelada", life: 3000 });
    };


    const consolePrueba = () => console.log("click")

    const popUpCreateCase = (event: { currentTarget: any; }) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => handleCreateCases,
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
    return (


        <div className={styles.container}>
            <div className="container d-flex">
                <div className="row">
                    <div className="col-md-6 d-flex align-items-center">
                        <button
                            type="button"
                            className={styles.backButton}
                            onClick={popUpBack}
                        >
                            <ArrowBackIcon />
                        </button>
                        <span className={styles.backText}>Volver</span>
                    </div>

                </div>
            </div>


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
                                    disabled={pnrAdded}
                                >
                                    {pnrAdded ? <CheckCircleIcon /> : <AddCircleOutlineIcon />}
                                </button>
                            </div>
                        </div>


                        <div className={styles.formGroup}>
                            <label htmlFor="passenger" className={styles.label}>Pasajero</label>
                            <select
                                id="passenger"
                                className={styles.select}
                                value={selectedPassenger}
                                onChange={handlePassengerChange}
                                disabled={!pnrAdded}
                            >
                                <option value="">Seleccionar pasajero</option>
                                {passengerData.map((passenger, index) => (
                                    <option key={index} value={passenger.Pax_Name}>{passenger.Pax_Name}</option>
                                ))}
                            </select>
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
                                    disabled={!pnrAdded}
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
                                    disabled={!pnrAdded}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="luggage" className={styles.label}>Maleta (Código)</label>
                            <select
                                id="luggage"
                                className={styles.select}
                                onChange={handleLuggageSelect}
                                disabled={!selectedPassenger}
                            >
                                <option value="">Seleccionar maleta</option>
                                {luggageList.map((luggage) => (
                                    <option key={luggage} value={luggage}>{luggage}</option>
                                ))}
                            </select>
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
                                            />
                                        </div>
                                        <div className={styles.luggageField}>
                                            <label htmlFor={`issue-${id}`} className={styles.label}>Tipo de Problema</label>
                                            <select
                                                id={`issue-${id}`}
                                                className={styles.select}
                                                value={issue}
                                                onChange={(e) => handleIssueChange(id, e.target.value)}
                                            >
                                                <option value="">Seleccionar tipo</option>
                                                <option value="Daño">Daño</option>
                                                <option value="Pérdida">Pérdida</option>
                                                <option value="Retraso">Retraso</option>
                                                <option value="Sobrante">Sobrante</option>
                                            </select>
                                        </div>
                                        {issue === 'Retraso' && (
                                            <div className={styles.luggageField}>
                                                <div className={styles.inlineField}>
                                                    <label htmlFor="address" className={styles.label}>Dirección de envío</label>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        className={styles.input}
                                                        value={formData.address}
                                                        disabled={!pnrAdded}
                                                    />
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
                                onClick={popUpCreateCase}
                                disabled={loading || selectedLuggage.length === 0}
                            >
                                Crear Casos
                            </button>
                        </div>
                    </form>
                    <Toast ref={toast} />
                </>
            )}
        </div>
    );
};

export default FormReclamoView;
