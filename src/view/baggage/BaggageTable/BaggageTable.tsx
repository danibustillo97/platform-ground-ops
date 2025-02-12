import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { BaggageCase } from "@/domain/types/BaggageCase";
import { User } from "@/entities/User";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { format } from "date-fns";
import styles from "@/view/baggage/baggage.module.css";
import { FaPaperclip, FaSave, FaTimesCircle, FaHistory, FaTrashAlt, FaEdit } from "react-icons/fa";
import CustomDropdown from "./components/DropDown/CustomDropdown/CustomDropdown";
import { getSession } from "next-auth/react";
import { fetchAllUsers } from "@/view/users/userController";
import AgentDropdown from "./components/DropDown/AgentDropdown/AgentDropdown";
import StationDropdown from "./components/DropDown/StationDropdown/StationDropdown";
import { BaggageTableProps } from "@/view/baggage/BaggageTable/types/BaggageTableProps";
import { FileObject } from "@/view/baggage/BaggageTable/types/FileObject";
import NotificationComponent from "@/components/NotificationComponent";
import ImageUpload from "@/view/baggage/BaggageTable/components/FileUpload";
import { MdAdsClick } from "react-icons/md";
import { toast } from 'react-toastify';

interface BaggageTableWithNotificationsProps extends BaggageTableProps {
  onNotificationChange: (newNotifications: number) => void;
}

