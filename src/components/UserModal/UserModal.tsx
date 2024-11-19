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
        password: editingUser ? "" : userForm.password, // Inicializa la contraseña como vacía si está editando
    });

    useEffect(() => {
        setFormState({
            ...userForm,
            password: "", // Siempre resetea la contraseña a vacía al abrir el modal
        });
    }, [userForm, editingUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (e.target instanceof HTMLSelectElement) {
            // Verificamos si el evento proviene de un select múltiple (roles o estaciones)
            const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);

            setFormState(prevState => ({
                ...prevState,
                [name]: selectedValues,
            }));
        } else {
            setFormState(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userToSave = {
            ...formState,
            password: formState.password || "", // Asegura que la contraseña esté presente como string vacío si no hay valor
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
                        <select className={styles.input} name="rol" multiple value={formState.rol} onChange={handleChange} required>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                            <option value="Guest">Guest</option>
                        </select>
                        <select className={styles.input} name="estacion" multiple value={formState.estacion} onChange={handleChange} required>
                            <option value="Estacion1">Estación 1</option>
                            <option value="Estacion2">Estación 2</option>
                            <option value="Estacion3">Estación 3</option>
                        </select>
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
