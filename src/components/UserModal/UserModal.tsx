import React, { useEffect, useState } from "react";
import { User, UserCreate } from "@/entities/User";
import styles from "@/components/UserModal/UserModal.module.css";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userForm: UserCreate;
    onSave: (user: UserCreate) => Promise<void>; // Cambiado a UserCreate
    editingUser: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, userForm, onSave, editingUser }) => {
    const [formState, setFormState] = useState<UserCreate>(userForm);

    useEffect(() => {
        setFormState(userForm);
    }, [userForm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formState);
    };

    return (
        isOpen ? (
            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <span className={styles.close} onClick={onClose}>&times;</span>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="name" value={formState.name} onChange={handleChange} placeholder="Nombre" required />
                        <input type="email" name="email" value={formState.email} onChange={handleChange} placeholder="Email" required />
                        <input type="text" name="phone" value={formState.phone} onChange={handleChange} placeholder="Teléfono" required />
                        <input type="text" name="rol" value={formState.rol} onChange={handleChange} placeholder="Rol" required />
                        <input type="text" name="estacion" value={formState.estacion} onChange={handleChange} placeholder="Estación" required />
                        <input type="password" name="password" value={formState.password} onChange={handleChange} placeholder="Contraseña" required={editingUser === null} />
                        <button type="submit">{editingUser ? "Actualizar" : "Crear"} Usuario</button>
                    </form>
                </div>
            </div>
        ) : null
    );
};

export default UserModal;
