import { User } from '../entities/User';

export interface AuthUseCases {
    login(user: User): Promise<void>;
}
