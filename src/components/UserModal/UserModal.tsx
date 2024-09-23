import React, { useEffect, useState } from 'react';
import styles from './UserModal.module.css';
import { User } from '@/domain/entities/User';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingUser?: User | null;
    onSave: (user: User) => void;
    userForm: User;

}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, editingUser, onSave, userForm}: any) => {
    if(!isOpen) return null;
    const [formState, setFormState] = useState<User>({
        id: userForm.id || '',
        name: userForm.name || '',
        email: userForm.email || '',
        phone: userForm.phone || '',
        rol: userForm.rol || '',
        estacion: userForm.estacion || '',
        password: userForm.password || '', 
    });

    useEffect(() => {
        setFormState({
            id: userForm.id || '',
            name: userForm.name || '',
            email: userForm.email || '',
            phone: userForm.phone || '',
            rol: userForm.rol || '',
            estacion: userForm.estacion || '',
            password: userForm.password || '',
        });
    }, [userForm]);
    
    const handleChange = (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormState({ ...formState, [field]: e.target.value });
      
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
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
                            className={styles.userFormInput}                        />
                    </div>
                    <div className={styles.userFormGroup}>
                        <label>{editingUser ? "Cambiar Contraseña" : "Contraseña"}</label>
                        <input
                            type="text"
                            value={formState.password}
                            onChange={handleChange('password')}
                            className={styles.userFormInput}
                        />
                    </div>
                    <div className={styles.userFormGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={formState.email}
                            onChange={handleChange('email')}
                            className={styles.userFormInput}
                        />
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
                    <div className={styles.userFormGroup}>
                        <label>Rol</label>
                        <input
                            type="text"
                            value={formState.rol}
                            onChange={handleChange('rol')}
                            className={styles.userFormInput}
                        />
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
