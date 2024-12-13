import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { BaggageCase } from "@/domain/types/BaggageCase";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { format } from "date-fns";
import styles from "@/view/baggage/baggage.module.css";
import { FaPaperclip, FaSave, FaTimesCircle, FaHistory, FaTrashAlt } from "react-icons/fa";
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

const BaggageTable: React.FC<BaggageTableProps> = ({ rows, onSaveChanges, onEdit, onCancel }) => {
  const [editableRows, setEditableRows] = useState<BaggageCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<BaggageCase | null>(null);
  const [newComment, setNewComment] = useState<string>("");

  const [viewMode, setViewMode] = useState<"comments" | "attachments" | "history">("comments");

  useEffect(() => {
    setEditableRows(rows);
  }, [rows]);

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

    const parts = name.split("/");

    if (parts.length > 1) {
      const firstName = parts[0].trim();
      const lastName = parts[1].trim();
      return `${firstName} ${lastName}`;
    }

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
              {
                id: crypto.randomUUID(),
                text: newComment,
                created_at: new Date().toISOString(),
              },
            ],
          }
          : row
      );

      setEditableRows(updatedRow);
      setSelectedCase(updatedRow.find((row) => row.id === selectedCase?.id) || null);
      setNewComment("");
    }
  };

  const handleDeleteComment = async (comentId: string) => {
    try {
      const response = await fetch(`https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/baggage-case/delete_coment/${comentId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Error al eliminar el comentario");
      }
  
      // Actualizamos el estado de editableRows y selectedCase
      setEditableRows((prevRows) =>
        prevRows.map((row) => {
          if (row.id === selectedCase?.id) {
            const updatedComments = row.comments?.filter((comment) => comment.id !== comentId) || [];
            return { ...row, comments: updatedComments };
          }
          return row;
        })
      );
  
      setSelectedCase((prevState) => {
        if (!prevState) return prevState;
        const updatedComments = prevState.comments?.filter((comment) => comment.id !== comentId) || [];
        return { ...prevState, comments: updatedComments };
      });
  
    } catch (error) {
      console.error(error);
      alert("Hubo un error al eliminar el comentario.");
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
      selector: (row) => row.contact_phone || "-",
      sortable: true,
      width: "250px",
      cell: (row) => (
        <Form.Control
          value={row.contact_email || ""}
          onChange={(e) => handleFieldChange(row.id, "contact_email", e.target.value)}
          size="sm"
        />
      ),
    },
    {
      name: "Teléfono",
      selector: (row) => row.contact_phone || "-",
      sortable: true,
      width: "1  50px",
      cell: (row) => (
        <Form.Control
          value={row.contact_phone || ""}
          onChange={(e) => handleFieldChange(row.id, "contact_phone", e.target.value)}
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
                fontSize: "1.2rem",
                color: "#333",
                fontWeight: "500",
                textTransform: "capitalize",
                letterSpacing: "0.5px",
                lineHeight: "1.5",
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
                      <th
                        style={{
                          textAlign: "center",
                          padding: "8px",
                          backgroundColor: "#f1f1f1",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCase?.comments
                      ?.slice()
                      .reverse()
                      .map((comment, index) => {
                        const formattedDate = comment.created_at
                          ? new Date(comment.created_at).toLocaleDateString("es-DO", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                          : "Sin fecha";

                        const formattedTime = comment.created_at
                          ? new Date(comment.created_at).toLocaleTimeString("es-DO", {
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
                                wordWrap: "break-word",
                                maxWidth: "400px",
                              }}
                            >
                              {comment.text}
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
                            <td
                              style={{
                                textAlign: "center",
                                padding: "8px",
                                borderBottom: "1px solid #ddd",
                                backgroundColor: "#fff",
                              }}
                            >
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
                                title="Eliminar comentario"
                              >
                                <FaTrashAlt />
                              </Button>
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
                    resize: "none",
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
