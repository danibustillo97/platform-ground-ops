export class AuthAPI {
    async login(user: { username: string; password: string }): Promise<void> {
        // Lógica para hacer la llamada a la API
        await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
    }
}
