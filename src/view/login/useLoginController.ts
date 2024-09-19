import { useState, useEffect } from "react";

const useLoginController = () => {
    const [user, setUser] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null >(null);
    const [loading, setLoading] = useState(false);

    
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Username :", e.target.value);  // Verifica el valor
        setUser(e.target.value);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Password :", e.target.value);  // Verifica el valor
        setPassword(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setError(null);

        //Login 
    }

    return {
        user,
        password,
        error,
        loading,
        handleUserChange,
        handlePasswordChange,
        handleSubmit,
    }
}

export default useLoginController;