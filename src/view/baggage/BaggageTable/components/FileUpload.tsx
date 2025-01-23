import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import styles from "../styles/BaggageTable.module.css";

interface FileUploadProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadImage: (file: File) => void;
  uploading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ handleFileChange, uploadImage, uploading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (selectedFile) {
      uploadImage(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div>
      <Form.Control
        type="file"
        onChange={(e) => {
          handleFileChange(e as React.ChangeEvent<HTMLInputElement>);
          const input = e.target as HTMLInputElement;
          setSelectedFile(input.files && input.files[0] ? input.files[0] : null);
        }}
        style={{ marginTop: "10px", fontFamily: 'DIM, sans-serif' }}
      />
      <Button
        variant="primary"
        onClick={handleUpload}
        style={{ marginTop: "10px", fontFamily: 'DIM, sans-serif' }}
        disabled={uploading || !selectedFile}
      >
        {uploading ? "Subiendo..." : "Guardar imagen"}
      </Button>
    </div>
  );
};

export default FileUpload;
