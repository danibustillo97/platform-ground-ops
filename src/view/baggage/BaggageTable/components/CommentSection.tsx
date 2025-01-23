import React from "react";
import { Button, Form } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import styles from "../styles/BaggageTable.module.css";
import { BaggageCase } from "../types/BaggageCase";

interface CommentSectionProps {
  selectedCase: BaggageCase | null;
  newComment: string;
  setNewComment: (comment: string) => void;
  handleAddComment: () => void;
  handleDeleteComment: (commentId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  selectedCase,
  newComment,
  setNewComment,
  handleAddComment,
  handleDeleteComment,
}) => {
  return (
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
  );
};

export default CommentSection;
