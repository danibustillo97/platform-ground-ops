

export const authUser = async (username: string, password: string) => {
    try {
        const response = await fetch("https://5bb3-20-246-93-146.ngrok-free.app/api/login/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password}), 

        });

        if(!response.ok){
            throw new Error("Error en la autenticación");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error en el servidor",error);       
    }
}