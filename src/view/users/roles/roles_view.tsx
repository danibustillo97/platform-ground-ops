"use client";
import React, { useState, useEffect } from "react";
import Styles from "@/view/users/roles/rolesView.module.css";
import { Role } from "@/entities/Role";
import { RoleRepositoryImpl } from "@/data/repositories/RoleRepositoryImpl";

const roleRepository = new RoleRepositoryImpl();

const RolesView: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentRole, setCurrentRole] = useState<Role | null>(null);
    const [roleName, setRoleName] = useState("");
    const [roleDescription, setRoleDescription] = useState("");
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

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

    const handleAddRole = async () => {
        if (roleName && roleDescription) {
            try {
                const newRole = await roleRepository.addRole({
                    id: 0,
                    rol: roleName,
                    description: roleDescription,
                    cant_user_asigned: 0,
                });
                setRoles([...roles, newRole]);
                setShowAddModal(false);
                setRoleName("");
                setRoleDescription("");
            } catch (error) {
                console.error("Error adding role:", error);
            }
        }
    };

    const openEditModal = (role: Role) => {
        setCurrentRole(role);
        setRoleName(role.rol);
        setRoleDescription(currentRole?.description || "");
        setShowEditModal(true);
    };

    const handleEditRole = async () => {
        if (currentRole && roleName && roleDescription) {
            try {
                const updatedRole = await roleRepository.editRole({
                    ...currentRole,
                    rol: roleName,
                    description: roleDescription,
                });
                setRoles(
                    roles.map((role) =>
                        role.id === updatedRole.id ? updatedRole : role,
                    ),
                );
                setShowEditModal(false);
                setCurrentRole(null);
                setRoleName("");
                setRoleDescription("");
            } catch (error) {
                console.error("Error editing role:", error);
            }
        } else {
            console.error("currentRole is null");
        }
    };

    const openDeleteModal = (roleId: number) => {
        setRoleToDelete(roleId);
        setShowDeleteModal(true);
    };

    const handleDeleteRole = async () => {
        if (roleToDelete !== null) {
            try {
                await roleRepository.deleteRole(roleToDelete);
                setRoles(roles.filter((role) => role.id !== roleToDelete));
                setShowDeleteModal(false);
                setRoleToDelete(null);
            } catch (error) {
                console.error("Error deleting role:", error);
            }
        }
    };

    return (
        <div className={Styles.ro_container_body}>
            <div className={Styles.container_header}>
                <h1 className={Styles.ro_title}>Gestión de Roles</h1>
                <button
                    className={`${Styles.button} ${Styles.addRoleButton}`}
                    onClick={() => setShowAddModal(true)}
                >
                    Añadir Rol
                </button>
            </div>

            <div className={Styles.tableContainer}>
                <table className={` ${Styles.table} table table-striped table-bordered`}>
                    <thead className={Styles.tableHeader}>
                        <tr>
                            <th className={Styles.tableHeaderCell}>Rol</th>
                            <th className={Styles.tableHeaderCell}>
                                Descripción
                            </th>
                            <th className={Styles.tableHeaderCell}>
                                Cant Asig
                            </th>
                            <th className={Styles.tableHeaderCell}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className={Styles.tableBody}>
                        {roles.map((role) => (
                            <tr key={role.id}>
                                <td className={Styles.tableCell}>{role.rol}</td>
                                <td className={Styles.tableCell}>
                                    {role.description}
                                </td>
                                <td className={Styles.tableCell}>
                                    {role.cant_user_asigned}
                                </td>
                                <td className={Styles.tableCell}>
                                    <button
                                        className={`${Styles.button} ${Styles.editButton}`}
                                        onClick={() => openEditModal(role)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className={`${Styles.button} ${Styles.deleteButton}`}
                                        onClick={() => openDeleteModal(role.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div className={Styles.modal}>
                    <div className={Styles.modalContent}>
                        <h2>Agregar Rol</h2>
                        <label>
                            Nombre del Rol:
                            <input
                                type="text"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                            />
                        </label>
                        <label>
                            Descripción:
                            <textarea
                                value={roleDescription}
                                onChange={(e) =>
                                    setRoleDescription(e.target.value)
                                }
                            />
                        </label>
                        <button onClick={handleAddRole}>Guardar</button>
                        <button
                            className="cancel"
                            onClick={() => setShowAddModal(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {showEditModal && currentRole && (
                <div className={Styles.modal}>
                    <div className={Styles.modalContent}>
                        <h2>Editar Rol</h2>
                        <label>
                            Nombre del Rol:
                            <input
                                type="text"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                            />
                        </label>
                        <label>
                            Descripción:
                            <textarea
                                value={roleDescription}
                                onChange={(e) =>
                                    setRoleDescription(e.target.value)
                                }
                            />
                        </label>
                        <button onClick={handleEditRole}>Guardar</button>
                        <button
                            className="cancel"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className={Styles.modalDelete}>
                    <div className={Styles.modalDeleteContent}>
                        <h2>Confirmar Eliminación</h2>
                        <p>
                            ¿Estás seguro de que deseas eliminar este rol? Esta
                            acción no se puede deshacer.
                        </p>
                        <button className="confirm" onClick={handleDeleteRole}>
                            Eliminar
                        </button>
                        <button
                            className="cancel"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesView;
