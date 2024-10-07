// src/domain/repositories/AuthRepository.ts
import { UserInfo } from "@/domain/entities/User";

export interface AuthRepository {
    authenticateUser(username: string, password: string): Promise<UserInfo>;
    logoutUser(): Promise<void>;
}