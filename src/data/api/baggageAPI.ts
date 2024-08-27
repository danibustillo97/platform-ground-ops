// data/api/baggageAPI.ts
export const fetchPassengerDataAPI = async (pnr: string) => {
    try {
        const response = await fetch(
            `https://e9ca-20-81-239-96.ngrok-free.app/api/manifest/${pnr}`,
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
            "https://e9ca-20-81-239-96.ngrok-free.app/api/baggage-case/",
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
