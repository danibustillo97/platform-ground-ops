import { getUsers, createUser, updateUser, deleteUser } from "@/data/api/userApi";
import { User } from "@/entities/User";

export const fetchAllUsers = async (): Promise<User[]> => {
    try {
        const users = await getUsers();
        return users;
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        throw error;
    }
};

export const createNewUser = async (user: User): Promise<User> => {
    try {
        const newUser = await createUser(user);
        return newUser;
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        throw error;
    }
};

export const updateExistingUser = async (id: number, user: Partial<User>): Promise<User> => {
    try {
        const updatedUser = await updateUser(id, user);
        return updatedUser;
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        throw error;
    }
};

export const deleteUserById = async (id: number): Promise<void> => {
    try {
        await deleteUser(id);
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
    }
};
