import React, { useEffect, useState } from "react";
import { User, UserCreate } from "@/entities/User";
import styles from "@/components/UserModal/UserModal.module.css";
import { IoCloseCircleOutline } from "react-icons/io5";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userForm: UserCreate;
    onSave: (user: UserCreate) => Promise<void>;
    editingUser: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, userForm, onSave, editingUser }) => {
    const [formState, setFormState] = useState<UserCreate>({
        ...userForm,
        password: editingUser ? "" : userForm.password // Inicializa la contraseña como vacía si está editando
    });

    useEffect(() => {
        setFormState({
            ...userForm,
            password: "" // Siempre resetea la contraseña a vacía al abrir el modal
        });
    }, [userForm, editingUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Asegúrate de que la contraseña esté presente como string vacío si no hay valor
        const userToSave = {
            ...formState,
            password: formState.password || "", 
        };

        await onSave(userToSave); // Envía el objeto
    };

    return (
        isOpen ? (
            <div className={styles.modal}>
                <button type="button" className={styles.cancelButton} onClick={onClose}><IoCloseCircleOutline /></button>
                <div className={styles.modalContent}>
                    <span className={styles.close} onClick={onClose}>&times;</span>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <input className={styles.input} type="text" name="name" value={formState.name} onChange={handleChange} placeholder="Nombre" required />
                        <input className={styles.input} type="email" name="email" value={formState.email} onChange={handleChange} placeholder="Email" required />
                        <input className={styles.input} type="text" name="phone" value={formState.phone} onChange={handleChange} placeholder="Teléfono" required />
                        <input className={styles.input} type="text" name="rol" value={formState.rol} onChange={handleChange} placeholder="Rol" required />
                        <input className={styles.input} type="text" name="estacion" value={formState.estacion} onChange={handleChange} placeholder="Estación" required />
                        {/* Mostrar el campo de contraseña si no se está editando un usuario */}
                        {!editingUser && (
                            <div>
                                <input className={styles.input} type="password" name="password" value={formState.password} onChange={handleChange} placeholder="Contraseña (obligatoria)" required />
                            </div>
                        )}
                        {editingUser && (
                            <div>
                                <input className={styles.input} type="password" name="password" value={formState.password} onChange={handleChange} placeholder="Nueva Contraseña (opcional)" />
                            </div>
                        )}
                        <div className={styles.buttonGroup}>
                            <button className={styles.button} type="submit">{editingUser ? "Actualizar" : "Crear"} Usuario</button>
                        </div>
                    </form>
                </div>
            </div>
        ) : null
    );
};

export default UserModal;
