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
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
        console.log(formData);
      };
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        
        const checkFields = validateForm();
        if(Object.keys(checkFields).length > 0) return;
        
        //Login 

        try {
          const response = await authUser(formData.username, formData.password);
          const data = await response.json();
  
          if (response.ok && data.access_token && data.tokenType) {
              const accessToken = data.access_token;
              const tokenType = data.tokenType;
              const expirationTime = new Date().getTime() + 1800000;

              sessionStorage.setItem('access_token', accessToken);
              sessionStorage.setItem('token_type', tokenType);
              sessionStorage.setItem('expiration_time', expirationTime.toString());

              const router = useRouter();
              router.push('/dashboard');

              window.location.href = '/dashboard';
              console.log("Login:", data);

          } else {
              console.error('Error de login:', data.message || 'Error desconocido');
              setErrors({ password: "Usuario o contraseña incorrectos" });
          }
      } catch (error) {
          setErrors({ password: "Error en el servidor. Inténtalo más tarde" });
      }

    }

    return {
        formData,
        errors,
        loading,
        handleChange,
        handleSubmit,
    }
}

export default useLoginController;