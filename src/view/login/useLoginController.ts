import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

const useLoginController = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const formErrors: { username?: string; password?: string } = {};
        if (!formData.username) formErrors.username = 'El usuario es obligatorio';
        if (!formData.password) formErrors.password = 'La contraseña es obligatoria';
        setErrors(formErrors);
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
            const res = await signIn('credentials', {
                email: formData.username, 
                password: formData.password,
                redirect: false,
            });

            if (res?.error) {
                setErrors({ general: res.error });
                return;
            }

            router.push('/dashboard'); 

        } catch (error) {
            console.error(error);
            setErrors({ general: 'Ocurrió un error inesperado' });
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
