import React from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { BaggageCase } from "@/domain/types/BaggageCase";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

interface BaggageTableProps {
  rows: BaggageCase[];
  onEdit: (id: number) => void;
  onSave: (id: number) => void;
  onCancel: (id: number) => void;
}

const BaggageTable: React.FC<BaggageTableProps> = ({
  rows,
  onEdit,
  onSave,
  onCancel,
}) => {
  const columns: GridColDef[] = [
    { field: "PNR", headerName: "PNR", width: 150, headerClassName: "header-style" },
    { field: "baggage_code", headerName: "Código", width: 150, headerClassName: "header-style" },
    { field: "Pax-Name", headerName: "Pax Name", width: 150, headerClassName: "header-style" },
    { field: "status", headerName: "Estado", width: 150, editable: true, headerClassName: "header-style" },
    {
      field: "actions",
      type: "actions",
      width: 250,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon fontSize="large" />}
          label="Editar"
          onClick={() => onEdit(params.id as number)}
          className="action-icon"
        />,
        <GridActionsCellItem
          key="save"
          icon={<SaveIcon fontSize="large" />}
          label="Guardar"
          onClick={() => onSave(params.id as number)}
          className="action-icon"
        />,
        <GridActionsCellItem
          key="cancel"
          icon={<CancelIcon fontSize="large" />}
          label="Cancelar"
          onClick={() => onCancel(params.id as number)}
          className="action-icon"
        />,
      ],
    },
  ];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}> {/* Aquí habilitamos el scroll horizontal */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          disableColumnMenu 
          sx={{
            "& .MuiDataGrid-root": {
              border: "none", 
            },
            "& .MuiDataGrid-cell": {
              fontSize: "1rem",
              textAlign: "center",
              padding: "8px",
            },
            "& .header-style": {
              backgroundColor: "#510C76",
              color: "#fff",
              fontWeight: "bold",
            },
            "& .action-icon": {
              color: "#510C76",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              display: "none", // Ocultar el pie de página
            },
            "@media (max-width: 768px)": {
              "& .MuiDataGrid-columnHeaders": {
                fontSize: "0.9rem", // Reducir el tamaño de fuente en pantallas pequeñas
              },
              "& .MuiDataGrid-cell": {
                fontSize: "0.9rem", // Reducir el tamaño de fuente en pantallas pequeñas
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default BaggageTable;
