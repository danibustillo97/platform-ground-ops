"use client";
import React from "react";
import { useBaggageCasesController } from "@/view/baggage/useBaggageCasesController";
import styles from "@/view/baggage/baggage.module.css";
import { Visibility, Add } from "@mui/icons-material";
import Link from "next/link";

const BaggageView: React.FC = () => {
    const {
        searchTerm,
        statusFilter,
        startDate,
        endDate,
        filteredData,
        setSearchTerm,
        setStatusFilter,
        setStartDate,
        setEndDate,
    } = useBaggageCasesController();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Gestión de Equipajes Rezagados</h1>

                <Link
                    href="/baggage_gestion/baggage_form_reclamo"
                    className={styles.addButton}
                >
                    <Add className={styles.addIcon} />
                    <span className={styles.addButtonText}>
                        Añadir Nuevo Caso
                    </span>
                </Link>
            </div>

            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Buscar por PNR, pasajero o estado"
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className={styles.statusSelect}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Todos los estados</option>
                    <option value="Abierto">Abierto</option>
                    <option value="En espera de pasajero">
                        En espera de pasajero
                    </option>
                    <option value="En espera de Formulario">
                        En espera de Formulario
                    </option>
                    <option value="Cerrado">Cerrado</option>
                </select>
                <div className={styles.dateFilters}>
                    <div className={styles.dateFilterGroup}>
                        <label className={styles.dateLabel}>Desde:</label>
                        <input
                            type="date"
                            className={styles.dateInput}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className={styles.dateFilterGroup}>
                        <label className={styles.dateLabel}>Hasta:</label>
                        <input
                            type="date"
                            className={styles.dateInput}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th className={styles.tableHeaderCell}>
                                Baggage Code
                            </th>
                            <th className={styles.tableHeaderCell}>Teléfono</th>
                            <th className={styles.tableHeaderCell}>Email</th>
                            <th className={styles.tableHeaderCell}>
                                Nombre Pasajero
                            </th>
                            <th className={styles.tableHeaderCell}>
                                Tipo de Problema
                            </th>
                            <th className={styles.tableHeaderCell}>Estado</th>
                            <th className={styles.tableHeaderCell}>
                                Fecha de Creación
                            </th>
                            <th className={styles.tableHeaderCell}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {filteredData.length > 0 ? (
                            filteredData.map((row, index) => (
                                <tr key={index}>
                                    <td className={styles.tableCell}>
                                        {row.baggage_code}
                                    </td>
                                    <td className={styles.tableCell}>
                                        {row.contact.phone}
                                    </td>
                                    <td className={styles.tableCell}>
                                        {row.contact.email}
                                    </td>
                                    <td className={styles.tableCell}>
                                        {row.passenger_name}
                                    </td>
                                    <td className={styles.tableCell}>
                                        {row.issue_type}
                                    </td>
                                    <td className={styles.tableCell}>
                                        {row.status}
                                    </td>
                                    <td className={styles.tableCell}>
                                        {new Date(
                                            row.date_create.split("T")[0],
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className={styles.tableCell}>
                                        <a
                                            href="#"
                                            className={styles.viewDetails}
                                        >
                                            <Visibility
                                                className={styles.icon}
                                            />
                                            Ver Detalles
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className={styles.tableCell}>
                                    No se encontraron casos de equipaje.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BaggageView;
