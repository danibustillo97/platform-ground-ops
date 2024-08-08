import { AuthAPI } from '../api/AuthAPI';

export class AuthService {
    private authAPI: AuthAPI;

    constructor(authAPI: AuthAPI) {
        this.authAPI = authAPI;
    }

    async login(username: string, password: string): Promise<void> {
        await this.authAPI.login({ username, password });
    }
}
