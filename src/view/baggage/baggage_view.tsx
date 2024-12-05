"use client";
import React from "react";
import { useBaggageCasesController } from "@/view/baggage/useBaggageCasesController";
import Filters from "@/view/baggage/components/Filters";
import BaggageTable from "@/view/baggage/components/BaggageTable";

const BaggageView: React.FC = () => {
  const { loading, filters, filteredCases, setFilter, updateCase } =
    useBaggageCasesController();

  const handleEdit = (id: number) => {
    console.log("Edit", id);
  };

  const handleSave = (id: number) => {
    console.log("Save", id);
  };

  const handleCancel = (id: number) => {
    console.log("Cancel", id);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div style={{ width: "100%", padding: "16px", boxSizing: "border-box" }}>
      <div style={{ marginBottom: "20px" }}>
        <Filters
          searchTerm={filters.searchTerm}
          status={filters.status}
          startDate={filters.startDate}
          endDate={filters.endDate}
          onChange={(field, value) => setFilter(field as any, value)}
        />
      </div>
      
      <div
        style={{
          overflowX: "auto", // Permite el scroll horizontal
          width: "100%",     // Asegura que se ajuste al 100% del contenedor
          marginTop: "16px",
        }}
      >
        <BaggageTable
          rows={filteredCases}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default BaggageView;
