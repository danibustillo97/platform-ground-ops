"use client";

import React, { useState, useEffect } from "react";
import {
    fetchAllUsers,
    deleteUserById,
    createNewUser,
    updateExistingUser,
} from "@/view/users/userController";
import { User, UserCreate } from "@/entities/User";
import styles from "@/view/users/users.module.css";
import { useRouter } from "next/navigation";
import UserModal from "@/components/UserModal/UserModal";


const UsersView: React.FC = () => {
    const router = useRouter();
    const [usersData, setUsersData] = useState<User[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userForm, setUserForm] = useState<UserCreate>({
        name: "",
        email: "",
        phone: "",
        rol: "",
        estacion: "",
        password: "",
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

    const handleSaveUser = async (user: User) => {
        try {
            if (editingUser) {
                await updateExistingUser(editingUser.id, user);
            } else {
                // const newUser: UserCreate = {
                //     name: user.name,
                //     email: user.email,
                //     phone: user.phone,
                //     rol: user.rol,
                //     estacion: user.estacion,
                // };
                await createNewUser(user);
            }
            setShowModal(false);
            setEditingUser(null);
            setUserForm({
                name: "",
                email: "",
                phone: "",
                rol: "",
                estacion: "",
                password: "",
            });
            fetchUsers(); // Solo llama a fetchUsers después de guardar.
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
        }
    };

    

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        const userCreate: UserCreate = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            rol: user.rol,
            estacion: user.estacion,
            password: '',
        };
        setUserForm(userCreate);
        setShowModal(true);
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setUserForm({
            name: "",
            email: "",
            phone: "",
            rol: "",
            estacion: "",
            password: "",
        });
        setShowModal(true);
    };

    const handleRedirect = () => {
        router.push('/users/roles');
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

                <button className={styles.addButton} onClick={handleRedirect}>
                    Roles
                </button>
            </div>
            <div className={styles.userTableContainer}>
                {usersData && usersData.length > 0 ? (
                    <table className={`table table-striped table-bordered caption-top ${styles.userTable}`}>
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
                <UserModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    userForm={userForm}
                    onSave={handleSaveUser}
                    editingUser={editingUser}
                />
            )}

            </div>
    );
};

export default UsersView;
