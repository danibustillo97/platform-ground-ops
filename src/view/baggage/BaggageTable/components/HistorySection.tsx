import React from "react";
import styles from "../styles/BaggageTable.module.css";

interface BaggageCase {
  history: {
    action: string;
    date: string;
    description?: string;
  }[];
}

interface HistorySectionProps {
  selectedCase: BaggageCase | null;
}

const HistorySection: React.FC<HistorySectionProps> = ({ selectedCase }) => {
  return (
    <ul>
      {selectedCase?.history?.map((historyItem, index) => (
        <li
          key={index}
          style={{
            backgroundColor: "#f8f9fa",
            margin: "5px 0",
            padding: "8px",
            borderRadius: "4px",
            fontFamily: 'DIM, sans-serif',
          }}
        >
          <strong>Acción:</strong> {historyItem.action} <br />
          <strong>Fecha:</strong> {historyItem.date} <br />
          {historyItem.description && (
            <>
              <strong>Descripción:</strong> {historyItem.description}
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default HistorySection;
