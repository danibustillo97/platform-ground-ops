    "use client";

    import React, { useState } from "react";
    import { useBaggageCasesController } from "./useBaggageCasesController";
    import { LuEye, LuPlusCircle, LuTrash2 } from "react-icons/lu"; // Cambiar iconos de Material UI por react-icons/lu
    import Link from "next/link";
    import ModalBaggage from "../../components/Modals/ModalBaggage";
    import 'bootstrap/dist/css/bootstrap.min.css';
    import styles from "./baggage.module.css";
    import { signOut, useSession } from "next-auth/react";
    import DataTable from 'react-data-table-component';

    import OverlayComponent  from "@/components/Overlay/Overlay";

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
            // handleDeleteSelected,
        } = useBaggageCasesController();

        const [selectedRows, setSelectedRows] = useState<any[]>([]);

        const handleRowSelected = (state: any) => {
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

        const columns = [
            { name: "PNR", selector: (row: any) => row.pnr, sortable: true },
            { name: "Baggage Code", selector: (row: any) => row.baggage_code, sortable: true },
            { name: "Zendezk Ticket Code", selector: (row: any) => row.number_ticket_zendesk, sortable: true },
            { name: "Teléfono", selector: (row: any) => row.contact.phone, sortable: true },
            { name: "Email", selector: (row: any) => row.contact.email, sortable: true },
            { name: "Nombre Pasajero", selector: (row: any) => row.passenger_name, sortable: true },
            { name: "Tipo de Problema", selector: (row: any) => row.issue_type, sortable: true },
            {
                name: "Estado",
                cell: (row: any) => <span className={`badge ${getStatusBadge(row.status)}`}>{row.status}</span>,
                sortable: true,
            },
            { name: "Fecha de Creación", selector: (row: any) => new Date(row.date_create).toLocaleDateString(), sortable: true },
            { name: "Última Actualización", selector: (row: any) => new Date(row.last_updated).toLocaleString(), sortable: true },
            {
                name: "Acciones",
                cell: (row: any) => (
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleOpenModal(row)}>
                        <LuEye className="me-1" />
                        Ver Detalles
                    </button>
                ),
            },
        ];

        return (
            loading  ?<OverlayComponent /> : (
                <div className={`mt-5 ${styles.container}`}>
                <header className={`${styles.header}`}>
                    <div className="row d-flex justify-content-between align-items-center">
                        <div className="col-md-6">
                            <h1 className={`h4 text-start mb-3 ${styles.title}`}>Agente: <span>{`${session.data?.user.name || "Cargando"}`}</span></h1>
                        </div>
                        <div className="col-md-6 text-end">
                            <Link href="/baggage_gestion/baggage_form_reclamo" className={`btn ${styles.addButton}`}>
                                <LuPlusCircle className={`me-2`} />
                                Añadir Nuevo Caso
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Filtros */}
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
                        <label className={`form-label${styles.formsLabel}`}>Hasta:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabla seleccionable */}
                <div className={`table-responsive ${styles.tableContainer}`}>
                    {loading ? (
                        <h1>Cargando....</h1>
                    ) : (
                        <>
                            <DataTable
                                columns={columns}
                                data={filteredData}
                                selectableRows
                                onSelectedRowsChange={handleRowSelected}
                                pagination
                            />
                            {selectedRows.length > 0 && (
                                <div className="text-end mt-3">
                                    <button className="btn btn-danger" onClick={() => "Aqui va la funcion "}>
                                        <LuTrash2 className="me-2" />
                                        Eliminar Seleccionados
                                    </button>
                                </div>
                            )}
                        </>
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
            )
        );
    };

    export default BaggageView;
