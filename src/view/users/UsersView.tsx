"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/domain/entities/User";
import { UserUseCases } from "@/domain/usecases/UsersUseCase";
import { UserRepositoryImpl } from "@/data/repositories/UserRepositoryImpl";
import styles from "@/view/users/users.module.css";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useRouter } from "next/navigation";

const UsersView: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        phone: "",
        rol: "",
        estacion: "",
        password: "",
    });
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();
    const userRepository = new UserRepositoryImpl();
    const userUseCases = new UserUseCases(userRepository);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await userUseCases.getUsers();
                if (Array.isArray(usersData)) {
                    setUsers(usersData);
                } else {
                    console.error(
                        "Error: los datos de usuarios no son un array.",
                    );
                    toast.error(
                        "Error: los datos de usuarios no son un array.",
                    );
                    setUsers([]);
                }
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
                toast.error("Error al obtener los usuarios.");
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const resetNewUser = () => {
        setNewUser({
            name: "",
            email: "",
            phone: "",
            rol: "",
            estacion: "",
            password: "",
        });
    };

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setNewUser({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            rol: user.rol || "",
            estacion: user.estacion || "",
            password: "",
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

    const handleSubmit = async () => {
        try {
            if (modalMode === "add") {
                await userUseCases.createUser(newUser);
                toast.success("Usuario creado con éxito");
            } else if (selectedUser) {
                await userUseCases.updateUser(
                    selectedUser.id,
                    newUser,
                    selectedUser,
                );
                toast.success("Usuario actualizado con éxito");
            }
            setShowModal(false);
            resetNewUser();
            setSelectedUser(null);
            const updatedUsers = await userUseCases.getUsers();
            setUsers(updatedUsers);
        } catch (error) {
            console.error("Error al procesar el usuario:", error);
            toast.error("Error al procesar el usuario.");
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
                            await userUseCases.deleteUser(userId);
                            setUsers((prevUsers) =>
                                prevUsers.filter((user) => user.id !== userId),
                            );
                            toast.success("Usuario eliminado con éxito");
                        } catch (error) {
                            console.error(
                                "Error al eliminar el usuario:",
                                error,
                            );
                            toast.error("Error al eliminar el usuario.");
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
        return <div>Cargando usuarios...</div>;
    }

    return (
        <div className={styles.userManagementContainer}>
            <h1 className={styles.userManagementHeader}>Gestión de Usuarios</h1>

            <div className={styles.userActionsContainer}>
                <button
                    onClick={() => {
                        setModalMode("add");
                        resetNewUser();
                        setShowModal(true);
                    }}
                    className={styles.addButton}
                >
                    <MdAdd size={20} />
                    Añadir Usuario
                </button>
                <button
                    onClick={() => router.push("users/roles")}
                    className={styles.manageRolesButton}
                >
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
                        {users.length > 0 ? (
                            users.map((user) => (
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
                                                className={
                                                    styles.userEditButton
                                                }
                                            >
                                                <MdEdit size={16} />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                                className={
                                                    styles.userDeleteButton
                                                }
                                            >
                                                <MdDelete size={16} />
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>No hay usuarios disponibles</td>
                            </tr>
                        )}
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
                                placeholder="Ingrese el nombre del usuario"
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
                                placeholder="Ingrese el correo electrónico"
                            />
                        </div>
                        <div className={styles.userFormGroup}>
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="phone"
                                value={newUser.phone}
                                onChange={handleInputChange}
                                className={styles.userFormInput}
                                placeholder="Ingrese el número de teléfono"
                            />
                        </div>
                        <div className={styles.userFormGroup}>
                            <label>Rol</label>
                            <select
                                name="rol"
                                value={newUser.rol}
                                onChange={handleSelectChange}
                                className={styles.userFormInput}
                            >
                                <option value="">Seleccionar rol</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                {/* Agrega más opciones si es necesario */}
                            </select>
                        </div>
                        <div className={styles.userFormGroup}>
                            <label>Estación</label>
                            <input
                                type="text"
                                name="estacion"
                                value={newUser.estacion}
                                onChange={handleInputChange}
                                className={styles.userFormInput}
                                placeholder="Ingrese la estación"
                            />
                        </div>
                        <div className={styles.userFormGroup}>
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={newUser.password}
                                onChange={handleInputChange}
                                className={styles.userFormInput}
                                placeholder="Ingrese la contraseña"
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                onClick={handleSubmit}
                                className={styles.submitButton}
                            >
                                {modalMode === "add" ? "Añadir" : "Actualizar"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetNewUser();
                                    setSelectedUser(null);
                                }}
                                className={styles.cancelButton}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default UsersView;
