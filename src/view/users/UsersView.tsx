"use client";

import React, { useState, useEffect } from "react";
import {
  fetchAllUsers,
  deleteUserById,
  createNewUser,
  updateExistingUser,
} from "@/view/users/userController";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { AiOutlineUserDelete } from "react-icons/ai";
import { LiaUserEditSolid } from "react-icons/lia";
import { MdOutlineDeleteSweep } from "react-icons/md";

const UsersView: React.FC = () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [assigningUser, setAssigningUser] = useState<User | null>(null);
  const [assignedStations, setAssignedStations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserCreate>({
    name: "",
    email: "",
    phone: "",
    rol: "",
    estacion: [],
    password: "",
  });

  const airportStations = [
    "SDQ",
    "CTG",
    "BOG",
    "MDE",
    "AUA",
    "CUR",
    "PUJ",
    "EZE",
    "YUL",
    "STI",
    "LIM",
    "YYZ",
    "KIN",
  ];

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

  const handleAssignStations = (user: User) => {
    setAssigningUser(user);
    setAssignedStations(Array.isArray(user.estacion) ? user.estacion : []);
  };

  const handleSaveStations = async () => {
    if (!assigningUser) return;

    try {
      const updatedUser = { ...assigningUser, estacion: assignedStations };
      await updateExistingUser(assigningUser.id, updatedUser);
      fetchUsers();
      setAssigningUser(null);
      setAssignedStations([]);
    } catch (error) {
      console.error("Error al asignar estaciones:", error);
    }
  };

  const handleCancelAssignStations = () => {
    setAssigningUser(null);
    setAssignedStations([]);
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
      resetUserForm();
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
      estacion: Array.isArray(user.estacion) ? user.estacion : [],
      password: "",
    });
    setShowModal(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    resetUserForm();
    setShowModal(true);
  };

  const resetUserForm = () => {
    setUserForm({
      name: "",
      email: "",
      phone: "",
      rol: "",
      estacion: [],
      password: "",
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleChangeEstacion = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setUserForm({
      ...userForm,
      estacion: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleAssignedStationsChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setAssignedStations(typeof value === "string" ? value.split(",") : value);
  };

  const filteredUsers = usersData.filter(
    (user) =>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <Avatar
                        src="https://via.placeholder.com/56"
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
                      <strong>Estaciones:</strong>{user.estacion ? user.estacion : "No asignada" }
                   
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
                    <Tooltip title="Asignar Estaciones">
                      <IconButton
                        color="secondary"
                        onClick={() => handleAssignStations(user)}
                      >
                        <FaPlus />
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

      {/* Modal de usuario */}
      <Dialog open={showModal} onClose={handleCloseModal} fullWidth>
        <DialogTitle>
          {editingUser ? "Editar Usuario" : "Añadir Usuario"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Correo"
            value={userForm.email}
            onChange={(e) =>
              setUserForm({ ...userForm, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Teléfono"
            value={userForm.phone}
            onChange={(e) =>
              setUserForm({ ...userForm, phone: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Estaciones</InputLabel>
            <Select
              multiple
              value={userForm.estacion}
              onChange={handleChangeEstacion}
              renderValue={(selected) => selected.join(", ")}
            >
              {airportStations.map((station) => (
                <MenuItem key={station} value={station}>
                  <Checkbox checked={userForm.estacion.includes(station)} />
                  <ListItemText primary={station} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="dense"
            label="Rol"
            value={userForm.rol}
            onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={() => handleSaveUser(userForm)}
            color="primary"
            variant="contained"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para asignar estaciones */}
      <Dialog
        open={!!assigningUser}
        onClose={handleCancelAssignStations}
        fullWidth
      >
        <DialogTitle>Asignar Estaciones</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Estaciones</InputLabel>
            <Select
              multiple
              value={assignedStations}
              onChange={handleAssignedStationsChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {airportStations.map((station) => (
                <MenuItem key={station} value={station}>
                  <Checkbox checked={assignedStations.includes(station)} />
                  <ListItemText primary={station} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAssignStations} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveStations}
            color="primary"
            variant="contained"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersView;
