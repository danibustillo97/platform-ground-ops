"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import styles from "@/view/baggage/baggage.module.css";
import { Visibility } from "@mui/icons-material";
import { Add } from "@mui/icons-material";

const LostLuggageManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleStatusChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setStatusFilter(event.target.value);
    };

    const handleStartDateChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setEndDate(event.target.value);
    };

    const filteredData = useMemo(() => {
        return [
            {
                pnr: "PNR12345",
                name: "Juan Pérez",
                date: "2024-07-24",
                status: "Abierto",
            },
            {
                pnr: "PNR67890",
                name: "Ana Gómez",
                date: "2024-07-23",
                status: "En espera de formulario",
            },
            {
                pnr: "PNR54321",
                name: "Carlos Martínez",
                date: "2024-07-22",
                status: "En espera de pasajero",
            },
            {
                pnr: "PNR54561",
                name: "Oliver Bustillo",
                date: "2024-07-29",
                status: "Cerrado",
            },
        ]
            .filter(
                (row) =>
                    row.pnr.toLowerCase().includes(searchTerm) ||
                    row.name.toLowerCase().includes(searchTerm) ||
                    row.status.toLowerCase().includes(searchTerm),
            )
            .filter((row) => {
                const rowDate = new Date(row.date);
                const start = startDate
                    ? new Date(startDate)
                    : new Date("1900-01-01");
                const end = endDate ? new Date(endDate) : new Date();
                return rowDate >= start && rowDate <= end;
            })
            .filter((row) =>
                statusFilter ? row.status === statusFilter : true,
            );
    }, [searchTerm, statusFilter, startDate, endDate]);

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
                    onChange={handleSearchChange}
                />
                <select
                    className={styles.statusSelect}
                    value={statusFilter}
                    onChange={handleStatusChange}
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
                            onChange={handleStartDateChange}
                        />
                    </div>
                    <div className={styles.dateFilterGroup}>
                        <label className={styles.dateLabel}>Hasta:</label>
                        <input
                            type="date"
                            className={styles.dateInput}
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th className={styles.tableHeaderCell}>PNR</th>
                            <th className={styles.tableHeaderCell}>Pasajero</th>
                            <th className={styles.tableHeaderCell}>Fecha</th>
                            <th className={styles.tableHeaderCell}>Estado</th>
                            <th className={styles.tableHeaderCell}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {filteredData.map((row, index) => (
                            <tr key={index}>
                                <td className={styles.tableCell}>{row.pnr}</td>
                                <td className={styles.tableCell}>{row.name}</td>
                                <td className={styles.tableCell}>{row.date}</td>
                                <td className={styles.tableCell}>
                                    <span
                                        className={`${styles.statusTag} ${
                                            styles[
                                                `status-${row.status
                                                    .toLowerCase()
                                                    .replace(/ /g, "-")}`
                                            ]
                                        }`}
                                    >
                                        {row.status}
                                    </span>
                                </td>
                                <td className={styles.tableCell}>
                                    <a href="#" className={styles.viewDetails}>
                                        <Visibility className={styles.icon} />
                                        Ver Detalles
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LostLuggageManagement;
