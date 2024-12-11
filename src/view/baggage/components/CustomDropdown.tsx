import React from "react";
import Select from "react-select";

// Definir las opciones para el dropdown
const statusOptions = [
  { value: "Abierto", label: "Abierto" },
  { value: "Cerrado", label: "Cerrado" },
  { value: "En espera de pasajero", label: "En espera de pasajero" },
];

// Definir los tipos para la estructura del row
interface BaggageCase {
  id: string;
  status: string;
}

// Definir el tipo de la función handleFieldChange
type HandleFieldChange = (id: string, field: "status", value: string) => void;

// Definir las props para el componente CustomDropdown
interface CustomDropdownProps {
  row: BaggageCase;
  handleFieldChange: HandleFieldChange;
}

// Componente CustomDropdown
const CustomDropdown: React.FC<CustomDropdownProps> = ({ row, handleFieldChange }) => {
  const handleChange = (selectedOption: any) => {
    handleFieldChange(row.id, "status", selectedOption?.value); // Aquí se pasa el campo 'status'
  };

  // Función para obtener el color según el estado (puedes personalizarla)
  function getStatusColor(status: string): string | undefined {
    switch (status) {
      case "Abierto":
        return "green";
      case "Cerrado":
        return "red";
      case "En espera de pasajero":
        return "yellow";
      default:
        return undefined;
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: getStatusColor(row.status),
          marginRight: "8px",
        }}
      />
      <Select
        options={statusOptions}
        value={statusOptions.find((option) => option.value === row.status)}
        onChange={handleChange}
        styles={{
          control: (base: any) => ({
            ...base,
            minHeight: "30px",
            fontSize: "14px",
          }),
          dropdownIndicator: (base: any) => ({
            ...base,
            padding: "4px",
          }),
          menu: (base: any) => ({
            ...base,
            fontSize: "14px",
          }),
        }}
        isClearable={false}
      />
    </div>
  );
};

export default CustomDropdown;
