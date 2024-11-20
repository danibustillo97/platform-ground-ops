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
  IconButton,
  Box,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowModesModel,
  GridRowModes,
} from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import styles from "@/view/baggage/baggage.module.css";

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

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleEditClick = (id: any) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleSaveClick = (id: any) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }));
    // Lógica para guardar los datos editados en el backend
    console.log("Guardar cambios para el ID:", id);
  };

  const handleCancelClick = (id: any) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  };

  const columns: GridColDef[] = [
    { field: "PNR", headerName: "PNR", width: 150, editable: true },
    {
      field: "baggage_code",
      headerName: "Código de Equipaje",
      width: 180,
      editable: true,
    },
    {
      field: "number_ticket_zendesk",
      headerName: "Ticket Zendesk",
      width: 180,
      editable: true,
    },
    {
      field: "contact.phone",
      headerName: "Teléfono",
      width: 180,
      editable: true,
    },
    { field: "contact.email", headerName: "Email", width: 250, editable: true },
    {
      field: "passenger_name",
      headerName: "Nombre Pasajero",
      width: 200,
      editable: true,
    },
    {
      field: "issue_type",
      headerName: "Tipo de Problema",
      width: 200,
      editable: true,
    },
    { field: "status", headerName: "Estado", width: 150, editable: true },
    {
      field: "date_create",
      headerName: "Fecha de Creación",
      width: 200,
      editable: true,
    },
    {
      field: "description",
      headerName: "Descripción",
      width: 250,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 100,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handleEditClick(id)}
        />,
        <GridActionsCellItem
          icon={<SaveIcon />}
          label="Guardar"
          onClick={() => handleSaveClick(id)}
        />,
        <GridActionsCellItem
          icon={<CancelIcon />}
          label="Cancelar"
          onClick={() => handleCancelClick(id)}
        />,
      ],
    },
  ];

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
                  {[
                    "Abierto",
                    "Cerrado",
                    "En espera de pasajero",
                    "En espera de formulario",
                  ].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
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
            rowModesModel={rowModesModel}
            processRowUpdate={(row) => {
              console.log("Datos actualizados:", row);
              return row; // Aquí puedes enviar los datos al backend
            }}
            editMode="row" // Habilita el modo de edición por filas
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default BaggageView;
