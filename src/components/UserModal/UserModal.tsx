import React, { useEffect, useState } from 'react';
import styles from './UserModal.module.css';
import { User, UserCreate } from '@/entities/User';
import { Role } from '@/entities/Role';
import { RoleApi } from "@/data/api/RoleApi";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser?: User | null;
  onSave: (user: User) => void;
  userForm: UserCreate;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, editingUser, onSave, userForm }) => {
  if (!isOpen) return null;

  const [roles, setRoles] = useState<Role[]>([]);
  const [formState, setFormState] = useState<UserCreate>({
    name: userForm.name || '',
    email: userForm.email || '',
    phone: userForm.phone || '',
    rol: userForm.rol || '',
    estacion: userForm.estacion || '',
    password: userForm.password || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormState({
      name: userForm.name || '',
      email: userForm.email || '',
      phone: userForm.phone || '',
      rol: userForm.rol || '',
      estacion: userForm.estacion || '',
      password: userForm.password || '',
    });

    const fetchRoles = async () => {
      try {
        const fetchedRoles = await RoleApi.fetchRoles(); 
        setRoles(fetchedRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, [userForm]);

  const handleChange = (field: keyof UserCreate) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [field]: e.target.value });
    setErrors({ ...errors, [field]: '' });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formState.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formState.email.trim()) newErrors.email = 'El correo es obligatorio';
    if (!formState.password.trim()) newErrors.password = 'La contraseña es obligatoria';
    if (!formState.rol.trim()) newErrors.rol = 'El rol es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userToSave: User = {
      id: editingUser ? editingUser.id : generateUniqueId(),
      ...formState,
    };
    onSave(userToSave);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{editingUser ? "Editar Usuario" : "Agregar Usuario"}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.userFormGroup}>
            <label>Nombre</label>
            <input
              type="text"
              value={formState.name}
              onChange={handleChange('name')}
              className={`${styles.userFormInput} ${errors.name ? styles.error : ''}`}
            />
            {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
          </div>
          <div className={styles.userFormGroup}>
            <label>{editingUser ? "Cambiar Contraseña" : "Contraseña"}</label>
            <input
              type="text"
              value={formState.password}
              onChange={handleChange('password')}
              className={`${styles.userFormInput} ${errors.password ? styles.error : ''}`}
            />
            {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
          </div>
          <div className={styles.userFormGroup}>
            <label>Email</label>
            <input
              type="email"
              value={formState.email}
              onChange={handleChange('email')}
              className={`${styles.userFormInput} ${errors.email ? styles.error : ''}`}
            />
            {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
          </div>
          <div className={styles.userFormGroup}>
            <label>Teléfono</label>
            <input
              type="text"
              value={formState.phone}
              onChange={handleChange('phone')}
              className={styles.userFormInput}
            />
          </div>
          <div className={styles.selectedRole}>
            <label>Rol</label>
            <select
              value={formState.rol}
              onChange={handleChange('rol')}
              className={`${styles.userFormInput} ${errors.rol ? styles.error : ''}`}
            >
              <option value="" disabled>Seleccionar rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.rol}>
                  {role.rol}
                </option>
              ))}
            </select>
            {errors.rol && <div className={styles.errorMessage}>{errors.rol}</div>}
          </div>
          <div className={styles.userFormGroup}>
            <label>Estación</label>
            <input
              type="text"
              value={formState.estacion}
              onChange={handleChange('estacion')}
              className={styles.userFormInput}
            />
          </div>
          <div className={styles.modalActions}>
            <button className={styles.cancelButton} onClick={onClose}>Cancelar</button>
            <button className={styles.submitButton} type="submit">
              {editingUser ? "Guardar Cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;

function generateUniqueId(): number {
  return Math.floor(Math.random() * 1000000);
}
