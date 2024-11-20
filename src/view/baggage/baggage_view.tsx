"use client";

import React, { useState } from "react";
import { useBaggageCasesController } from "./useBaggageCasesController";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Box,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

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
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [description, setDescription] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const statusOptions = [
    { label: "Abierto", value: "Abierto" },
    { label: "En espera de pasajero", value: "En espera de pasajero" },
    { label: "En espera de formulario", value: "En espera de formulario" },
    { label: "Cerrado", value: "Cerrado" },
  ];

  const columns: GridColDef[] = [
    { field: "PNR", headerName: "PNR", width: 180 },
    { field: "baggage_code", headerName: "Código de Equipaje", width: 180 },
    {
      field: "number_ticket_zendesk",
      headerName: "Ticket Zendesk",
      width: 180,
    },
    { field: "contact.phone", headerName: "Teléfono", width: 180 },
    { field: "contact.email", headerName: "Email", width: 250 },
    { field: "passenger_name", headerName: "Nombre Pasajero", width: 180 },
    { field: "issue_type", headerName: "Tipo de Problema", width: 200 },
    { field: "status", headerName: "Estado", width: 180 },
    { field: "date_create", headerName: "Fecha de Creación", width: 200 },
  ];

  const handleRowClick = (params: GridRowParams) => {
    setSelectedCase(params.row); // Establece el caso seleccionado
    setDescription(params.row.description || ""); // Carga la descripción previa si existe
  };

  const handleSaveDescription = () => {
    if (selectedCase) {
      console.log(
        `Descripción guardada para el caso ${selectedCase.PNR}:`,
        description
      );
      // Aquí puedes implementar la lógica para guardar la descripción en el backend
      setSelectedCase(null); // Limpia la selección al guardar
      setDescription(""); // Limpia la descripción al guardar
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                value={startDate ? dayjs(startDate) : null}
                onChange={(newValue) =>
                  setStartDate(newValue?.toISOString() || "")
                }
              />
            </Grid>

            <Grid item xs={3}>
              <DatePicker
                label="Fecha de Creación (Fin)"
                value={endDate ? dayjs(endDate) : null}
                onChange={(newValue) =>
                  setEndDate(newValue?.toISOString() || "")
                }
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
            onRowClick={handleRowClick}
            onPaginationModelChange={setPaginationModel}
          />
        </div>

        {selectedCase && (
          <Box mt={4}>
            <h3>Agregar Descripción para el Caso: {selectedCase.PNR}</h3>
            <TextField
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveDescription}
              >
                Guardar Descripción
              </Button>
            </Box>
          </Box>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default BaggageView;
