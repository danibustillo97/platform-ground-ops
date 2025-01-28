"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";

interface StationDropdownProps {
  onChange: (value: string) => void;
  value: string | null; // Permite que el valor sea null
}

const StationDropdown: React.FC<StationDropdownProps> = ({ onChange, value }) => {
  const [stations, setStations] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/station");
        if (!response.ok) {
          throw new Error("Error al obtener las estaciones");
        }

        const data: { station: string }[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("La API no devolvió un array válido.");
        }

        const formattedStations = data.map((item) => ({
          label: item.station,
          value: item.station,
        }));

        setStations(formattedStations);
      } catch (err) {
        setError("No se pudieron cargar las estaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  if (loading) {
    return (
      <div className="alert alert-info" role="alert">
        Cargando estaciones...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  // Encuentra la opción seleccionada o null si no existe
  const selectedOption = value ? stations.find(station => station.value === value) : null;

  return (
    <div className="mb-3 mt-3">
      <Select
        id="react-select-station"
        options={stations}
        onChange={(option) => onChange(option?.value || "")}
        value={selectedOption}
        placeholder="Seleccionar una opción"
        styles={{
          control: (base: any) => ({
            ...base,
            minHeight: "30px",
            fontSize: "14px",
            width: "100%"
          }),
          dropdownIndicator: (base: any) => ({
            ...base,
            padding: "4px",
          }),
          menu: (base: any) => ({
            ...base,
            fontSize: "14px",
            width: "100%",
          }),
          menuList: (base: any) => ({
            ...base,
            padding: "0",
            scrollbarWidth: "thin",
            msOverflowStyle: "none",
          }),
        }}
      />
    </div>
  );
};

export default StationDropdown;
