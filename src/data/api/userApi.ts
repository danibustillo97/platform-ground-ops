// Obtener todos los usuarios
const apiUrl = process.env.NEXT_PUBLIC_API_URL
export const getUsers = async () => {
    try {
        const response = await fetch(`${apiUrl}/api/users`, {
            method: "GET",
            headers: {
                // "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener los usuarios");
        }

        const res = await response.json();
        console.log(res);
        return res;

    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Crear un nuevo usuario
export const createUser = async (user: { name: string; email: string }) => {
    try {
        const response = await fetch(`${apiUrl}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error("Error al crear el usuario");
        }
        return await response.json();
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Editar un usuario
export const updateUser = async (id: number, updatedData: { name?: string; email?: string }) => {
    try {
        const response = await fetch(`${apiUrl}/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el usuario");
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

// Eliminar un usuario
export const deleteUser = async (id: number) => {
    try {
        const response = await fetch(`${apiUrl}/api/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el usuario");
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
