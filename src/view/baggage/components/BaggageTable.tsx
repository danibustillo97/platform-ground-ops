import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { BaggageCase } from "@/domain/types/BaggageCase";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { format } from "date-fns";
import styles from "@/view/baggage/baggage.module.css";
import { FaPaperclip, FaSave, FaTimesCircle } from "react-icons/fa";

interface BaggageTableProps {
  rows: BaggageCase[];
  onSaveChanges: (updatedRows: BaggageCase[]) => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  searchTerm: string;
  status: string;
  startDate: string;
  endDate: string;
}

const BaggageTable: React.FC<BaggageTableProps> = ({ rows, onSaveChanges, onEdit, onCancel, searchTerm, status, startDate, endDate }) => {
  const [editableRows, setEditableRows] = useState<BaggageCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<BaggageCase | null>(null);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    setEditableRows(rows);
  }, [rows]);

  const handleFieldChange = (
    id: string,
    field: keyof BaggageCase | "contact.phone" | "contact.email",
    value: string
  ) => {
    setEditableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          if (field.startsWith("contact")) {
            const contactField = field.split(".")[1];
            return {
              ...row,
              contact: { ...row.contact, [contactField]: value },
            };
          }
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const handleSave = (id: string) => {
    const updatedRow = editableRows.find((row) => row.id === id);
    if (updatedRow) {
      onSaveChanges(editableRows);
    }
  };

  const handleCancel = () => {
    setEditableRows(rows);
    setSelectedCase(null);
    setNewComment("");
  };

  const handleFileUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Archivo adjuntado para el caso ${id}:`, file.name);
      // Aquí se podría añadir lógica para subir el archivo o asociarlo al caso
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "Abierto":
        return "red";
      case "Cerrado":
        return "green";
      case "En espera de pasajero":
        return "orange";
      default:
        return "gray";
    }
  };

  const columns: TableColumn<BaggageCase>[] = [
    {
      name: "PNR",
      selector: (row) => row.PNR || "-",
      sortable: true,
    },
    {
      name: "Código",
      selector: (row) => row.baggage_code || "-",
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.passenger_name || "-",
      sortable: true,
      cell: (row) => (
        <Form.Control
          value={row.passenger_name || ""}
          onChange={(e) => handleFieldChange(row.id, "passenger_name", e.target.value)}
          size="sm"
        />
      ),
    },
    {
      name: "Correo",
      selector: (row) => row.contact.email || "-",
      sortable: true,
      cell: (row) => (
        <Form.Control
          value={row.contact.email || ""}
          onChange={(e) => handleFieldChange(row.id, "contact.email", e.target.value)}
          size="sm"
        />
      ),
    },
    {
      name: "Teléfono",
      selector: (row) => row.contact.phone || "-",
      sortable: true,
      cell: (row) => (
        <Form.Control
          value={row.contact.phone || ""}
          onChange={(e) => handleFieldChange(row.id, "contact.phone", e.target.value)}
          size="sm"
        />
      ),
    },
    {
      name: "Descripción",
      selector: (row) => row.description || "-",
      sortable: true,
      cell: (row) => (
        <Form.Control
          value={row.description || ""}
          onChange={(e) => handleFieldChange(row.id, "description", e.target.value)}
          size="sm"
        />
      ),
    },
    {
      name: "Tipo de problema",
      selector: (row) => row.issue_type || "-",
      sortable: true,
      cell: (row) => (
        <Form.Control
          value={row.issue_type || ""}
          onChange={(e) => handleFieldChange(row.id, "issue_type", e.target.value)}
          size="sm"
        />
      ),
    },
    {
      name: "Estatus",
      selector: (row) => row.status || "-",
      sortable: true,
      cell: (row) => (
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
          <Form.Control
            as="select"
            value={row.status || ""}
            onChange={(e) => handleFieldChange(row.id, "status", e.target.value)}
            size="sm"
          >
            <option value="Abierto">Abierto</option>
            <option value="Cerrado">Cerrado</option>
            <option value="En espera de pasajero">En espera de pasajero</option>
          </Form.Control>
        </div>
      ),
    },
    {
      name: "Fecha de creación",
      selector: (row) =>
        row.date_create ? format(new Date(row.date_create), "dd/MM/yyyy") : "-",
      sortable: true,
      cell: (row) => (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              Fecha: {row.date_create ? format(new Date(row.date_create), "dd/MM/yyyy") : "-"}
            </Tooltip>
          }
        >
          <span>{row.date_create ? format(new Date(row.date_create), "dd/MM/yyyy") : "-"}</span>
        </OverlayTrigger>
      ),
    },
    {
      name: "Comentarios",
      selector: (row) => row.comments?.length || 0,
      sortable: false,
      cell: (row) => (
        <div
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => setSelectedCase(row)}
        >
          {row.comments?.length || 0} Comentarios
        </div>
      ),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className={styles.actionButtons}>
          <Button variant="outline-primary" size="sm" className={styles.actionButton}>
            <label htmlFor={`file-upload-${row.id}`} style={{ cursor: "pointer", margin: 0 }}>
              <FaPaperclip />
            </label>
            <input
              id={`file-upload-${row.id}`}
              type="file"
              style={{ display: "none" }}
              onChange={(event) => handleFileUpload(row.id, event)}
            />
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => handleSave(row.id)}
            className={styles.actionButton}
          >
            <FaSave />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleCancel}
            className={styles.actionButton}
          >
            <FaTimesCircle />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.tableContainer}>
        <DataTable
          columns={columns}
          data={editableRows}
          pagination
          highlightOnHover
          striped
          noDataComponent={<div className={styles.noData}>No hay datos para mostrar</div>}
        />
      </div>

      {selectedCase && (
        <Modal
          show={true}
          onHide={() => setSelectedCase(null)}
          size="lg"
          className={styles.modalComment}
        >
          <Modal.Header closeButton>
            <Modal.Title>Comentarios para {selectedCase.passenger_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              {selectedCase.comments?.map((comment, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: "#f8f9fa",
                    margin: "5px 0",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  {comment}
                </li>
              ))}
            </ul>
            <Form.Control
              type="text"
              placeholder="Agregar un comentario"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedCase(null)}>
              Cerrar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setEditableRows((prevRows) =>
                  prevRows.map((row) =>
                    row.id === selectedCase.id
                      ? {
                        ...row,
                        comments: [...(row.comments || []), newComment],
                      }
                      : row
                  )
                );
                setNewComment("");
              }}
              style={{ backgroundColor: "#510C76", borderColor: "#510C76" }}
            >
              Agregar Comentario
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default BaggageTable;
