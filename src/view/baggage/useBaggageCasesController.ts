import { useState, useEffect, useMemo } from "react";
import { getBaggageCasesApi } from "@/data/api/baggageAPI";

interface BaggageCase {
    baggage_code: string;
    contact: {
        phone: string;
        email: string;
    };
    passenger_name: string;
    issue_type: string;
    status: string;
    date_create: string; // formato '2024-08-28T01:07:00.223000'
}

export const useBaggageCasesController = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [baggageCases, setBaggageCases] = useState<BaggageCase[]>([]);

    useEffect(() => {
        const fetchBaggageCases = async () => {
            const data = await getBaggageCasesApi();
            console.log("Datos recibidos de la API:", data);
            setBaggageCases(data);
        };

        fetchBaggageCases();
    }, []);

    const filteredData = useMemo(() => {
        console.log("Datos antes de filtrar:", baggageCases);

        // Formatear las fechas de inicio y fin
        const start = startDate || "1900-01-01";
        const end = endDate || new Date().toISOString().split('T')[0];

        console.log("Fecha de inicio:", start);
        console.log("Fecha de fin:", end);

        return baggageCases
            .filter((row) => {
                const pnr = row.baggage_code?.toLowerCase() || "";
                const name = row.passenger_name?.toLowerCase() || "";
                const status = row.status?.toLowerCase() || "";

                console.log("Filtrando por PNR:", pnr);
                console.log("Filtrando por nombre:", name);
                console.log("Filtrando por estado:", status);

                return (
                    (pnr.includes(searchTerm.toLowerCase()) || searchTerm === "") &&
                    (name.includes(searchTerm.toLowerCase()) || searchTerm === "") &&
                    (status.includes(statusFilter.toLowerCase()) || statusFilter === "")
                );
            })
            .filter((row) => {
                // Convertir la fecha de la API al formato 'YYYY-MM-DD'
                const rowDate = row.date_create.split('T')[0];
                console.log("Fecha del caso de equipaje:", rowDate);

                return rowDate >= start && rowDate <= end;
            });
    }, [baggageCases, searchTerm, statusFilter, startDate, endDate]);

    return {
        searchTerm,
        statusFilter,
        startDate,
        endDate,
        filteredData,
        setSearchTerm,
        setStatusFilter,
        setStartDate,
        setEndDate,
    };
};
