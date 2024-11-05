"use client";

import React, { useState, useEffect } from "react";
import { fetchAllUsers, deleteUserById, createNewUser, updateExistingUser } from "@/view/users/userController";
import { User, UserCreate } from "@/entities/User";
import styles from "@/view/users/users.module.css";
import UserModal from "@/components/UserModal/UserModal";
import OverlayComponent from "@/components/Overlay/Overlay";
import { FaPlus } from "react-icons/fa";
import { AiOutlineUserDelete } from "react-icons/ai";
import { LiaUserEditSolid } from "react-icons/lia";
import { MdOutlineDeleteSweep } from "react-icons/md";

const UsersView: React.FC = () => {
    const [usersData, setUsersData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
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

    const handleSaveUser = async (user: UserCreate) => {
        try {
            const userToSave: User = {
                id: editingUser ? editingUser.id : Math.floor(Math.random() * 1000000),
                ...user,
            };

            if (editingUser) {
                await updateExistingUser(editingUser.id, userToSave);
            } else {
                await createNewUser(userToSave);
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
            fetchUsers();
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
        }
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setUserForm({
            name: user.name,
            email: user.email,
            phone: user.phone,
            rol: user.rol,
            estacion: user.estacion,
            password: '',
        });
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

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const filteredUsers = usersData.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        loading ? <OverlayComponent /> : (
            <div className={styles.userManagementContainer}>
                <h1 className={styles.userManagementHeader}>Gestión de Usuarios</h1>
                <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className={styles.userCardsContainer}>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user.id} className={styles.cardProfile}>
                                <div className={styles.cardHeader}>
                                    <img className={styles.cardProfileImg} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5KZ8Ilz6ha_pUItL6KtOFXB1TVC3vVYtCfA&s" alt={user.name} />
                                </div>
                                <div className={styles.cardBody}>
                                    <h3>{user.name}</h3>
                                    <div className={styles.cardBodyDataPerson}>
                                        <p><small>EMAIL:</small> {user.email}</p>
                                        <p><small>PHONE:</small> {user.phone}</p>
                                        <p><small>ROL:</small> {user.rol}</p>
                                        <p><small>ESTACION:</small> {user.estacion}</p>
                                    </div>
                                    <div className={styles.cardButtons}>
                                        <button className={styles.editButton} onClick={() => handleEditUser(user)}>
                                            <LiaUserEditSolid /> Editar
                                        </button>
                                        <button className={styles.deleteButton} onClick={() => handleDelete(user.id)}>
                                        <MdOutlineDeleteSweep />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
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
                <button className={styles.floatingAddButton} onClick={handleAddUser}>
                    <FaPlus />
                </button>
            </div>
        )
    );
};

export default UsersView;
