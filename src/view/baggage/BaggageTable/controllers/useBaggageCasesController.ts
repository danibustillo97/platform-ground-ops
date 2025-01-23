import { useState, useEffect } from "react";
import { BaggageCase } from "@/domain/types/BaggageCase";
import { User } from "@/entities/User";
import { fetchAllUsers } from "@/view/users/userController";

export const useBaggageCasesController = () => {
  const [editableRows, setEditableRows] = useState<BaggageCase[]>([]);
  const [agents, setAgents] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const agentsData = await fetchAllUsers();
      setAgents(agentsData.filter(user => user.rol === "agente"));
    };
    fetchData();
  }, []);

  const handleFieldChange = (
    id: string,
    field: keyof BaggageCase,
    value: string
  ) => {
    setEditableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const handleAgentChange = (id: string, agentId: string) => {
    setEditableRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? { ...row, agentId, estacion: agents.find((agent) => agent.id.toString() === agentId)?.estacion || "" }
          : row
      )
    );
  };

  const handleStationChange = (id: string, station: string) => {
    setEditableRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? { ...row, estacion: station }
          : row
      )
    );
  };

  return {
    editableRows,
    setEditableRows,
    agents,
    handleFieldChange,
    handleAgentChange,
    handleStationChange,
  };
};
