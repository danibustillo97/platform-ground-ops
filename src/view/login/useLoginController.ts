import { authUser } from "@/data/api/AuthApi";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const useLoginController = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
      });
    const [errors, setErrors] = useState <{ username?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

    
    const validateForm = () => {
        const form_errors = {...errors};
        if(!formData.username) {form_errors.username = 'El usuario es obligatorio';}
        if(!formData.password) {form_errors.password = 'La contraseña es obligatoria';}

        setErrors(form_errors);

        return form_errors;
    };


    const handleChange = (e: any) => {
        console.log("Valores en cambio", formData);
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
    

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        console.log("Usuario y contraseña", formData);
        const checkFields = validateForm();
        if (Object.keys(checkFields).length > 0) return;
    
        try {
            const response = await authUser(formData.username, formData.password);
    
            if (response.success && response.data.access_token && response.data.tokenType) {
                const accessToken = response.data.access_token;
                const tokenType = response.data.tokenType;
                const expirationTime = new Date().getTime() + 1800000;
    
                sessionStorage.setItem('access_token', accessToken);
                sessionStorage.setItem('token_type', tokenType);
                sessionStorage.setItem('expiration_time', expirationTime.toString());
    
                const router = useRouter();
                router.push('/dashboard');
    
                window.location.href = '/dashboard';
                console.log("Login:", response.data);
            } else {
                const newErrors: { username?: string; password?: string } = {};
    
                response.errors.forEach((error: any) => {
                    if (error.loc && error.loc.length > 1) {
                        const field = error.loc[1]; 
                        if (field === 'username') {
                            newErrors.username = error.msg; 
                        } else if (field === 'password') {
                            newErrors.password = error.msg; 
                        }
                    }
                });
    
                setErrors(newErrors); 
                console.error('Error de login:', response.errors);
            }
        } catch (error) {
            setErrors({ password: "Error en el servidor. Inténtalo más tarde" });
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