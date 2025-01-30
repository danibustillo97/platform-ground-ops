import { useRouter } from "next/navigation";
import { useState } from "react";

const useLoginController = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState<{ username?: string; password?: string; general: string | null }>({ general: null });
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const formErrors: { username?: string; password?: string } = {};
        if (!formData.username) formErrors.username = 'El usuario es obligatorio';
        if (!formData.password) formErrors.password = 'La contraseña es obligatoria';

        setErrors(prevErrors => ({
            ...prevErrors,
            general: null,
            ...formErrors,
        }));
        return formErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const checkFields = validateForm();
        if (Object.keys(checkFields).length > 0) return;

        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setErrors(prevErrors => ({
                    ...prevErrors,
                    general: errorData.detail || 'Error en la autenticación',
                }));
                return;
            }

            router.push('/baggage_gestion');

        } catch (error) {
            console.error(error);
            setErrors(prevErrors => ({
                ...prevErrors,
                general: 'Ocurrió un error inesperado',
            }));
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        errors,
        loading,
        handleChange,
        handleSubmit,
    };
};

export default useLoginController;
