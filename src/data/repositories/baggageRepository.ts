// data/repositories/baggageRepository.ts
import { fetchPassengerDataAPI, createBaggageCasesAPI } from "../api/baggageAPI";

export const getPassengerData = async (pnr: string) => {
    try {
        const data = await fetchPassengerDataAPI(pnr);
        return data;
    } catch (error) {
        console.error("Error in repository fetching passenger data", error);
        throw error;
    }
};

export const createBaggageCases = async (baggageCases: any[]) => {
    try {
        const data = await createBaggageCasesAPI(baggageCases);
        return data;
    } catch (error) {
        console.error("Error in repository creating baggage cases", error);
        throw error;
    }
};
