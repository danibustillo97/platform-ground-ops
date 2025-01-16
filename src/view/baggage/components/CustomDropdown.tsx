import React from "react";
import Select from "react-select";


const statusOptions = [
  { value: "Abierto", label: "Abierto" },
  { value: "Cerrado", label: "Cerrado" },
  { value: "En espera de pasajero", label: "En espera de pasajero" },
  { value: "En espera de formulario", label: "En espera de formulario" },
];


interface BaggageCase {
  id: string;
  status: string;
}


type HandleFieldChange = (id: string, field: "status", value: string) => void;


interface CustomDropdownProps {
  row: BaggageCase;
  handleFieldChange: HandleFieldChange;
}


const CustomDropdown: React.FC<CustomDropdownProps> = ({ row, handleFieldChange }) => {
  const handleChange = (selectedOption: any) => {
    handleFieldChange(row.id, "status", selectedOption?.value);
  };


  function getStatusColor(status: string): string | undefined {
    switch (status) {
      case "Abierto":
        return "green";
      case "Cerrado":
        return "red";
      case "En espera de pasajero":
        return "yellow";
        case "En espera de formulario":
        return "gray";
      default:
        return undefined;
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
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
            with: "100%"
            
          }),
          dropdownIndicator: (base: any) => ({
            ...base,
            padding: "4px",
        
          }),
          menu: (base: any) => ({
            ...base,
            fontSize: "14px",
            with: "100%",
           
          }),

          menuList: (base: any) => ({
            ...base,
            padding: "0",
            scrollbarWidth: "thin",
            msOverflowStyle: "none",
          }),


           
        }}
        isClearable={false}
      />
    </div>
  );
};

export default CustomDropdown;
