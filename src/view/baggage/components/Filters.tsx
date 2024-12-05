import React from "react";
import { TextField, Select, MenuItem, Grid } from "@mui/material";

interface FilterProps {
  searchTerm: string;
  status: string;
  startDate: string;
  endDate: string;
  onChange: (field: string, value: string) => void;
}

const Filters: React.FC<FilterProps> = ({
  searchTerm,
  status,
  startDate,
  endDate,
  onChange,
}) => (
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        label="Buscar"
        value={searchTerm}
        onChange={(e) => onChange("searchTerm", e.target.value)}
        variant="outlined"
        fullWidth
      />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <Select
        value={status}
        onChange={(e) => onChange("status", e.target.value)}
        fullWidth
      >
        {["Abierto", "Cerrado", "En espera"].map((status) => (
          <MenuItem value={status} key={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  </Grid>
);

export default Filters;
