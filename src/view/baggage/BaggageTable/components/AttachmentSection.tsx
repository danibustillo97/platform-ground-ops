import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import { FileObject } from "@/view/baggage/BaggageTable/types/FileObject";
import styles from "@/view/baggage/baggage.module.css";

interface ImageModalProps {
  show: boolean;
  onHide: () => void;
  savedFiles: FileObject[];
  filesToUpload: FileObject[];
  setFilesToUpload: React.Dispatch<React.SetStateAction<FileObject[]>>;
  setSavedFiles: React.Dispatch<React.SetStateAction<FileObject[]>>;
  uploadImage: (file: File) => Promise<void>;
  handleDeleteImage: (fileUrl: string, imageId?: string) => Promise<void>;
}

const ImageModal: React.FC<ImageModalProps> = ({
  show,
  onHide,
  savedFiles,
  filesToUpload,
  setFilesToUpload,
  setSavedFiles,

}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
    }
  };


  const handleUploadImage = async (file: File) => {
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
  
      const newFile: FileObject = { fileUrl: data.secure_url, id_case: "default_case_id", file, mediaSave: false };
      setFilesToUpload((prevFiles) => [...prevFiles, newFile]);
  
      setSelectedImage(null);
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

  const handleUpload = async () => {
    if (selectedFile) {
      setUploading(true);
      try {
        await handleUploadImage(selectedFile);
        setSelectedFile(null);
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      } finally {
        setUploading(false);
      }
    } else {
      console.error("No se ha seleccionado un archivo.");
    }
  };

  const handleDelete = async (fileUrl: string, imageId?: string) => {
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

  return (
    <Modal show={show} onHide={onHide} size="lg" className={styles.modalComment} centered>
      <Modal.Header closeButton style={{ backgroundColor: '#007bff', color: 'white', borderBottom: 'none' }}>
        <Modal.Title style={{ fontFamily: 'DIM, sans-serif', fontSize: '1.5rem', fontWeight: 'bold' }}>Archivos Adjuntos</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: '2rem', backgroundColor: '#f8f9fa' }}>
        <h6 style={{ fontFamily: 'DIM, sans-serif', fontSize: '1.2rem', marginBottom: '1rem', color: '#333' }}>Imágenes ya guardadas</h6>
        <ul style={{ display: 'flex', flexWrap: 'wrap', padding: 0, gap: '1rem' }}>
          {savedFiles.map((file: FileObject, index: React.Key) => (
            <li
              key={index}
              style={{
                backgroundColor: "#ffffff",
                margin: "5px",
                padding: "1rem",
                borderRadius: "8px",
                listStyleType: 'none',
                display: 'inline-block',
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                width: '150px',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 10000,
                fontFamily: 'DIM, sans-serif',
                border: '1px solid #ddd',
              }}
            >
              <Button
                variant="outline-danger"
                size="sm"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 1,
                  backgroundColor: 'rgba(158, 0, 0, 0.84)',
                  color: 'white',
                  fontFamily: 'DIM, sans-serif',
                }}
                onClick={() => handleDelete(file.fileUrl, file.image_id)}
              >
                <FaTimesCircle />
              </Button>
              <img
                src={file.fileUrl}
                alt={`Uploaded Image ${index} ${file.image_id}`}
                title={`Image ID: ${file.image_id}`}
                style={{ maxWidth: '100%', height: 'auto', display: 'block', borderRadius: '8px', zIndex: '20000' }}
                onClick={() => showImageInLarge(file.fileUrl)}
              />
              {file.mediaSave && (
                <div style={{ textAlign: 'center', marginTop: '15px', fontFamily: 'DIM, sans-serif', color: '#555' }}>
                  <small>Media Save</small>
                </div>
              )}
            </li>
          ))}
        </ul>

        <h6 style={{ fontFamily: 'DIM, sans-serif', fontSize: '1.2rem', marginBottom: '1rem', color: '#333', marginTop: '2rem' }}>Imágenes por subir</h6>
        <ul style={{ display: 'flex', flexWrap: 'wrap', padding: 0, gap: '1rem' }}>
          {filesToUpload.map((file: FileObject, index: React.Key) => (
            <li
              key={index}
              style={{
                backgroundColor: "#ffffff",
                margin: "5px",
                padding: "1rem",
                borderRadius: "8px",
                listStyleType: 'none',
                display: 'inline-block',
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                width: '120px',
                cursor: 'pointer',
                position: 'relative',
                fontFamily: 'DIM, sans-serif',
                border: '1px solid #ddd',
              }}
            >
              <Button
                variant="outline-danger"
                size="sm"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 1,
                  fontFamily: 'DIM, sans-serif',
                }}
                onClick={() => handleDelete(file.fileUrl)}
              >
                <FaTimesCircle />
              </Button>
              <img
                src={file.fileUrl}
                alt={`Uploaded Image ${index}`}
                style={{ maxWidth: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
                onClick={() => showImageInLarge(file.fileUrl)}
              />
            </li>
          ))}
        </ul>

        <Form.Control
          type="file"
          onChange={handleFileChange}
          style={{ marginTop: "20px", fontFamily: 'DIM, sans-serif', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}
        />

        <Button
          variant="primary"
          onClick={handleUpload}
          style={{ marginTop: "20px", fontFamily: 'DIM, sans-serif', backgroundColor: '#007bff', border: 'none', borderRadius: '8px', padding: '10px 20px' }}
          disabled={uploading}
        >
          {uploading ? "Subiendo..." : "Guardar imagen"}
        </Button>

        <Modal show={selectedImage !== null} onHide={closeModal} style={{ zIndex: 20000, marginTop: '50px', animation: 'ease', fontFamily: 'DIM, sans-serif' }}>
          <Modal.Header closeButton style={{ backgroundColor: '#007bff', color: 'white', borderBottom: 'none' }}>
            <Modal.Title style={{ fontFamily: 'DIM, sans-serif', fontSize: '1.5rem', fontWeight: 'bold' }}>Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '2rem', backgroundColor: '#f8f9fa' }}>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Vista previa grande"
                style={{ width: '100%', height: 'auto', zIndex: 20000, display: 'block', margin: '0 auto', borderRadius: '8px' }}
              />
            )}
          </Modal.Body>
        </Modal>
      </Modal.Body>
    </Modal>
  );
};

export default ImageModal;
































