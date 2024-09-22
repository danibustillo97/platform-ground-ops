// Obtener todos los usuarios
export const getUsers = async () => {
    try {
        const response = await fetch("/api/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener los usuarios");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Crear un nuevo usuario
export const createUser = async (user: { name: string; email: string }) => {
    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
        const response = await fetch(`/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
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
        const response = await fetch(`/api/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
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
