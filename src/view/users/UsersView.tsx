"use client";

import React, { useState, useEffect } from "react";
import {
    fetchAllUsers,
    deleteUserById,
    createNewUser,
    updateExistingUser,
} from "@/view/users/userController";
import { User } from "@/domain/entities/User";
import styles from "@/view/users/users.module.css";

const UsersView: React.FC = () => {
    const [usersData, setUsersData] = useState<User[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userForm, setUserForm] = useState<User>({
        id: 0,
        name: "",
        email: "",
        phone: "",
        rol: "",
        estacion: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersResponse = await fetchAllUsers();
            setUsersData(usersResponse);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteUserById(id);
            fetchUsers();
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    };

    const handleSaveUser = async () => {
        if (editingUser) {
            // Editar usuario
            await updateExistingUser(editingUser.id, userForm);
        } else {
            // Crear usuario
            await createNewUser(userForm);
        }
        setShowModal(false);
        setEditingUser(null);
        setUserForm({
            id: 0,
            name: "",
            email: "",
            phone: "",
            rol: "",
            estacion: "",
        });
        fetchUsers();
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setUserForm(user);
        setShowModal(true);
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setUserForm({
            id: 0,
            name: "",
            email: "",
            phone: "",
            rol: "",
            estacion: "",
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    if (loading) {
        return <div>Cargando usuarios...</div>;
    }

    return (
        <div className={styles.userManagementContainer}>
            <h1 className={styles.userManagementHeader}>Gestión de Usuarios</h1>
            <div className={styles.userActionsContainer}>
                <button className={styles.addButton} onClick={handleAddUser}>
                    Agregar Usuario
                </button>
            </div>
            <div className={styles.userTableContainer}>
                {usersData && usersData.length > 0 ? (
                    <table className={styles.userTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Rol</th>
                                <th>Estación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.rol}</td>
                                    <td>{user.estacion}</td>
                                    <td className={styles.containerAction}>
                                        <button
                                            className={styles.userEditButton}
                                            onClick={() => handleEditUser(user)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={styles.userDeleteButton}
                                            onClick={() =>
                                                handleDelete(user.id)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No se encontraron usuarios.</p>
                )}
            </div>

            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>
                            {editingUser ? "Editar Usuario" : "Agregar Usuario"}
                        </h2>
                        <div className={styles.userFormGroup}>
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={userForm.name}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        name: e.target.value,
                                    })
                                }
                                className={styles.userFormInput}
                            />
                        </div>
                        <div className={styles.userFormGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                value={userForm.email}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        email: e.target.value,
                                    })
                                }
                                className={styles.userFormInput}
                            />
                        </div>
                        <div className={styles.userFormGroup}>
                            <label>Teléfono</label>
                            <input
                                type="text"
                                value={userForm.phone}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        phone: e.target.value,
                                    })
                                }
                                className={styles.userFormInput}
                            />
                        </div>
                        <div className={styles.userFormGroup}>
                            <label>Rol</label>
                            <input
                                type="text"
                                value={userForm.rol}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        rol: e.target.value,
                                    })
                                }
                                className={styles.userFormInput}
                            />
                        </div>
                        <div className={styles.userFormGroup}>
                            <label>Estación</label>
                            <input
                                type="text"
                                value={userForm.estacion}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        estacion: e.target.value,
                                    })
                                }
                                className={styles.userFormInput}
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={handleCloseModal}
                            >
                                Cancelar
                            </button>
                            <button
                                className={styles.submitButton}
                                onClick={handleSaveUser}
                            >
                                {editingUser ? "Guardar Cambios" : "Agregar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersView;
