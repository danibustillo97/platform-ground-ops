import { BaggageCase } from "@/domain/types/BaggageCase";

// data/api/baggageAPI.ts
const apiURL = process.env.NEXT_PUBLIC_API_URL;
export const fetchPassengerDataAPI = async (pnr: string) => {
    try {
        const response = await fetch(
            `${apiURL}/api/manifest/${pnr}`,
            {
                method: "GET",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
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

export const createBaggageCasesAPI = async (baggageCases: any[]) => {
    try {
        const response = await fetch(
            `${apiURL}/api/baggage-case/`,
            {
                method: "POST",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(baggageCases),
            }
        );

        if (!response.ok) {
            throw new Error(`Error creating baggage cases, status: ${response.status}`);
        }

        const data = await response.json();
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
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log("Datos recibidos de la API:", data);
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

export const putBaggageCasesAPI = async (id_passenger: any, baggageCases: any) => {
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
            console.log("Datos recibidos de la API:", data);
            return data;
        } else {
            const errorDetails = await response.json();
            console.error("Detalles del error:", errorDetails);
            throw new Error(`Error updating baggage cases, status: ${response.status}, message: ${errorDetails.message}`);
        }
    } catch (error) {
        console.error("Error en la solicitud PUT:", error);
        throw error;
    }
};