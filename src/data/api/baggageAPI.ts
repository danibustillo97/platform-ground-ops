import { BaggageCase } from "@/types/BaggageCase";

// const apiURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const apiURL = "http://localhost:8000";

export const fetchPassengerDataAPI = async (pnr: string) => {
    try {
        const response = await fetch(
            `${apiURL}/api/manifest/${pnr}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error(`Error fetching data, status: ${response.status}`);
        }
        console.log(response)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching passenger data", error);
        throw error;
    }
};

export const createBaggageCasesAPI = async (baggageCases: any[]) => {
    try {
        const response = await fetch(
            `${apiURL}/api/baggage-case/`,
            {
                method: "POST",
                headers: {
                    // "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`,  
                },
                body: JSON.stringify(baggageCases),
            }
        );

        if (!response.ok) {
            if (response.status === 400) {
                const errorData = await response.json();
                console.error("Error 400: El caso ya existe.", errorData.detail);
                throw new Error(`Error 400: ${errorData.detail}`);
            } else {
                throw new Error(`Error creating baggage cases, status: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log("Caso creado:", data);
        return data;

    } catch (error) {
        console.error("Error creating baggage cases", error);
        throw error;
    }
};


export const getBaggageCasesApi = async () => {
    try {
        const response = await fetch(
            `${apiURL}/api/baggage-case/`,
            {
                method: "GET",
                headers: {
                    // "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`,  
                },
            }
        );
        if (response.ok) {
            const data = await response.json();
            console.log("Respuesta completa desde la API:", response); 
            console.log("Datos procesados desde la API:", JSON.stringify(data, null, 2)); 
            return data;
        } else {
            console.error("Error fetching data:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error fetching baggage cases:", error);
        return [];
    }
};

export const putBaggageCasesAPI = async (id_passenger: any, baggageCases: any, token: string) => {
    try {
        const response = await fetch(
            `${apiURL}/api/baggage-case/${id_passenger}`,
            {
                method: "PUT",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
         
                },
                body: JSON.stringify(baggageCases),
            },
        );
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorDetails = await response.json();
            throw new Error(`Error updating baggage cases, status: ${response.status}, message: ${errorDetails.message}`);
        }
    } catch (error) {
        console.error("Error en la solicitud PUT:", error);
        throw error;
    }
};


export const deleteBaggageCasesAPI = async (ids: string[], token: string) => {
    try {
        const response = await fetch(
            `${apiURL}/api/baggage-case/`, 
            {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ids), 
            }
        );

        if (!response.ok) {
            throw new Error(`Error deleting baggage cases, status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error deleting baggage cases", error);
        throw error;
    }
};
