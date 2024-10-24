import { BaggageCase } from "@/types/BaggageCase";

const apiURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchPassengerDataAPI = async (pnr: string, token: string) => {
    try {
        const response = await fetch(
            `${apiURL}/api/manifest/${pnr}`,
            {
                method: "GET",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,  
                },
            }
        );
        if (!response.ok) {
            throw new Error(`Error fetching data, status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching passenger data", error);
        throw error;
    }
};

export const createBaggageCasesAPI = async (baggageCases: any[], token: string) => {
    try {
        const response = await fetch(
            `${apiURL}/api/baggage-case/`,
            {
                method: "POST",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,  
                },
                body: JSON.stringify(baggageCases),
            }
            
        );
        if (!response.ok) {
            throw new Error(`Error creating baggage cases, status: ${response.status}`);
        }
        const data = await response.json();
        console.log("caso creado:", response );
        return data;
    } catch (error) {
        console.error("Error creating baggage cases", error);
        throw error;
    }
};

export const getBaggageCasesApi = async (token: string) => {
    try {
        const response = await fetch(
            `${apiURL}/api/baggage-case/`,
            {
                method: "GET",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,  
                },
            }
        );
        if (response.ok) {
            const data = await response.json();
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
                    Authorization: `Bearer ${token}`,  
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
