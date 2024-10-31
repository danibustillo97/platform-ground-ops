"use client";

import React, { useState } from "react";
import { useBaggageCasesController } from "./useBaggageCasesController";
import { LuTrash2 } from "react-icons/lu";
import Link from "next/link";
import ModalBaggage from "../../components/Modals/ModalBaggage";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./baggage.module.css";
import { useSession } from "next-auth/react";
import DataTable from 'react-data-table-component';
import OverlayComponent from "@/components/Overlay/Overlay";
import * as XLSX from "xlsx";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { IoIosAddCircle } from "react-icons/io";

const BaggageView: React.FC = () => {
    const session = useSession();
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
        handleDeleteSelected,
    } = useBaggageCasesController();

    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const [dateRange, setDateRange] = useState<[Date | null, Date | null] | null>(null);

    const handleDateChange = (e: any) => {
        setDateRange(e.value);
    };

    const handleRowSelected = (state: { selectedRows: any[] }) => {
        setSelectedRows(state.selectedRows);
    };




    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Abierto":
                return "badge bg-success text-dark";
            case "En espera de pasajero":
                return "badge bg-info";
            case "En espera de formulario":
                return "badge bg-warning";
            case "Cerrado":
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    // const ExpandedRow = ({ data }: { data: any }) => (
    //     <div className="container-fluid py-3 px-4 bg-white border rounded shadow-sm my-2">
    //         <div className="row align-items-center">
    //             <div className="col-md-8">
    //                 <p className="mb-0" style={{ fontSize: '0.9rem', color: '#4a4a4a' }}>
    //                     <strong>Descripción:</strong> {data.description || 'No disponible'}
    //                 </p>
    //             </div>
    //         </div>
    //     </div>
    // );


    const ExpandedRow = ({ data }: { data: any }) => (
        <div
        style={{
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            color: '#333',
            maxWidth: '400px',
            fontFamily: 'Arial, sans-serif'
        }}
    >
        <h3 style={{ margin: '0 0 10px 0', color: '#4a90e2' }}>Detalles del Registro</h3>
        <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                <strong>Descripción:</strong>
                <span style={{ display: 'block', color: '#333', marginTop: '4px' }}>
                    {data.description || 'No disponible'}
                </span>
            </p>
        </div>
        <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                <strong>Última Actualización:</strong>
                <span style={{ display: 'block', color: '#333', marginTop: '4px' }}>
                    {new Date(data.last_updated).toLocaleString()}
                </span>
            </p>
        </div>
    </div>
    
    );

    const columns = [
        { name: "PNR", selector: (row: any) => row.pnr || 'No data', sortable: true },
        { name: "Baggage Code", selector: (row: any) => row.baggage_code || 'No data', sortable: true },
        { name: "Zendezk Ticket Code", selector: (row: any) => row.number_ticket_zendesk || 'No data', sortable: true },
        { name: "Teléfono", selector: (row: any) => row.contact?.phone || '-', sortable: true },
        { name: "Email", selector: (row: any) => row.contact?.email || '-', sortable: true },
        { name: "Nombre Pasajero", selector: (row: any) => row.passenger_name, sortable: true },
        { name: "Tipo de Problema", selector: (row: any) => row.issue_type, sortable: true },
        {
            name: "Estado",
            cell: (row: any) => <span className={`badge ${getStatusBadge(row.status)}`}>{row.status}</span>,
            sortable: true,
        },
        { name: "Fecha de Creación", selector: (row: any) => new Date(row.date_create).toLocaleDateString(), sortable: true },
        { name: "Última Actualización", selector: (row: any) => new Date(row.last_updated).toLocaleString(), sortable: true },
    ];

    const handleDelete = async () => {
        if (selectedRows.length > 0) {
            await handleDeleteSelected(selectedRows);
            setSelectedRows([]);
        }
    };

    const handleExportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Baggage Cases");
        XLSX.writeFile(workbook, "Baggage_Cases_Report.xlsx");
    };

    return (
        loading ? <OverlayComponent /> : (
            <div className={`mt-5 ${styles.container}`}>
                <header className={`${styles.header}`}>
                    <h1 className={`h4 text-start mb-3 ${styles.title}`}>
                        Agente: <span>{`${session.data?.user.name || "Cargando"}`}</span>
                    </h1>
                </header>

                <div className={`d-flex flex-wrap ${styles.filters}`}>
                    <div className={styles.filterItem}>
                        <input
                            type="text"
                            placeholder="Buscar por PNR, pasajero o estado"
                            className="form-control"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterItem}>
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
                    <div className={styles.filterItem}>
                        <label>Seleccione rango de fechas:</label>
                        <Calendar
                            value={dateRange}
                            onChange={handleDateChange}
                            selectionMode="range"
                            placeholder="Seleccione rango"
                            dateFormat="dd/mm/yy"
                            showIcon
                        />
                    </div>
                    <div className={styles.filterItem}>
                        <button className={`${styles.btnCustom} btn`} onClick={handleExportToExcel}>
                            <PiMicrosoftExcelLogo className="me-2" />
                            Exportar a Excel
                        </button>
                    </div>

                    <div className={`${styles.tableContainer}`}>
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        expandableRows
                        expandableRowsComponent={ExpandedRow}
                        onSelectedRowsChange={handleRowSelected}
                        selectableRows
                        selectableRowsHighlight
                        highlightOnHover
                    />
                </div>
                </div>

             

                <Link href="/baggage_gestion/baggage_form_reclamo">
                    <button className={`${styles.addButton} btn btn-primary`}>
                    <IoIosAddCircle />
                    </button>
                </Link>

            </div>
        )
    );
};

export default BaggageView;
