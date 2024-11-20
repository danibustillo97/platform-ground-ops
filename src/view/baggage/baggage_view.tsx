"use client";

import React, { useState } from "react";
import { useBaggageCasesController } from "./useBaggageCasesController";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Grid,
  Box,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import styles from "@/view/baggage/baggage.module.css";

const BaggageView: React.FC = () => {
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
  } = useBaggageCasesController();

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });

  const statusOptions = [
    { label: "Abierto", value: "Abierto" },
    { label: "En espera de pasajero", value: "En espera de pasajero" },
    { label: "En espera de formulario", value: "En espera de formulario" },
    { label: "Cerrado", value: "Cerrado" },
  ];

  const columns: GridColDef[] = [
    { field: "PNR", headerName: "PNR", width: 180 },
    { field: "baggage_code", headerName: "Código de Equipaje", width: 180 },
    { field: "number_ticket_zendesk", headerName: "Ticket Zendesk", width: 180 },
    { field: "contact.phone", headerName: "Teléfono", width: 180 },
    { field: "contact.email", headerName: "Email", width: 250 },
    { field: "passenger_name", headerName: "Nombre Pasajero", width: 180 },
    { field: "issue_type", headerName: "Tipo de Problema", width: 200 },
    { field: "status", headerName: "Estado", width: 180 },
    { field: "date_create", headerName: "Fecha de Creación", width: 200 },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={styles.baggageContainer}>
        <header className={styles.header}>
          <h1>Gestión de Equipaje</h1>
        </header>

        <div className={styles.filtersContainer}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <TextField
                label="Buscar por PNR, pasajero o estado"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Filtrar por estado</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Filtrar por estado"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <DatePicker
                label="Fecha de Creación (Inicio)"
                value={startDate ? new Date(startDate) : null}
                onChange={(newValue) => setStartDate(newValue ? newValue.toISOString().split("T")[0] : "")}
                renderInput={(params: React.JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={3}>
              <DatePicker
                label="Fecha de Creación (Fin)"
                value={endDate ? new Date(endDate) : null}
                onChange={(newValue) => setEndDate(newValue ? newValue.toISOString().split("T")[0] : "")}
                renderInput={(params: React.JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
        </div>

        <div className={styles.dataTableContainer}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            paginationModel={paginationModel}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection as any[])}
            onPaginationModelChange={setPaginationModel}
      
          />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default BaggageView;
