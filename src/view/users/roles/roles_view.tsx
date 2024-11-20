"use client";
import React, { useState, useEffect } from "react";
import { Role } from "@/entities/Role";
import { RoleRepositoryImpl } from "@/data/repositories/RoleRepositoryImpl";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import ModalForm from "@/components/FormsModals/ModalForm";

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
          roles.map((role) => (role.id === updatedRole.id ? updatedRole : role))
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
    <Grid container spacing={1} justifyContent="center">
      <Grid item>
        <IconButton
          color="primary"
          onClick={() => openEditModal(rowData)}
          aria-label="edit"
        >
          <FaEdit />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          color="error"
          onClick={() => openDeleteModal(rowData.id)}
          aria-label="delete"
        >
          <MdDeleteSweep />
        </IconButton>
      </Grid>
    </Grid>
  );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Gestión de Roles
      </Typography>
      <Paper elevation={4} style={{ padding: "20px", marginBottom: "20px" }}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<IoIosAddCircleOutline />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Añadir Rol
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        elevation={3}
        style={{
          padding: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container spacing={2}>
          {roles.length > 0 ? (
            roles.map((role) => (
              <Grid item xs={12} md={6} key={role.id}>
                <Paper
                  elevation={2}
                  style={{ padding: "15px", backgroundColor: "#f9f9f9" }}
                >
                  <Typography variant="h6">{role.rol}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {role.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Usuarios Asignados: {role.cant_user_asigned}
                  </Typography>
                  <div style={{ marginTop: "10px" }}>
                    {actionsBodyTemplate(role)}
                  </div>
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              No hay roles disponibles.
            </Typography>
          )}
        </Grid>
      </Paper>

      {/* Modal para agregar rol */}
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddRole}
      />

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
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este rol?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteModalOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteRole} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RolesView;
