// Obtener todos los usuarios
const Url = "https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net"
// const Url = "http://localhost:8000"


export const getUsers = async (limit = 100) => {
    // const response = await fetch(`http://localhost:8000/api/users/?limit=${limit}`,{ 
    const response = await fetch(`https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/users/?limit=${limit}`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching users:", errorText);
        throw new Error("Error al obtener los usuarios");
    }

    const res = await response.json();
    return res;
};


// Crear un nuevo usuario
export const createUser = async (user: { name: string; email: string }) => {
    try {
        const response = await fetch(`https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/users/`, {
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
        const response = await fetch(`https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/users/${id}`, {
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
        const response = await fetch(`https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/users/${id}`, {
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
