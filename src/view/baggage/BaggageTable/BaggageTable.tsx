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
import Alert from "@/components/Alerts/Alert";
import StationDropdown from "./components/DropDown/StationDropdown/StationDropdown";
import { BaggageTableProps } from "@/view/baggage/BaggageTable/types/BaggageTableProps";
import { FileObject } from "@/view/baggage/BaggageTable/types/FileObject";
import NotificationComponent from "@/components/NotificationComponent";

interface BaggageTableWithNotificationsProps extends BaggageTableProps {
  onNotificationChange: (newNotifications: number) => void;
}

const BaggageTable: React.FC<BaggageTableWithNotificationsProps> = ({ rows, onSaveChanges, onEdit, onCancel, onNotificationChange }) => {
  const [editableRows, setEditableRows] = useState<BaggageCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<BaggageCase | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [viewMode, setViewMode] = useState<"comments" | "attachments" | "history">("comments");
  const [agents, setAgents] = useState<User[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<FileObject[]>([]);
  const [savedFiles, setSavedFiles] = useState<FileObject[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [modifiedRows, setModifiedRows] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<{ [key: string]: boolean }>({});

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

  useEffect(() => {
    const pendingNotifications = Object.values(notifications).filter(status => status === undefined).length;
    onNotificationChange(pendingNotifications);
  }, [notifications, onNotificationChange]);

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
    sendNotifications(id, station);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "AraDataLoad");

      const response = await fetch(`https://api.cloudinary.com/v1_1/dbxlcscfu/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error subiendo la imagen a Cloudinary");
      }

      const data = await response.json();

      const newFile: FileObject = { fileUrl: data.secure_url, id_case: selectedCase!.id, file, mediaSave: false };
      setFilesToUpload((prevFiles) => [...prevFiles, newFile]);

      setSelectedFile(null);
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
    } finally {
      setUploading(false);
    }
  }

  const showImageInLarge = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleDeleteImage = async (fileUrl: string, imageId?: string) => {
    if (!imageId) {
      alert("No se puede eliminar la imagen: ID no proporcionado.");
      return;
    }

    try {
      const response = await fetch(`https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/baggage-case/attachments/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la imagen");
      }

      setSavedFiles((prevFiles) => prevFiles.filter((file) => file.fileUrl !== fileUrl));
      alert("Imagen eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      alert("Hubo un error al eliminar la imagen.");
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
      Alert({ type: "success", message: "Comentario agregado con éxito" });
      setEditableRows(updatedRow);
      setSelectedCase(updatedRow.find((row) => row.id === selectedCase?.id) || null);
      setNewComment("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/baggage-case/delete_comment/${commentId}`, {
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

    } catch (error) {
      console.error(error);
      Alert({ type: "error", message: "Error al eliminar el comentario" });
    }
  };

  const sendNotifications = (id: string, station: string) => {
    const agentsToNotify = agents.filter(agent => agent.estacion === station);
    const newNotifications = agentsToNotify.reduce((acc, agent) => {
      acc[agent.id.toString()] = false;
      return acc;
    }, {} as { [key: string]: boolean });

    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      ...newNotifications,
    }));
  };

  const handleSave = async (id: string) => {
    const updatedRow = editableRows.find((row) => row.id === id);
    if (updatedRow) {
      const updatedRowWithFiles = {
        ...updatedRow,
        attachedFiles: [...filesToUpload],
        Station_Asigned: updatedRow.Station_Asigned,
      };

      const session = await getSession();
      const token = session?.user.access_token as string;
      try {
        console.log("Datos a guardar:", updatedRowWithFiles);

        const response = await fetch(`http://localhost:8000/api/baggage-case/${id}`, {
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
        console.log("Datos guardados:", savedData);

        onSaveChanges([updatedRowWithFiles]);
        setEditingRowId(null);
        setModifiedRows((prevModifiedRows) => {
          const newModifiedRows = new Set(prevModifiedRows);
          newModifiedRows.delete(id);
          return newModifiedRows;
        });
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
        alert("Hubo un error al guardar los cambios.");
      }
    }
  };

  const handleDeleteCases = async (id: string) => {
    const session = await getSession();
    const token = session?.user.access_token as string;
    try {
      const response = await fetch(`https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/baggage-case/${id}`, {
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
      Alert({ type: "success", message: "Se eliminó con éxito" });

    } catch (error) {
      console.error(error);
      Alert({ type: "error", message: "Error al eliminar el caso" });
    }
  }

  const handleCancel = () => {
    setEditableRows(rows);
    setSelectedCase(null);
    setViewMode("comments");
    setEditingRowId(null);
    setModifiedRows(new Set());
  };

  const handleSendEmail = async () => {
    console.log("Click");
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
      width: "120px"
    },
    {
      name: "BAGTAG",
      selector: (row) => row.baggage_code || "-",
      sortable: true,
      width: "110px"
    },
    {
      name: "Ticket Zendesk",
      selector: (row) => row.number_ticket_zendesk || "-",
      sortable: true,
      width: "120px"
    },
    {
      name: "Agente",
      width: "180px",
      selector: (row) => row.agentId || "-",
      sortable: true,
      cell: (row) => (
        <Form.Group>
          <div style={{ width: "100%", maxWidth: "180px" }}>
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
      name: "From_Airport",
      selector: (row) => row.from_airport || "-",
      sortable: true,
      width: "130px"
    },
    {
      name: "To_Airport",
      selector: (row) => row.to_airport || "-",
      sortable: true,
      width: "130px"
    },
    {
      name: "Fligth_Number",
      selector: (row) => "DM-" + row.flight_number || "-",
      sortable: true,
      width: "130px"
    },
    {
      name: "Estación",
      selector: (row) => row.Station_Asigned || "-",
      sortable: true,
      width: "150px",
      cell: (row) => (
        <StationDropdown
          onChange={(value) => handleStationChange(row.id, value)}
          value={row.Station_Asigned || ""}
        />
      ),
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
          disabled={editingRowId !== row.id}
        />
      ),
    },
    {
      name: "Correo",
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
      name: "Teléfono",
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
      name: "Descripción",
      selector: (row) => row.description || "-",
      sortable: true,
      width: "250px",
      cell: (row) => (
        <Form.Control
          value={row.description || ""}
          onChange={(e) => handleFieldChange(row.id, "description", e.target.value)}
          size="sm"
          style={{ resize: "none", overflow: "hidden" }}
          disabled={editingRowId !== row.id}
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
          disabled={editingRowId !== row.id}
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
              },
            },
            headCells: {
              style: {
                fontFamily: 'DIM, sans-serif',
                fontWeight: 'bold',
                backgroundColor: '#f8f9fa',
              },
            },
            cells: {
              style: {
                fontFamily: 'DIM, sans-serif',
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
              },
            },
          ]}
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
                          borderBottom: "1px solid #ddd",
                          fontFamily: 'DIM, sans-serif',
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
                          borderBottom: "1px solid #ddd",
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
                          borderBottom: "1px solid #ddd",
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
                                borderBottom: "1px solid #ddd",
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
                                borderBottom: "1px solid #ddd",
                                backgroundColor: "#fff",
                                fontFamily: 'DIM, sans-serif',
                              }}
                            >
                              {formattedDate || "Sin fecha"}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                borderBottom: "1px solid #ddd",
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
                                borderBottom: "1px solid #ddd",
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
              <>
                <h6 style={{ fontFamily: 'DIM, sans-serif' }}>Imágenes ya guardadas</h6>
                <ul style={{ display: 'flex', flexWrap: 'wrap', padding: 0 }}>
                  {savedFiles.map((file: FileObject, index: React.Key) => (
                    <li
                      key={index}
                      style={{
                        backgroundColor: "#f8f9fa",
                        margin: "5px",
                        padding: "8px",
                        borderRadius: "4px",
                        listStyleType: 'none',
                        display: 'inline-block',
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        width: '150px',
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: 10000,
                        fontFamily: 'DIM, sans-serif',
                      }}
                    >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        style={{
                          position: 'absolute',
                          top: '0px',
                          right: '0px',
                          zIndex: 1,
                          backgroundColor: 'rgba(158, 0, 0, 0.84)',
                          color: 'white',
                          fontFamily: 'DIM, sans-serif',
                        }}
                        onClick={() => { handleDeleteImage(file.fileUrl, file.image_id); console.log(file.image_id); console.log(file.id_case); }}
                      >
                        <FaTimesCircle />
                      </Button>
                      <img
                        src={file.fileUrl}
                        alt={`Uploaded Image ${index} ${file.image_id}`}
                        title={`Image ID: ${file.image_id}`}
                        style={{ maxWidth: '100%', height: 'auto', display: 'block', borderRadius: '4px', zIndex: '20000' }}
                        onClick={() => showImageInLarge(file.fileUrl)}
                      />
                      {file.mediaSave && (
                        <div style={{ textAlign: 'center', marginTop: '15px', fontFamily: 'DIM, sans-serif' }}>
                          <small>Media Save</small>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                <h6 style={{ fontFamily: 'DIM, sans-serif' }}>Imágenes por subir</h6>
                <ul style={{ display: 'flex', flexWrap: 'wrap', padding: 0 }}>
                  {filesToUpload.map((file: FileObject, index: React.Key) => (
                    <li
                      key={index}
                      style={{
                        backgroundColor: "#f8f9fa",
                        margin: "5px",
                        padding: "8px",
                        borderRadius: "4px",
                        listStyleType: 'none',
                        display: 'inline-block',
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        width: '120px',
                        cursor: 'pointer',
                        position: 'relative',
                        fontFamily: 'DIM, sans-serif',
                      }}
                    >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          zIndex: 1,
                          fontFamily: 'DIM, sans-serif',
                        }}
                        onClick={() => {
                          handleDeleteImage(file.image_id ? file.fileUrl : file.fileUrl);
                        }}
                      >
                        <FaTimesCircle />
                      </Button>
                      <img
                        src={file.fileUrl}
                        alt={`Uploaded Image ${index}`}
                        style={{ maxWidth: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
                        onClick={() => showImageInLarge(file.fileUrl)}
                      />
                    </li>
                  ))}
                </ul>

                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  style={{ marginTop: "10px", fontFamily: 'DIM, sans-serif' }}
                />

                <Button
                  variant="primary"
                  onClick={() => {
                    if (selectedFile) {
                      uploadImage(selectedFile);
                    } else {
                      console.error("No se ha seleccionado un archivo.");
                    }
                  }}
                  style={{ marginTop: "10px", fontFamily: 'DIM, sans-serif' }}
                  disabled={uploading}
                >
                  {uploading ? "Subiendo..." : "Guardar imagen"}
                </Button>

                <Modal show={selectedImage !== null} onHide={closeModal} style={{ zIndex: 20000, marginTop: '50px', animation: 'ease', fontFamily: 'DIM, sans-serif' }}>
                  <Modal.Header closeButton>
                    <Modal.Title style={{ fontFamily: 'DIM, sans-serif' }}>Preview</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {selectedImage && (
                      <img
                        src={selectedImage}
                        alt="Vista previa grande"
                        style={{ width: '100%', height: 'auto', zIndex: 20000, display: 'block', margin: '0 auto', borderRadius: '4px' }}
                      />
                    )}
                  </Modal.Body>
                </Modal>

              </>
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

      <NotificationComponent notifications={notifications} setNotifications={setNotifications} />
    </div>
  );
};

export default BaggageTable;