const Alert = ({ type, message }: { type: string; message: string }) => {
  switch (type) {
    case "success":
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      break;
    case "error":
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      break;
    default:
      toast(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  }
};

const BaggageTable: React.FC<BaggageTableWithNotificationsProps> = ({ rows, onSaveChanges, onEdit, onCancel, onNotificationChange }) => {
  const [editableRows, setEditableRows] = useState<BaggageCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<BaggageCase | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [viewMode, setViewMode] = useState<"comments" | "attachments" | "history">("comments");
  const [agents, setAgents] = useState<User[]>([]);
  const [savedFiles, setSavedFiles] = useState<FileObject[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [modifiedRows, setModifiedRows] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<{ [key: string]: boolean }>({});
  const [showDescriptionModal, setShowDescriptionModal] = useState<boolean>(false);
  const [selectedDescription, setSelectedDescription] = useState<string>("");

  const Url = 'https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net';

  useEffect(() => {
    const fetchData = async () => {
      const agentsData = await fetchAllUsers();
      const filteredAgents = agentsData.filter(user => user.rol === "Agente");
      setAgents(filteredAgents);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const sortedRows = [...rows].sort((a, b) => new Date(b.date_create).getTime() - new Date(a.date_create).getTime());
    setEditableRows(sortedRows);
  }, [rows]);

  useEffect(() => {
    if (selectedCase) {
      setSavedFiles(selectedCase.attachedFiles || []);
    }
  }, [selectedCase]);

  const handleFieldChange = (id: string, field: keyof BaggageCase, value: string) => {
    setEditableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          setModifiedRows((prevModifiedRows) => new Set(prevModifiedRows.add(id)));
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
    setModifiedRows((prevModifiedRows) => new Set(prevModifiedRows.add(id)));
  };

  const handleStationChange = (id: string, station: string) => {
    setEditableRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? { ...row, Station_Asigned: station }
          : row
      )
    );
    setModifiedRows((prevModifiedRows) => new Set(prevModifiedRows.add(id)));
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
      Alert({ type: "success", message: "Comentario agregado con éxito" });
      setEditableRows(updatedRow);
      setSelectedCase(updatedRow.find((row) => row.id === selectedCase?.id) || null);
      setNewComment("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`${Url}/api/baggage-case/delete_comment/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el comentario");
      }

      setEditableRows((prevRows) =>
        prevRows.map((row) => {
          if (row.id === selectedCase?.id) {
            const updatedComments = row.comments?.filter((comment) => comment.id !== commentId) || [];
            return { ...row, comments: updatedComments };
          }
          return row;
        })
      );

      setSelectedCase((prevState) => {
        if (!prevState) return prevState;
        const updatedComments = prevState.comments?.filter((comment) => comment.id !== commentId) || [];
        return { ...prevState, comments: updatedComments };
      });

      Alert({ type: "success", message: "Comentario eliminado con éxito" });
    } catch (error) {
      console.error(error);
      Alert({ type: "error", message: "Error al eliminar el comentario" });
    }
  };

  const handleSave = async (id: string) => {
    const updatedRow = editableRows.find((row) => row.id === id);
    if (updatedRow) {
      const updatedRowWithFiles: BaggageCase = {
        ...updatedRow,
        attachedFiles: [...savedFiles],
        Station_Asigned: updatedRow.Station_Asigned,
      };

      const session = await getSession();
      const token = session?.user.access_token as string;
      try {
        const response = await fetch(`${Url}/api/baggage-case/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedRowWithFiles),
        });

        if (!response.ok) {
          throw new Error("Error al guardar los cambios");
        }

        const savedData = await response.json();
        onSaveChanges([updatedRowWithFiles]);
        setEditingRowId(null);
        setModifiedRows((prevModifiedRows) => {
          const newModifiedRows = new Set(prevModifiedRows);
          newModifiedRows.delete(id);
          return newModifiedRows;
        });

        setSavedFiles(updatedRowWithFiles.attachedFiles || []);
        setEditableRows((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, attachedFiles: updatedRowWithFiles.attachedFiles } : row
          )
        );

        Alert({ type: "success", message: "Cambios guardados con éxito" });
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
        Alert({ type: "error", message: "Hubo un error al guardar los cambios." });
      }
    }
  };

  const handleDeleteCases = async (id: string) => {
    const session = await getSession();
    const token = session?.user.access_token as string;
    try {
      const response = await fetch(`${Url}/api/baggage-case/${id}`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el caso");
      }

      setEditableRows((prevRows) => prevRows.filter((row) => row.id !== id));
      setSelectedCase(null);
      Alert({ type: "success", message: "Caso eliminado con éxito" });
    } catch (error) {
      console.error(error);
      Alert({ type: "error", message: "Error al eliminar el caso" });
    }
  };

  const handleCancel = () => {
    setEditableRows(rows);
    setSelectedCase(null);
    setViewMode("comments");
    setEditingRowId(null);
    setModifiedRows(new Set());
    setSavedFiles([]);
    setEditableRows((prevRows) =>
      prevRows.map((row) => ({ ...row, attachedFiles: [] }))
    );
  };

  const handleSendEmail = async () => {
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
  };

  const formatName = (name: string): string => {
    const parts = name.split("/");
    if (parts.length > 1) {
      const firstName = parts[0].trim();
      const lastName = parts[1].trim();
      return `${firstName} ${lastName}`;
    }
    return name;
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
      width: "120px",
    },
    {
      name: "BAGTAG",
      selector: (row) => row.baggage_code || "-",
      sortable: true,
      width: "110px",
    },
    {
      name: "TICKET ZENDESK",
      selector: (row) => row.number_ticket_zendesk || "-",
      sortable: true,
      width: "120px",
    },
    {
      name: "AGENTE",
      width: "200px",
      selector: (row) => row.assigned_Agent || "-",
      sortable: true,
      cell: (row) => (
        <Form.Group>
          <div style={{ width: "140px", maxWidth: "180px" }}>
            <AgentDropdown
              value={row.agentId || "NoData"}
              onChange={(value) => handleAgentChange(row.id, value)}
              agents={agents.map(agent => ({ id: agent.id.toString(), name: agent.name }))}
            />
          </div>
        </Form.Group>
      ),
    },
    {
      name: "FROM AIRPORT",
      selector: (row) => row.from_airport || "-",
      sortable: true,
      width: "130px",
    },
    {
      name: "TO AIRPORT",
      selector: (row) => row.to_airport || "-",
      sortable: true,
      width: "130px",
    },
    {
      name: "FLIGHT NUMBER",
      selector: (row) => "DM-" + row.flight_number || "-",
      sortable: true,
      width: "130px",
    },
    {
      name: "ESTACIÓN",
      selector: (row) => row.Station_Asigned || "-",
      sortable: true,
      width: "150px",
      cell: (row) => (
        <StationDropdown
          onChange={(value) => handleStationChange(row.id, value)}
          value={row.Station_Asigned || "No Hay data"}
        />
      ),
    },
    {
      name: "NOMBRE",
      selector: (row) => row.passenger_name || "-",
      sortable: true,
      width: "250px",
      cell: (row) => (
        <Form.Control
          value={row.passenger_name || ""}
          onChange={(e) => handleFieldChange(row.id, "passenger_name", e.target.value)}
          size="sm"
          disabled={editingRowId !== row.id}
        />
      ),
    },
    {
      name: "CORREO",
      selector: (row) => row.contact_email || "-",
      sortable: true,
      width: "250px",
      cell: (row) => (
        <Form.Control
          value={row.contact_email || ""}
          onChange={(e) => handleFieldChange(row.id, "contact_email", e.target.value)}
          size="sm"
          disabled={editingRowId !== row.id}
        />
      ),
    },
    {
      name: "TELÉFONO",
      selector: (row) => row.contact_phone || "-",
      sortable: true,
      width: "150px",
      cell: (row) => (
        <Form.Control
          value={row.contact_phone || ""}
          onChange={(e) => handleFieldChange(row.id, "contact_phone", e.target.value)}
          size="sm"
          disabled={editingRowId !== row.id}
        />
      ),
    },
    {
      name: "DESCRIPCIÓN",
      selector: (row) => row.description || "-",
      sortable: true,
      width: "350px",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between", maxWidth: "300px", padding: "2px 8px", border: "1px solid rgba(208, 208, 208, 0.1)", backgroundColor: "#dee2e6", borderRadius: "4px" }}>
          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, fontFamily: 'DIM, sans-serif', fontSize: '0.9rem', color: '#333' }}>
            <span>{row.description}</span>
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setSelectedDescription(row.description || "");
              setShowDescriptionModal(true);
            }}
            style={{
              padding: "4px 8px",
              fontSize: "0.7rem",
              marginLeft: "12px",
              color: '#510C76',
              fontWeight: "600",
              textDecoration: "none",
              background: 'transparent',
              borderRadius: '4px',
              transition: 'background-color 0.3s, color 0.3s',
              fontFamily: 'DIM, sans-serif'
            }}
          >
            <span style={{ color: "black" }}>Ver</span> <MdAdsClick />
          </Button>
        </div>
      ),
    },
    {
      name: "TIPO DE PROBLEMA",
      selector: (row) => row.issue_type || "-",
      sortable: true,
    },
    {
      name: "ESTATUS",
      selector: (row) => row.status || "-",
      sortable: true,
      width: "200px",
      cell: (row) => (
        <CustomDropdown row={row} handleFieldChange={handleFieldChange} />
      ),
    },
    {
      name: "FECHA DE CREACIÓN",
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
      name: "COMENTARIOS",
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
      name: "ARCHIVOS ADJUNTOS",
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
      name: "HISTORIAL",
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
      name: "ACCIONES",
      width: "250px",
      cell: (row) => (
        <div className={styles.actionButtons}>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setEditingRowId(row.id)}
            className={styles.actionButton}
            style={{ fontFamily: 'DIM, sans-serif' }}
          >
            <FaEdit />
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => handleSave(row.id)}
            className={styles.actionButton}
            style={{ fontFamily: 'DIM, sans-serif' }}
          >
            <FaSave />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDeleteCases(row.id)}
            className={styles.actionButton}
            style={{ fontFamily: 'DIM, sans-serif' }}
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
      <div className={styles.tableContainer} style={{ minHeight: '100vh' }}>
        <DataTable
          columns={columns}
          data={editableRows}
          pagination
          highlightOnHover
          striped
          noDataComponent={<div className={styles.noData}>No hay datos para mostrar</div>}
          customStyles={{
            headRow: {
              style: {
                fontFamily: 'DIM, sans-serif',
                fontWeight: 'bold',
                backgroundColor: '#f8f9fa',
                textTransform: 'uppercase',
                textAlign: 'center',
              },
            },
            headCells: {
              style: {
                fontFamily: 'DIM, sans-serif',
                fontWeight: 'bold',
                backgroundColor: '#f8f9fa',
                textTransform: 'uppercase',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            },
            cells: {
              style: {
                fontFamily: 'DIM, sans-serif',
                padding: '8px',
              },
            },
            rows: {
              style: {
                fontFamily: 'DIM, sans-serif',
              },
            },
          }}
          conditionalRowStyles={[
            {
              when: row => modifiedRows.has(row.id),
              style: {
                backgroundColor: '#ffeb3b',
                animation: 'blink 1s infinite',
              },
            },
          ]}
        />
      </div>

      {selectedCase && (
        <Modal
          show={true}
          onHide={() => {
            setSelectedCase(null);
            setSavedFiles([]);
          }}
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
                fontFamily: 'DIM, sans-serif',
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
                          fontFamily: 'DIM, sans-serif',
                          textAlignLast: 'center',
                        }}
                      >
                        Comentario
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          backgroundColor: "#f1f1f1",
                          fontFamily: 'DIM, sans-serif',
                        }}
                      >
                        Fecha
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          backgroundColor: "#f1f1f1",
                          fontFamily: 'DIM, sans-serif',
                        }}
                      >
                        Hora
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "8px",
                          backgroundColor: "#f1f1f1",
                          fontFamily: 'DIM, sans-serif',
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
                                backgroundColor: "#fff",
                                wordWrap: "break-word",
                                maxWidth: "400px",
                                fontFamily: 'DIM, sans-serif',
                              }}
                            >
                              {comment.text}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                backgroundColor: "#fff",
                                fontFamily: 'DIM, sans-serif',
                              }}
                            >
                              {formattedDate || "Sin fecha"}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                backgroundColor: "#fff",
                                fontFamily: 'DIM, sans-serif',
                              }}
                            >
                              {formattedTime || "Sin hora"}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                padding: "8px",
                                backgroundColor: "#fff",
                                fontFamily: 'DIM, sans-serif',
                              }}
                            >
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
                                title="Eliminar comentario"
                                style={{ fontFamily: 'DIM, sans-serif' }}
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
                    fontFamily: 'DIM, sans-serif',
                  }}
                />
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddComment}
                  style={{ marginTop: "10px", fontFamily: 'DIM, sans-serif' }}
                >
                  Agregar Comentario
                </Button>
              </>
            ) : viewMode === "attachments" ? (
              <ImageUpload
                selectedCaseId={selectedCase.id}
                savedFiles={savedFiles}
                setSavedFiles={(newFiles) => {
                  setSavedFiles(newFiles);
                  setEditableRows((prevRows) =>
                    prevRows.map((row) =>
                      row.id === selectedCase.id ? { ...row, attachedFiles: newFiles as FileObject[] } : row
                    )
                  );
                }}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            ) : (
              <>
                <ul>
                  {selectedCase.history?.map((historyItem, index) => (
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
              </>
            )}
          </Modal.Body>
        </Modal>
      )}

      <Modal
        show={showDescriptionModal}
        onHide={() => setShowDescriptionModal(false)}
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
              fontFamily: 'DIM, sans-serif',
            }}
          >
            Descripción
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            value={selectedDescription}
            onChange={(e) => setSelectedDescription(e.target.value)}
            rows={10}
            style={{
              width: "100%",
              fontFamily: 'DIM, sans-serif',
              whiteSpace: "pre-wrap",
              fontSize: '1.2rem',
              lineHeight: '1.6',
              padding: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              resize: 'vertical',
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              if (selectedCase) {
                handleFieldChange(selectedCase.id, "description", selectedDescription);
              }
              setShowDescriptionModal(false);
            }}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <NotificationComponent notifications={notifications} setNotifications={setNotifications} />
    </div>
  );
};

export default BaggageTable;
