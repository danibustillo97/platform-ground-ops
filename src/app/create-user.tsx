"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

const CreateUserPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [role, setRole] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setEmail(params.get("email"));
        setName(params.get("name"));
    }, []);

    const handleCreateUser = async () => {
        try {
            await axios.post("https://tu-api.com/crear-usuario", {
                email,
                name,
                role,
            });

            router.push("/dashboard");
        } catch (error) {
            console.error("Error creating user", error);
        }
    };

    if (!email || !name) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1>Crear Usuario</h1>
            <p>Email: {email}</p>
            <p>Nombre: {name}</p>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Selecciona un rol</option>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
                {/* Agrega más roles según tu necesidad */}
            </select>
            <button onClick={handleCreateUser}>Crear Usuario</button>
        </div>
    );
};

export default CreateUserPage;
