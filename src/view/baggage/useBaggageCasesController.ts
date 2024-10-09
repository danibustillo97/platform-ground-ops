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
            const token = session?.user.access_token;
            if (token) {
                const data = await getBaggageCasesApi(token);
                setBaggageCases(data);
            }
            setLoading(false);
        };
        fetchBaggageCases();
    }, []);

    const filteredData = useMemo(() => {
        const start = startDate || "1900-01-01";
        const end = endDate || new Date().toISOString().split('T')[0];
        return baggageCases
            .filter((row) => {
                const pnr = row.baggage_code?.toLowerCase() || "";
                const name = row.passenger_name?.toLowerCase() || "";
                const status = row.status?.toLowerCase() || "";
                const matchesSearchTerm = searchTerm === "" ||
                    pnr.includes(searchTerm.toLowerCase()) ||
                    name.includes(searchTerm.toLowerCase()) ||
                    status.includes(searchTerm.toLowerCase());
                const matchesStatusFilter = statusFilter === "" ||
                    status.includes(statusFilter.toLowerCase());
                return matchesSearchTerm && matchesStatusFilter;
            })
            .filter((row) => {
                const rowDate = row.date_create.split('T')[0];
                return rowDate >= start && rowDate <= end;
            });
    }, [baggageCases, searchTerm, statusFilter, startDate, endDate]);

    const handleOpenModal = (details: BaggageCase) => {
        setSelectedBaggageDetails(details);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBaggageDetails(null);
    };

    const updatedSavedBaggageCase = async (updatedDetails: BaggageCase) => {
        const session = await getSession(); 
        const token = session?.user.access_token; 
        const formattedData = {
            id: updatedDetails.id,
            baggage_code: updatedDetails.baggage_code,
            contact: {
                phone: updatedDetails.contact.phone,
                email: updatedDetails.contact.email,
            },
            flight_info: updatedDetails.flight_info,
            passenger_name: updatedDetails.passenger_name,
            description: updatedDetails.description,
            issue_type: updatedDetails.issue_type,
            status: updatedDetails.status,
            date_create: updatedDetails.date_create,
        };
    
        if (token) {
            try {
                await putBaggageCasesAPI(updatedDetails.id, formattedData, token);
            } catch (error) {
                console.error('Error al actualizar el caso de equipaje:', error);
            }
        } else {
            console.error('Token no disponible');
        }
    };
    

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
    };
};
