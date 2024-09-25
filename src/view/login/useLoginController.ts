import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

const useLoginController = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
      });
    const [errors, setErrors] = useState <{ username?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

    
    const validateForm = () => {
        const form_errors = {} as { username?: string; password?: string };
        if(!formData.username) {form_errors.username = 'El usuario es obligatorio';}
        if(!formData.password) {form_errors.password = 'La contraseña es obligatoria';}

        setErrors(form_errors);

        return form_errors;
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log("Valores en cambio", formData);
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
    

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const checkFields = validateForm();
        if (Object.keys(checkFields).length > 0) return;

        setLoading(true);
        
        try {
            const res = await signIn('credentials', {
                redirect: false,
                username: formData.username,
                password: formData.password,
            });

            if(res?.error){
                const new_error: { username?: string; password?: string } = {};
                new_error.username = res.error.includes('username') ? 'El usuario es incorrecto' : undefined;
                new_error.password = res.error.includes('password') ? 'La contraseña es incorrecto' : undefined;
                setErrors(new_error);
                console.log('Error de login:', res.error)
            } else {
                console.log(router.push('/dashboard'));
                router.push('/dashboard');
            }
        } catch (error) {
            setErrors({password: 'Error en la autenticación'});
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
    }
}

export default useLoginController;