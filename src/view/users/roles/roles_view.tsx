"use client";
import React, { useState, useEffect } from "react";
import { Role } from "@/entities/Role";
import { RoleRepositoryImpl } from "@/data/repositories/RoleRepositoryImpl";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import ModalForm from "@/components/FormsModals/ModalForm";
import { Dialog } from "@mui/material";

const roleRepository = new RoleRepositoryImpl();

const RolesView: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [currentRole, setCurrentRole] = useState<Role | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const rolesData = await roleRepository.getRoles();
            setRoles(rolesData);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleAddRole = async (roleName: string, roleDescription: string) => {
        if (roleName && roleDescription) {
            try {
                const newRole = await roleRepository.addRole({
                    id: 0,
                    rol: roleName,
                    description: roleDescription,
                    cant_user_asigned: 0,
                });
                setRoles([...roles, newRole]);
                setIsAddModalOpen(false);
            } catch (error) {
                console.error("Error adding role:", error);
            }
        }
    };

    const handleEditRole = async (roleName: string, roleDescription: string) => {
        if (currentRole && roleName && roleDescription) {
            try {
                const updatedRole = await roleRepository.editRole({
                    ...currentRole,
                    rol: roleName,
                    description: roleDescription,
                });
                setRoles(
                    roles.map((role) =>
                        role.id === updatedRole.id ? updatedRole : role
                    ),
                );
                setIsEditModalOpen(false);
                setCurrentRole(null);
            } catch (error) {
                console.error("Error editing role:", error);
            }
        }
    };

    const openEditModal = (role: Role) => {
        setCurrentRole(role);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (roleId: number) => {
        setRoleToDelete(roleId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteRole = async () => {
        if (roleToDelete !== null) {
            try {
                await roleRepository.deleteRole(roleToDelete);
                setRoles(roles.filter((role) => role.id !== roleToDelete));
                setIsDeleteModalOpen(false);
                setRoleToDelete(null);
            } catch (error) {
                console.error("Error deleting role:", error);
            }
        }
    };

    const actionsBodyTemplate = (rowData: Role) => (
        <div>
            <Button icon={<FaEdit />} onClick={() => openEditModal(rowData)} className="p-button-rounded p-button-info" />
            <Button
                icon={<MdDeleteSweep />}
                onClick={() => openDeleteModal(rowData.id)}
                className="p-button-rounded p-button-danger p-ml-2"
            />
        </div>
    );

    return (
        <div className="roles-container">
            <div className="header">
                <h1>Gestión de Roles</h1>
                <Button
                    label="Añadir Rol"
                    icon={<IoIosAddCircleOutline />}
                    onClick={() => setIsAddModalOpen(true)}
                    className="p-button-success"
                />
            </div>

            <div className="table-container">
                <DataTable value={roles} paginator rows={10} className="p-datatable-gridlines">
                    <Column field="rol" header="Rol" />
                    <Column field="description" header="Descripción" />
                    <Column field="cant_user_asigned" header="Cant. Asig." />
                    <Column body={actionsBodyTemplate} header="Acciones" />
                </DataTable>
            </div>

            {/* Modal para agregar rol */}
            <ModalForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddRole} />

            {/* Modal para editar rol */}
            {currentRole && (
                <ModalForm
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleEditRole}
                    roleName={currentRole.rol}
                    roleDescription={currentRole.description || ""}
                />
            )}

            {/* Modal de confirmación de eliminación */}
            {isDeleteModalOpen && (
                <Dialog
                    header="Confirmar Eliminación"
                    visible={isDeleteModalOpen}
                    style={{ width: "30vw" }}
                    onHide={() => setIsDeleteModalOpen(false)}
                >
                    <p>¿Estás seguro de que deseas eliminar este rol?</p>
                    <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={handleDeleteRole} />
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setIsDeleteModalOpen(false)} />
                </Dialog>
            )}
        </div>
    );
};

export default RolesView;
