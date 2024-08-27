// src/domain/repositories/AuthRepository.ts
import { UserInfo } from "@/domain/entities/User";

export interface AuthRepository {
    authenticateUser(email: string, password: string): Promise<UserInfo>;
    logoutUser(): Promise<void>;
}