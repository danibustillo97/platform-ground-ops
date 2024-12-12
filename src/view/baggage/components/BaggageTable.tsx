import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { BaggageCase } from "@/domain/types/BaggageCase";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { format } from "date-fns";
import styles from "@/view/baggage/baggage.module.css";
import { FaPaperclip, FaSave, FaTimesCircle, FaHistory } from "react-icons/fa";
import { SiMinutemailer } from "react-icons/si";
import CustomDropdown from "./CustomDropdown";



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

  const [viewMode, setViewMode] = useState<"comments" | "attachments" | "history">("comments");

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
            const contactField = field.split(".")[1] as keyof BaggageCase["contact"];
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


  const handleSendEmail = async () => {
    console.log("Click")
    const emailData = {
      to: 'danibustillo97@gmail.com',
      text: 'Aqui realizo pruebas',
    };

    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();
    console.log(data.message);
  }

  const formatName = (name: string): string => {
    // Dividir el nombre completo por el separador "/"
    const parts = name.split("/");

    // Si el nombre tiene partes separadas por "/", elige la primera y la segunda como nombre y apellido.
    if (parts.length > 1) {
      const firstName = parts[0].trim();
      const lastName = parts[1].trim();
      return `${firstName} ${lastName}`;
    }

    // Si no hay "/", solo se devuelve el nombre tal cual.
    return name;
  };



  const handleCancel = () => {
    setEditableRows(rows);
    setSelectedCase(null);
    setViewMode("comments");

  };

  const handleFileUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Archivo adjuntado para el caso ${id}:`, file.name);
      setEditableRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id
            ? {
              ...row,
              attachedFiles: [...(row.attachedFiles || []), { fileName: file.name, file }],
            }
            : row
        )
      );
    }
  };

  const handleAddComment = () => {
    if (newComment) {
      const updatedRow = editableRows.map((row) =>
        row.id === selectedCase?.id
          ? {
            ...row,
            comments: [
              ...(row.comments || []),
              { text: newComment, createdAt: new Date().toISOString() },
            ],
          }
          : row
      );
      setEditableRows(updatedRow);

      setSelectedCase(updatedRow.find(row => row.id === selectedCase?.id) || null);
      setNewComment("");
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
      width: "80px"
    },
    {
      name: "BAGTAG",
      selector: (row) => row.baggage_code || "-",
      sortable: true,
      width: "110px"
    },
    {
      name: "Nombre",
      selector: (row) => row.passenger_name || "-",
      sortable: true,
      width: "250px",
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
      width: "250px",
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
      width: "1  50px",
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
      width: "250px",
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
      width: "200px",
      cell: (row) => (
        <CustomDropdown row={row} handleFieldChange={handleFieldChange} />
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
          onClick={() => { setSelectedCase(row); setViewMode("comments"); }}
        >
          {row.comments?.length || 0} Comentarios
        </div>
      ),
    },
    {
      name: "Archivos Adjuntos",
      selector: (row) => row.attachedFiles?.length || 0,
      sortable: false,
      cell: (row) => (
        <div
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => { setSelectedCase(row); setViewMode("attachments"); }}
        >
          {row.attachedFiles?.length || 0} Archivos Adjuntos
        </div>
      ),
    },
    {
      name: "Historial",
      cell: (row) => (
        <div
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => { setSelectedCase(row); setViewMode("history"); }}
        >
          Ver Historial
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Acciones",
      width: "250px",
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

          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleSendEmail}
            className={styles.actionButton}
          >
            <SiMinutemailer />
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
            <Modal.Title
              style={{
                fontSize: "1.2rem",  // Ajuste del tamaño de la fuente para que no sea tan grande
                color: "#333",       // Color de texto más suave
                fontWeight: "500",   // Peso de fuente para que no sea tan fuerte
                textTransform: "capitalize", // Asegurarte de que las palabras estén capitalizadas
                letterSpacing: "0.5px", // Espaciado de letras para que se vea más ordenado
                lineHeight: "1.5",   // Espaciado entre líneas para mejorar la legibilidad
              }}
            >
              {viewMode === "comments"
                ? `Comentarios para ${formatName(selectedCase.passenger_name)}`
                : viewMode === "attachments"
                  ? `Archivos Adjuntos para ${formatName(selectedCase.passenger_name)}`
                  : `Historial para ${formatName(selectedCase.passenger_name)}`}
            </Modal.Title>

          </Modal.Header>
          <Modal.Body>
            {viewMode === "comments" ? (
              <>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "20px",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          backgroundColor: "#f1f1f1",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Comentario
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          backgroundColor: "#f1f1f1",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Fecha
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          backgroundColor: "#f1f1f1",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Hora
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCase?.comments
                      ?.slice()
                      .reverse()
                      .map((comment, index) => {
                        const formattedDate = (typeof comment !== "string" && comment.createdAt)
                          ? new Date(comment.createdAt).toLocaleDateString("es-DO", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                          : "Sin fecha";

                        const formattedTime = (typeof comment !== "string" && comment.createdAt)
                          ? new Date(comment.createdAt).toLocaleTimeString("es-DO", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                          : "Sin hora";

                        return (
                          <tr key={index}>
                            <td
                              style={{
                                padding: "8px",
                                borderBottom: "1px solid #ddd",
                                backgroundColor: "#fff",
                                wordWrap: "break-word", // Hacer que el texto del comentario haga salto de línea
                                maxWidth: "400px", // Limitar el ancho para comentarios largos
                              }}
                            >
                              {typeof comment === "string" ? comment : comment.text}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                borderBottom: "1px solid #ddd",
                                backgroundColor: "#fff",
                              }}
                            >
                              {formattedDate || "Sin fecha"}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                borderBottom: "1px solid #ddd",
                                backgroundColor: "#fff",
                              }}
                            >
                              {formattedTime || "Sin hora"}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <Form.Control
                  type="text"
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  size="sm"
                  style={{
                    width: "100%",
                    resize: "none", // Impide que el campo se redimensione manualmente
                  }}
                />
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddComment}
                  style={{ marginTop: "10px" }}
                >
                  Agregar Comentario
                </Button>
              </>
            ) : viewMode === "attachments"
              ? (
                <>
                  <ul>
                    {selectedCase.attachedFiles?.map((file: { fileName: string }, index: React.Key) => (
                      <li
                        key={index}
                        style={{
                          backgroundColor: "#f8f9fa",
                          margin: "5px 0",
                          padding: "8px",
                          borderRadius: "4px",
                        }}
                      >
                        {file.fileName}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <ul>
                    {selectedCase.history?.map((historyItem: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                      <li
                        key={index}
                        style={{
                          backgroundColor: "#f8f9fa",
                          margin: "5px 0",
                          padding: "8px",
                          borderRadius: "4px",
                        }}
                      >
                        {historyItem}
                      </li>
                    ))}
                  </ul>
                </>
              )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCancel}>
              Clear
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default BaggageTable;
