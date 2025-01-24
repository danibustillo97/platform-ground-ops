import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Card, Spinner, Col, Row, Alert } from "react-bootstrap";
import { getSession } from "next-auth/react";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { FileObject } from "@/view/baggage/BaggageTable/types/FileObject";

interface ImageUploadProps {
  selectedCaseId: string | null;
  savedFiles: FileObject[];
  setSavedFiles: React.Dispatch<React.SetStateAction<FileObject[]>>;
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedCaseId,
  savedFiles,
  setSavedFiles,
  selectedImage,
  setSelectedImage,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadSuccess(null);

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

      const newFile: FileObject = {
        fileUrl: data.secure_url,
        id_case: selectedCaseId!,
        file,
        mediaSave: true,
      };

      await sendFileToEndpoint(newFile);

      setSavedFiles((prevFiles) => [...prevFiles, newFile]);
      setSelectedFile(null);
      setUploadSuccess("Imagen subida exitosamente.");
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      setUploadSuccess("Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const sendFileToEndpoint = async (fileObject: FileObject) => {
    const session = await getSession();
    const token = session?.user.access_token as string;

    try {
      const response = await fetch(
        `https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/station/upload-file/${fileObject.id_case}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(fileObject),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar la imagen al endpoint");
      }

      const savedData = await response.json();
      console.log("Datos guardados:", savedData);
    } catch (error) {
      console.error("Error al enviar la imagen al endpoint:", error);
      alert("Hubo un error al enviar la imagen al endpoint.");
    }
  };

  const showImageInLarge = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    // No resetear la imagen seleccionada al cerrar el modal
    setSelectedImage(null);
  };

  const handleDeleteImage = async (fileUrl: string, imageId?: string) => {
    if (!imageId) {
      alert("No se puede eliminar la imagen: ID no proporcionado.");
      return;
    }

    try {
      const response = await fetch(
        `https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/baggage-case/attachments/${imageId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la imagen");
      }

      setSavedFiles((prevFiles) => prevFiles.filter((file) => file.fileUrl !== fileUrl));
      setSelectedImage(null);  // Si la imagen eliminada era la seleccionada, resetear el modal
      alert("Imagen eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      alert("Hubo un error al eliminar la imagen.");
    }
  };

  // Effect hook to reset selectedImage when savedFiles change
  useEffect(() => {
    // Si la imagen seleccionada ya no existe en la lista, resetear selectedImage
    if (!savedFiles.some(file => file.fileUrl === selectedImage)) {
      setSelectedImage(null);
    }
  }, [savedFiles, selectedImage]);

  return (
    <div className="image-upload-container p-4 rounded" style={{ backgroundColor: "#f9f9f9", border: "1px solid #e0e0e0" }}>
      <h4 className="text-dark mb-4" style={{ fontWeight: "bold" }}>Gestión de Imágenes</h4>

      {uploadSuccess && (
        <Alert variant={uploadSuccess.includes("Error") ? "danger" : "success"}>{uploadSuccess}</Alert>
      )}

      <Row className="g-3">
        {savedFiles.map((file: FileObject, index: React.Key) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="position-relative">
            <Card className="shadow-sm h-100" style={{ borderRadius: "10px" }}>
              <Card.Img
                variant="top"
                src={file.fileUrl}
                alt={`Imagen ${index}`}
                style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px", cursor: "pointer" }}
                onClick={() => showImageInLarge(file.fileUrl)}
              />
              <Card.Body>
                <Card.Text className="text-center text-muted mb-2">
                  {file.mediaSave && <small>Guardado en la nube</small>}
                </Card.Text>
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => showImageInLarge(file.fileUrl)}
                  >
                    <FaEye /> Ver
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteImage(file.fileUrl, file.image_id)}
                  >
                    <FaTrashAlt /> Eliminar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Form.Group controlId="imageUpload" className="mt-4">
        <Form.Label className="fw-bold">Subir Nueva Imagen</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} className="mb-3" />
        <Button
          variant="primary"
          onClick={() => {
            if (selectedFile) {
              uploadImage(selectedFile);
            } else {
              alert("Por favor selecciona un archivo antes de subirlo.");
            }
          }}
          disabled={uploading}
        >
          {uploading ? <Spinner animation="border" size="sm" /> : "Subir Imagen"}
        </Button>
      </Form.Group>

      <p className="mt-3">Total de archivos adjuntos: <strong>{savedFiles.length}</strong></p>

      <Modal show={!!selectedImage} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Vista Previa</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              style={{ maxWidth: "100%", height: "auto", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ImageUpload;
