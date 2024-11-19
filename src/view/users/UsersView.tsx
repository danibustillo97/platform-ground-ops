"use client";

import React, { useState, useEffect } from "react";
import { fetchAllUsers, deleteUserById, createNewUser, updateExistingUser } from "@/view/users/userController";
import { User, UserCreate } from "@/entities/User";
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    Avatar,
    Grid,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Tooltip,
} from "@mui/material";
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
            password: "",
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

    const filteredUsers = usersData.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Gestión de Usuarios
            </Typography>
            <TextField
                label="Buscar usuarios..."
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 3 }}
            />
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <Grid item xs={12} sm={6} md={4} key={user.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                                            <Avatar
                                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5KZ8Ilz6ha_pUItL6KtOFXB1TVC3vVYtCfA&s"
                                                alt={user.name}
                                                sx={{ width: 56, height: 56, marginRight: 2 }}
                                            />
                                            <Typography variant="h6">{user.name}</Typography>
                                        </Box>
                                        <Typography variant="body2">
                                            <strong>Email:</strong> {user.email}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Teléfono:</strong> {user.phone}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Rol:</strong> {user.rol}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Estación:</strong> {user.estacion}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Tooltip title="Editar">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                <LiaUserEditSolid />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <MdOutlineDeleteSweep />
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography>No se encontraron usuarios.</Typography>
                    )}
                </Grid>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddUser}
                startIcon={<FaPlus />}
                sx={{ position: "fixed", bottom: 16, right: 16 }}
            >
                Añadir Usuario
            </Button>
            <Dialog open={showModal} onClose={handleCloseModal} fullWidth>
                <DialogTitle>{editingUser ? "Editar Usuario" : "Añadir Usuario"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nombre"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    />
                    <TextField
                        label="Teléfono"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    />
                    <TextField
                        label="Rol"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={userForm.rol}
                        onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}
                    />
                    <TextField
                        label="Estación"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={userForm.estacion}
                        onChange={(e) => setUserForm({ ...userForm, estacion: e.target.value })}
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={() => handleSaveUser(userForm)} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersView;
