"use client";

import React, { useState, useEffect } from "react";
import { useBaggageCasesController } from "./useBaggageCasesController";
import { BaggageCase } from "@/domain/types/BaggageCase";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Typography,
  Paper,
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
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { auto } from "@popperjs/core";

const theme = createTheme({
  palette: {
    primary: {
      main: "#510C76",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#f4f4f9",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
    },
  },
});

const Container = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.default,
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    boxShadow: theme.shadows[1],
    padding: theme.spacing(1.5),
  },
}));

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
    console.log("Guardar cambios para el ID:", id);
  };

  const handleCancelClick = (id: any) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  };

  const cleanedData = filteredData.map((row) => ({
    ...row,
    contact: row.contact || { email: "", phone: "" },
    contact_phone: row.contact?.phone || "",
    contact_email: row.contact?.email || "",
  }));

  const columns: GridColDef[] = [
    {
      field: "PNR",
      headerName: "PNR",
      width: 150,
      editable: true,
      minWidth: 100,
    },
    {
      field: "baggage_code",
      headerName: "Código de Equipaje",
      flex: 1, // Ajuste dinámico
      minWidth: 180, // Añadir un mínimo para evitar que sea demasiado estrecho
      editable: true,
    },
    {
      field: "number_ticket_zendesk",
      headerName: "Ticket Zendesk",
      width: 180,
      minWidth: 150, // Para evitar que sea muy pequeño
    },
    {
      field: "contact_phone",
      headerName: "Teléfono",
      flex: 1, // Ajuste dinámico
      minWidth: 180, // Añadir un mínimo para evitar que se corte
      editable: true,
    },
    {
      field: "contact_email",
      headerName: "Email",
      flex: 2, // Más espacio para el email
      minWidth: 250, // Añadir un mínimo para evitar que se corte
      editable: true,
    },
    {
      field: "passenger_name",
      headerName: "Nombre Pasajero",
      flex: 1, // Ajuste dinámico
      minWidth: 200, // Para evitar que se corte
      editable: true,
    },
    {
      field: "issue_type",
      headerName: "Tipo de Problema",
      width: 200,
      minWidth: 180, // Para que no se corte
    },
    {
      field: "status",
      headerName: "Estado",
      width: 150,
      editable: true,
      minWidth: 120,
    },
    {
      field: "date_create",
      headerName: "Fecha de Creación",
      width: 200,
      minWidth: 150, // Evita que sea muy pequeño
    },
    {
      field: "description",
      headerName: "Descripción",
      width: 250,
      editable: true,
      minWidth: 180, // Evita que se corte
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 100,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<EditIcon color="primary" />}
          label="Editar"
          onClick={() => handleEditClick(id)}
        />,
        <GridActionsCellItem
          icon={<SaveIcon color="primary" />}
          label="Guardar"
          onClick={() => handleSaveClick(id)}
        />,
        <GridActionsCellItem
          icon={<CancelIcon color="error" />}
          label="Cancelar"
          onClick={() => handleCancelClick(id)}
        />,
      ],
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container>
          <Typography variant="h1" color="primary" align="center" gutterBottom>
            Gestión de Equipaje
          </Typography>

          {/* Filtros */}
          <FilterPaper>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Buscar por PNR, pasajero o estado"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
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

              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Fecha Inicio"
                  value={startDate ? dayjs(startDate) : null}
                  onChange={(newValue) =>
                    setStartDate(newValue?.toISOString() || "")
                  }
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Fecha Fin"
                  value={endDate ? dayjs(endDate) : null}
                  onChange={(newValue) =>
                    setEndDate(newValue?.toISOString() || "")
                  }
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>
            </Grid>
          </FilterPaper>

          {/* Tabla */}
          <Box
            sx={{
              height: "70vh",
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 2,
              scrollBehavior: "smooth",
              overflowX: auto,
              msOverflowY: auto,
            }}
          >
            <DataGrid
              rows={cleanedData}
              columns={columns}
              rowModesModel={rowModesModel}
              autoHeight
              editMode="row"
              checkboxSelection
              disableRowSelectionOnClick
              sx={{
                width: "100%",
                overflowX: auto,
                ".MuiDataGrid-columnHeader": {
                  backgroundColor: "#510C76",
                  color: "#ffffff",
                },
                ".MuiDataGrid-cell": {
                  fontSize: 12,
                },
              }}
            />
          </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default BaggageView;
