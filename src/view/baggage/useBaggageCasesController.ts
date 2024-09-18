import { useState, useEffect, useMemo } from "react";
import { getBaggageCasesApi, putBaggageCasesAPI } from "@/data/api/baggageAPI";
import { BaggageCase} from "@/domain/types/BaggageCase";

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
            const data = await getBaggageCasesApi();
            console.log("Datos recibidos de la API:", data);
            setBaggageCases(data);
            setLoading(false);
        };
        fetchBaggageCases();
    }, []);

    const filteredData = useMemo(() => {
        console.log("Valor a buscar",searchTerm);
        console.log("Datos antes de filtrar:", baggageCases);
        console.log("Filtro de estado:", statusFilter);

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

                const matchesSearchTerm = searchTerm === "" ||
                pnr.includes(searchTerm.toLowerCase()) ||
                name.includes(searchTerm.toLowerCase()) ||
                status.includes(searchTerm.toLowerCase());

                // El filtro de estado se aplica si statusFilter está presente
                const matchesStatusFilter = statusFilter === "" || 
                   status.includes(statusFilter.toLowerCase());

                return matchesSearchTerm && matchesStatusFilter;

            })
            .filter((row) => {
                // Convertir la fecha de la API al formato 'YYYY-MM-DD'
                const rowDate = row.date_create.split('T')[0];
                console.log("Fecha del caso de equipaje:", rowDate);

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
        const formattedData = {
            id: updatedDetails.id, // Asegúrate de incluir el identificador
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
        
        console.log("phone actual:", updatedDetails.contact.phone)
        console.log("email actual:", updatedDetails.contact.email)

        
        console.log("Datos preparados para enviar (actualización):", formattedData);
    
        try {
            const response = await putBaggageCasesAPI(
                updatedDetails.id, 
                formattedData 
            );
            console.log('Caso actualizado con éxito:', response);
    
        } catch (error) {
            console.error('Error al actualizar el caso de equipaje:', error);
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
