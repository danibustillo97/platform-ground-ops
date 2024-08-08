import { RoleRepository } from "@/domain/repositories/RoleRepository";
import { Role } from "@/domain/entities/Role";
import { RoleApi } from "@/data/datasources/RoleApi";

export class RoleRepositoryImpl implements RoleRepository {
    async getRoles(): Promise<Role[]> {
        return await RoleApi.fetchRoles();
    }

    async addRole(role: Role): Promise<Role> {
        return await RoleApi.addRole(role);
    }

    async editRole(role: Role): Promise<Role> {
        return await RoleApi.editRole(role);
    }

    async deleteRole(id: number): Promise<void> {
        return await RoleApi.deleteRole(id);
    }
}
