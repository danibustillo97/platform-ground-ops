"use client";

import React from "react";
import { useBaggageCasesController } from "./useBaggageCasesController";
import { Visibility, Add } from "@mui/icons-material";
import Link from "next/link";
import ModalBaggage from "../../components/Modals/ModalBaggage";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./baggage.module.css";
import { signOut, useSession } from "next-auth/react";

const BaggageView: React.FC = () => {
    const session = useSession()

    const {
        searchTerm,
        statusFilter,
        startDate,
        endDate,
        filteredData,
        loading,
        setSearchTerm,
        setStatusFilter,
        setStartDate,
        setEndDate,
        isModalOpen,
        selectedBaggageDetails,
        handleOpenModal,
        handleCloseModal,
        updatedSavedBaggageCase,
    } = useBaggageCasesController();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Abierto":
                return "badge bg-success text-dark"; // Amarillo
            case "En espera de pasajero":
                return "badge bg-info"; // Azul claro
            case "En espera de formulario":
                return "badge bg-warning"; // Gris
            case "Cerrado":
                return "badge bg-danger"; // Verde
            default:
                return "badge warning";
        }
    };

    return (
        <div className={`mt-5 ${styles.container}`}>
            {/* Sección del Título y Botón */}
            <header className={`${styles.header}`}>
                <div className="row d-flex justify-content-between align-items-center">
                    <div className="col-md-6">
                        <h1 className={`h4 text-start mb-3 ${styles.title}`}>Agente: <span>{`${session.data?.user.name || "Cargando"}`}</span></h1>

                    </div>

                    <div className="col-md-6 text-end">
                        <Link href="/baggage_gestion/baggage_form_reclamo" className={`btn ${styles.addButton}`}>
                            <Add className={`me-2`} />
                            Añadir Nuevo Caso
                        </Link>
                    </div>
                </div>
            </header>

            {/* Sección de Filtros en una sola columna */}
            <div className={`row mb-4 ${styles.filters}`}>
                <div className="col-md-3 mb-3">
                    <input
                        type="text"
                        placeholder="Buscar por PNR, pasajero o estado"
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-3 mb-3">
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Todos los estados</option>
                        <option value="Abierto">Abierto</option>
                        <option value="En espera de pasajero">En espera de pasajero</option>
                        <option value="En espera de formulario">En espera de formulario</option>
                        <option value="Cerrado">Cerrado</option>
                    </select>
                </div>
                <div className="col-md-3 mb-3">
                    <label className="form-label">Desde:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="form-label">Hasta:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Sección de Tabla */}
            <div className={`table-responsive ${styles.tableContainer}`}>
                {loading ? (
                    <h1>Cargando....</h1>
                ) : (
                    <table className={`table table-striped table-bordered ${styles.baggage_table}`}>
                        <thead className={`bg-primary text-white ${styles.tableHeader}`}>
                            <tr>
                                <th>Pnr</th>
                                <th>Baggage Code</th>
                                <th>Zendezk Ticket Code</th>
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th>Nombre Pasajero</th>
                                <th>Tipo de Problema</th>
                                <th>Estado</th>
                                <th>Fecha de Creación</th>
                                <th>Última Actualización</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.pnr}</td>
                                        <td>{row.baggage_code}</td>
                                        <td>{row.number_ticket_zendesk}</td>
                                        <td>{row.contact.phone}</td>
                                        <td>{row.contact.email}</td>
                                        <td>{row.passenger_name}</td>
                                        <td>{row.issue_type}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(row.status)}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td>{new Date(row.date_create.split("T")[0]).toLocaleDateString()}</td>
                                        <td>{new Date(row.last_updated).toLocaleString()}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleOpenModal(row)}
                                            >
                                                <Visibility className="me-1" />
                                                Ver Detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center">No se encontraron casos de equipaje.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <ModalBaggage
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    details={selectedBaggageDetails}
                    onSave={updatedSavedBaggageCase}
                />
            )}
        </div>
    );
};

export default BaggageView;
