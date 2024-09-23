export const authUser = async (username: string, password: string | number) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const formBody = new URLSearchParams(); 
        formBody.append("username", username.toString());
        formBody.append("password", password.toString());

        const response = await fetch(`${apiUrl}/api/login/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded", 
            },
            body: formBody.toString(),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                errors: data.detail || [{ msg: "Error en la autenticación" }]
            };
        }

        return {
            success: true,
            data,
        };

    } catch (error) {
        console.log("Error en el servidor", error);
        return {
            success: false,
            errors: [{ msg: "Error en el servidor. Inténtalo más tarde" }]
        };
    }
};