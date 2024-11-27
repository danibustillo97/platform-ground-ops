"use client";

import React, { useState } from "react";
import { useBaggageCasesController } from "./useBaggageCasesController";
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
  IconButton,
  AppBar,
  CssBaseline,
  Toolbar,
  Menu,
  Button,
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
import MenuIcon from "@mui/icons-material/Menu";
import clsx from "clsx";
import LuggageIcon from "@mui/icons-material/Luggage";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download"; // Ícono para "Exportar Excel"
import AddCircleIcon from "@mui/icons-material/AddCircle";

const theme = createTheme({
  palette: {
    primary: {
      main: "#510C76",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#f5f6fa",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "0.9rem",
    },
  },
});

const Container = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const cleanedData = filteredData.map((row) => ({
    ...row,
    contact: row.contact || { email: "", phone: "" },
    contact_phone: row.contact?.phone || "",
    contact_email: row.contact?.email || "",
  }));

  const columns: GridColDef[] = [
    { field: "PNR", headerName: "PNR", width: 100, editable: true },
    {
      field: "baggage_code",
      headerName: "Código de Equipaje",
      width: 100,
      editable: true,
    },
    {
      field: "number_ticket_zendesk",
      headerName: "Ticket Zendesk",
      width: 100,
    },
    {
      field: "contact_phone",
      headerName: "Teléfono",
      width: 100,
      editable: true,
    },
    { field: "contact_email", headerName: "Email", width: 200, editable: true },
    {
      field: "passenger_name",
      headerName: "Nombre Pasajero",
      width: 200,
      editable: true,
    },
    { field: "issue_type", headerName: "Tipo de Problema", width: 120 },
    { field: "status", headerName: "Estado", width: 100, editable: true },
    { field: "date_create", headerName: "Fecha de Creación", width: 200 },
    {
      field: "description",
      headerName: "Descripción",
      width: 300,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 200,
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
        <CssBaseline />
        <AppBar
          position="static"
          sx={{ mb: 3, backgroundColor: "#510C76", height: "56px" }}
        >
          <Toolbar sx={{ padding: "0 16px" }}>
            <Typography
              variant="h6"
              noWrap
              sx={{ flexGrow: 1, fontSize: "1rem" }}
            >
              Gestión de Equipaje
            </Typography>

            {/* Botón de Exportar Excel */}
            <Button
              color="inherit"
              sx={{
                mr: 2,
                fontSize: "0.875rem", // Fuente más pequeña
                borderRadius: "10px", // Bordes más suaves (menos redondeados)
                padding: "6px 12px", // Más compacto
              }}
              onClick={() => console.log("Exportar Excel")}
              startIcon={<DownloadIcon />} // Ícono de exportar
            >
              Exportar Excel
            </Button>

            {/* Botón de Añadir Nuevo Caso */}
            <Button
              color="inherit"
              sx={{
                mr: 2,
                fontSize: "0.875rem", // Fuente más pequeña
                borderRadius: "10px", // Bordes más suaves (menos redondeados)
                padding: "6px 12px", // Más compacto
              }}
              onClick={() => console.log("Añadir Nuevo Caso")}
              startIcon={<AddCircleIcon />} // Ícono de añadir
            >
              Añadir Nuevo Caso
            </Button>

            {/* Agente Asignado - Menú */}
            <Button
              color="inherit"
              sx={{
                mr: 2,
                fontSize: "0.875rem", // Fuente más pequeña
                borderRadius: "10px", // Bordes más suaves (menos redondeados)
                padding: "6px 12px", // Más compacto
              }}
              onClick={handleMenuClick}
              endIcon={<MoreVertIcon />}
            >
              Agente Asignado
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleCloseMenu}>Agente 1</MenuItem>
              <MenuItem onClick={handleCloseMenu}>Agente 2</MenuItem>
              <MenuItem onClick={handleCloseMenu}>Agente 3</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Box sx={{ width: "100%", height: "100vh", overflow: "auto" }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Filtros de Búsqueda
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Estado"
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
          </Paper>

          <Container>
            <DataGrid
              rows={cleanedData}
              columns={columns}
              checkboxSelection
              rowModesModel={rowModesModel}
              onRowModesModelChange={setRowModesModel}
              getRowId={(row) => row.PNR}
              sx={{ height: "calc(100vh - 260px)", width: "100%" }}
            />
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default BaggageView;
