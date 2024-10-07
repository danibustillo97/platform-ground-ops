import { Role } from "../entities/Role";

export interface RoleRepository {
    getRoles(): Promise<Role[]>;
    addRole(role: Role): Promise<Role>;
    editRole(role: Role): Promise<Role>;
    deleteRole(id: number): Promise<void>;
}
