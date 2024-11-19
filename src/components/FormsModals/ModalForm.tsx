import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

interface ModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (roleName: string, roleDescription: string) => void;
    roleName?: string;
    roleDescription?: string;
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose, onSave, roleName = "", roleDescription = "" }) => {
    const [newRoleName, setNewRoleName] = useState(roleName);
    const [newRoleDescription, setNewRoleDescription] = useState(roleDescription);

    const handleSave = () => {
        onSave(newRoleName, newRoleDescription);
        setNewRoleName("");
        setNewRoleDescription("");
    };

    return (
        <Dialog header={roleName ? "Editar Rol" : "Agregar Rol"} visible={isOpen} style={{ width: "50vw" }} onHide={onClose}>
            <div>
                <div className="p-field p-grid">
                    <label htmlFor="rol" className="p-col-12 p-md-2">
                        Nombre del Rol
                    </label>
                    <div className="p-col-12 p-md-10">
                        <InputText
                            id="rol"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            placeholder="Nombre del Rol"
                        />
                    </div>
                </div>

                <div className="p-field p-grid">
                    <label htmlFor="description" className="p-col-12 p-md-2">
                        Descripción
                    </label>
                    <div className="p-col-12 p-md-10">
                        <InputTextarea
                            id="description"
                            value={newRoleDescription}
                            onChange={(e) => setNewRoleDescription(e.target.value)}
                            rows={3}
                            placeholder="Descripción del Rol"
                        />
                    </div>
                </div>

                <div className="p-d-flex p-jc-end">
                    <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={onClose} />
                </div>
            </div>
        </Dialog>
    );
};

export default ModalForm;
