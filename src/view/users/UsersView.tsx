"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { RoleRepositoryImpl } from "@/data/repositories/RoleRepositoryImpl";
import styles from "@/view/users/users.module.css";
import { Role } from "@/domain/entities/Role";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const API_URL = "https://f2e0-20-81-239-96.ngrok-free.app/api/users/";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    rol: string | null;
    estacion: string | null;
}

const UsersView: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        phone: "",
        rol: "",
        estacion: "",
    });
    const [roles, setRoles] = useState<Role[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRoles = async () => {
            const roleRepository = new RoleRepositoryImpl();
            try {
                const rolesData = await roleRepository.getRoles();
                setRoles(rolesData);
            } catch (error) {
                console.error("Error al obtener los roles:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get<User[]>(API_URL, {
                    headers: { "ngrok-skip-browser-warning": "true" },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
            }
        };

        fetchRoles();
        fetchUsers();
    }, []);

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setNewUser({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            rol: user.rol || "",
            estacion: user.estacion || "",
        });
        setModalMode("edit");
        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const checkUserExists = async (email: string) => {
        try {
            const response = await axios.get<User[]>(
                `${API_URL}?email=${email}`,
            );
            return response.data.length > 0;
        } catch (error) {
            console.error("Error al verificar existencia de usuario:", error);
            return false;
        }
    };

    const handleSubmit = async () => {
        if (await checkUserExists(newUser.email)) {
            toast.error("Error: El usuario ya existe.");
            return;
        }

        try {
            if (modalMode === "add") {
                const response = await axios.post<User>(API_URL, newUser, {
                    headers: { "ngrok-skip-browser-warning": "true" },
                });
                const createdUser = response.data;
                setUsers((prevUsers) => [...prevUsers, createdUser]);
                toast.success("Usuario creado con éxito");
            } else if (selectedUser) {
                const response = await axios.put<User>(
                    `${API_URL}${selectedUser.id}/`,
                    newUser,
                    {
                        headers: { "ngrok-skip-browser-warning": "true" },
                    },
                );
                const updatedUser = response.data;
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === updatedUser.id ? updatedUser : user,
                    ),
                );
                toast.success("Usuario actualizado con éxito");
            }
            setShowModal(false);
            setNewUser({
                name: "",
                email: "",
                phone: "",
                rol: "",
                estacion: "",
            });
            setSelectedUser(null);
        } catch (error) {
            console.error("Error al procesar el usuario:", error);
            toast.error("Error al procesar el usuario");
        }
    };

    const handleDelete = async (userId: number) => {
        confirmAlert({
            title: "Confirmar Eliminación",
            message: "¿Estás seguro de que deseas eliminar este usuario?",
            buttons: [
                {
                    label: "Sí",
                    onClick: async () => {
                        try {
                            await axios.delete(`${API_URL}${userId}/`, {
                                headers: {
                                    "ngrok-skip-browser-warning": "true",
                                },
                            });
                            setUsers((prevUsers) =>
                                prevUsers.filter((user) => user.id !== userId),
                            );
                            toast.success("Usuario eliminado con éxito");
                        } catch (error) {
                            console.error(
                                "Error al eliminar el usuario:",
                                error,
                            );
                            toast.error("Error al eliminar el usuario");
                        }
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    if (loading) {
        return <div>Cargando roles...</div>;
    }

    return (
        <div className={styles.userManagementContainer}>
            <h1 className={styles.userManagementHeader}>Gestión de Usuarios</h1>

            <div className={styles.userActionsContainer}>
                <button
                    onClick={() => {
                        setModalMode("add");
                        setShowModal(true);
                    }}
                >
                    <MdAdd size={20} />
                    Añadir Usuario
                </button>
                <button onClick={() => {}}>
                    <MdEdit size={20} />
                    Gestionar Roles
                </button>
            </div>

            <div className={styles.userTableContainer}>
                <table className={styles.userTable}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Estación</th>
                            <th>Correo Electrónico</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.estacion || "N/A"}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || "N/A"}</td>
                                <td>{user.rol || "N/A"}</td>
                                <td>
                                    <div className={styles.containerAction}>
                                        <button
                                            onClick={() =>
                                                handleUserSelect(user)
                                            }
                                            className={styles.userEditButton}
                                        >
                                            <MdEdit size={16} />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(user.id)
                                            }
                                            className={styles.userDeleteButton}
                                        >
                                            <MdDelete size={16} />
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>
                            {modalMode === "add"
                                ? "Añadir Usuario"
                                : "Editar Usuario"}
                        </h2>
                        <div className={styles.userFormGroup}>
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={newUser.name}
                                onChange={handleInputChange}
                                className={styles.userFormInput}
                            />
                        </div>
                        <div className={styles.userFormGroup}>
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleInputChange}
                                className={styles.userFormInput}
                            />
                        </div>
                        <div className={styles.userFormGroup}>
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="phone"
                                value={newUser.phone || ""}
                                onChange={handleInputChange}
                                className={styles.userFormInput}
                            />
                        </div>
                        <div className={styles.userFormGroup}>
                            <label>Estación</label>
                            <input
                                type="text"
                                name="estacion"
                                value={newUser.estacion || ""}
                                onChange={handleInputChange}
                                className={styles.userFormInput}
                            />
                        </div>
                        <div className={styles.userFormGroup}>
                            <label>Rol</label>
                            <select
                                name="rol"
                                value={newUser.rol}
                                onChange={handleSelectChange}
                                className={styles.userFormSelect}
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.rol}>
                                        {role.rol}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className={styles.userFormButton}
                        >
                            {modalMode === "add"
                                ? "Crear Usuario"
                                : "Actualizar Usuario"}
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className={`${styles.userFormButton} ${styles.cancel}`}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default UsersView;
