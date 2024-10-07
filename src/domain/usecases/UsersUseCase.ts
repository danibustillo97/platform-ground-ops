// src/domain/usecases/UserUseCases.ts
// import { User, UserCreate } from "@/domain/entities/User";
// import { UserRepository } from "@/domain/repositories/UserRepository";

// export class UserUseCases {
//     constructor(private userRepository: UserRepository) { }


//     async getUsers(): Promise<User[]> {
//         return await this.userRepository.getUsers();
//     }

//     async createUser(user: UserCreate): Promise<User> {
//         return await this.userRepository.createUser(user);
//     }


//     async updateUser(id: number, newUser: { name: string; email: string; phone: string; rol: string; estacion: string; password: string; }, user: User): Promise<User> {
//         return await this.userRepository.updateUser(user);
//     }

//     async deleteUser(userId: number): Promise<void> {
//         return await this.userRepository.deleteUser(userId);
//     }
// }
