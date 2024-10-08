import axios from "axios";
import { Role } from "@/entities/Role";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roles/`;

export const RoleApi = {
    async fetchRoles(): Promise<Role[]> {
        const response = await axios.get<Role[]>(API_URL, {
            headers: { "ngrok-skip-browser-warning": "true" },
        });
        return response.data;
    },

    async addRole(role: Role): Promise<Role> {
        const response = await axios.post<Role>(API_URL, role, {
            headers: { "ngrok-skip-browser-warning": "true" },
        });
        return response.data;
    },

    async editRole(role: Role): Promise<Role> {
        const response = await axios.put<Role>(`${API_URL}${role.id}/`, role, {
            headers: { "ngrok-skip-browser-warning": "true" },
        });
        return response.data;
    },

    async deleteRole(id: number): Promise<void> {
        await axios.delete(`${API_URL}${id}/`, {
            headers: { "ngrok-skip-browser-warning": "true" },
        });
    },
};
