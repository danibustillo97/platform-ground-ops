"use client";

import React, { useState, useEffect } from "react";
import { fetchAllUsers, deleteUserById, createNewUser, updateExistingUser } from "@/view/users/userController";
import { User, UserCreate } from "@/entities/User";
import styles from "@/view/users/users.module.css";
import { useRouter } from "next/navigation";
import UserModal from "@/components/UserModal/UserModal";
import OverlayComponent from "@/components/Overlay/Overlay";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPlus } from "react-icons/fa";
import { AiOutlineUserDelete } from "react-icons/ai";
import { LiaUserEditSolid } from "react-icons/lia";

// Función para generar un ID único (ejemplo simple)
const generateUniqueId = (): number => {
    return Math.floor(Math.random() * 1000000); // Simple implementación
};

const UsersView: React.FC = () => {
    const router = useRouter();
    const [usersData, setUsersData] = useState<User[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userForm, setUserForm] = useState<UserCreate>({
        name: "",
        email: "",
        phone: "",
        rol: "",
        estacion: "",
        password: "",
    });


   const  updatedate = new Date();

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
                id: editingUser ? editingUser.id : generateUniqueId(),
                ...user,
                updatedAt: updatedate.toString(), // Asegúrate de incluir updatedAt
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
        const userCreate: UserCreate = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            rol: user.rol,
            estacion: user.estacion,
            password: '', // No mostrar la contraseña
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

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const filteredUsers = usersData?.filter(user =>
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
                <div className={`container-fluid${styles.userCardsContainer}`}>
                    {filteredUsers && filteredUsers.length > 0 ? (
                        <div className="row">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="col-md-4 mb-4">
                                    <div className={`card  mb-4${styles.cardProfile}`}>
                                        <div className={`${styles.cardHeader}`} style={{ backgroundImage: `url('https://elnacional.com.do/wp-content/uploads/2023/05/arajet.jpg')` }}>
                                        </div>
                                        <div className="card-body text-center">
                                            <img className={`${styles.cardProfileImg}`} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5KZ8Ilz6ha_pUItL6KtOFXB1TVC3vVYtCfA&s" alt={user.name} />
                                            <h3 className="mb-3">{user.name}</h3>
                                            <p className="mb-4">{user.rol}</p>
                                            <div className="container justify-content-between">
                                                <div className="row">
                                                    <div className="col-md-6 flex-end">
                                                        <button className="btn btn-outline-dark btn-sm" onClick={() => handleEditUser(user)}>
                                                            <span className="fab fa-twitter"></span> <LiaUserEditSolid /> Edit
                                                        </button>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                                                            <AiOutlineUserDelete /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))} 
                        </div>
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
                <button
                    className={styles.floatingAddButton}
                    onClick={handleAddUser}
                >
                    <FaPlus />
                </button>
            </div>
        )
    );
};

export default UsersView;
