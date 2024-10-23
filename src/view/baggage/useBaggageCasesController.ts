import { useState, useEffect, useMemo } from "react";
import { getSession } from "next-auth/react";
import { getBaggageCasesApi, putBaggageCasesAPI } from "@/data/api/baggageAPI"; 
import { BaggageCase } from "@/domain/types/BaggageCase";

export const useBaggageCasesController = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [baggageCases, setBaggageCases] = useState<BaggageCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBaggageDetails, setSelectedBaggageDetails] = useState<BaggageCase | null>(null);

    useEffect(() => {
        const fetchBaggageCases = async () => {
            const session = await getSession();
            const token = session?.user.access_token as string;
            const data = await getBaggageCasesApi(token);
            setBaggageCases(data);
            setLoading(false);
        };
        fetchBaggageCases();
    }, []);

    const filteredData = useMemo(() => {
        const start = startDate || "1900-01-01";
        const end = endDate || new Date().toISOString().split('T')[0];
        return baggageCases
            .filter((row) => {
                const matchesSearchTerm =
                    searchTerm === "" ||
                    row.pnr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    row.passenger_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    row.status?.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatusFilter = statusFilter === "" || row.status?.toLowerCase().includes(statusFilter.toLowerCase());
                const matchesDateRange =
                    new Date(row.date_create) >= new Date(start) && new Date(row.date_create) <= new Date(end);
                return matchesSearchTerm && matchesStatusFilter && matchesDateRange;
            });
    }, [searchTerm, statusFilter, startDate, endDate, baggageCases]);

    const handleOpenModal = (details: BaggageCase) => {
        setSelectedBaggageDetails(details);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBaggageDetails(null);
    };

    const updatedSavedBaggageCase = async (updatedCase: BaggageCase) => {
        const session = await getSession(); // Obtener el token de la sesión
        const token = session?.user.access_token as string; // Asegúrate de que el token esté disponible

        await putBaggageCasesAPI(updatedCase.id, updatedCase, token); // Llamar con los tres argumentos

        setBaggageCases((prevState) =>
            prevState.map((caseItem) =>
                caseItem.id === updatedCase.id ? updatedCase : caseItem
            )
        );
        handleCloseModal();
    };

    // const handleDeleteSelected = async (selectedCases: BaggageCase[]) => {
    //     const ids = selectedCases.map((c) => c.id);
    //     await deleteBaggageCasesAPI(ids);
    //     setBaggageCases((prevState) =>
    //         prevState.filter((caseItem) => !ids.includes(caseItem.id))
    //     );
    // };

    return {
        searchTerm,
        statusFilter,
        startDate,
        endDate,
        filteredData,
        loading,
        setSearchTerm,
        setStatusFilter,
        setStartDate,
        setEndDate,
        isModalOpen,
        selectedBaggageDetails,
        handleOpenModal,
        handleCloseModal,
        updatedSavedBaggageCase,
        // handleDeleteSelected,
    };
};
