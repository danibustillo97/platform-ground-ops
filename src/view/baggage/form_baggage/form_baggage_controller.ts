"use client"

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "next-auth/react";
import { getPassengerData, createBaggageCases } from "../../../data/repositories/baggageRepository";
import { PassengerData } from "../../../domain/types/PassengerData";
import Alert from "@/components/Alerts/Alert"; 

export const useFormBaggageController = () => {
    const [loading, setLoading] = useState(true);
    const [pnr, setPnr] = useState("");
    const [pnrAdded, setPnrAdded] = useState(false);
    const [passengerData, setPassengerData] = useState<PassengerData[]>([]);
    const [selectedPassenger, setSelectedPassenger] = useState<string>("");
    const [luggageList, setLuggageList] = useState<string[]>([]);
    const [selectedLuggage, setSelectedLuggage] = useState<{
        id: string;
        luggage: string;
        phone: string;
        email: string;
        flightNum: string;
        departureDate: string;
        fromAirport: string;
        toAirport: string;
        passengerName: string;
        description: string;
        issue: string;
    }[]>([]);
    const [formData, setFormData] = useState({ phone: "", email: "", address: "" });
    
    // Estado para el manejo de alertas
    const [alert, setAlert] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (pnrAdded) {
            fetchPassengerData(pnr);
        }
        setLoading(false);
    }, [pnrAdded, pnr]);

    const handleAddPnr = () => {
        if (pnr.trim()) {
            setPnrAdded(true);
        }
    };

    const fetchPassengerData = async (pnr: string) => {
        try {
            const session = await getSession();
            const token = session?.user.access_token;
            if (token) {
                const data = await getPassengerData(pnr, token);
                setPassengerData(data);
            }
        } catch (error) {
            console.error("Error fetching passenger data from repository", error);
            setAlert({ type: 'error', message: 'Error al obtener los datos del pasajero.' });
        }
    };

    const handlePassengerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const passenger = e.target.value;
        setSelectedPassenger(passenger);
        const passengerInfo = passengerData.find((p) => p.Pax_Name === passenger);
        if (passengerInfo) {
            setLuggageList(passengerInfo.Bag_Tags || []);
            setFormData({
                phone: passengerInfo.phone || "",
                email: passengerInfo.email || "",
                address: passengerInfo.address || "",
            });
            setSelectedLuggage((prevLuggage) =>
                prevLuggage.map((item) =>
                    item.passengerName === passengerInfo.Pax_Name
                        ? { ...item, ...passengerInfo, passengerName: passengerInfo.Pax_Name }
                        : item
                )
            );
        }
    };

    const handleLuggageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const luggage = e.target.value;
        const passengerInfo = passengerData.find((p) => p.Pax_Name === selectedPassenger);
        if (luggage && !selectedLuggage.some((item) => item.luggage === luggage) && passengerInfo) {
            setSelectedLuggage((prevLuggage) => [
                ...prevLuggage,
                {
                    id: uuidv4(),
                    luggage,
                    phone: formData.phone,
                    email: formData.email,
                    flightNum: passengerInfo.Flight_Num || "",
                    departureDate: passengerInfo.Id_Departure_Date || "",
                    fromAirport: passengerInfo.From_Airport || "",
                    toAirport: passengerInfo.To_Airport || "",
                    passengerName: passengerInfo.Pax_Name || "",
                    description: "",
                    issue: "Lost",
                },
            ]);
        }
    };

    const handleRemoveLuggage = (id: string) => {
        setSelectedLuggage(selectedLuggage.filter((item) => item.id !== id));
    };

    const handleDescriptionChange = (id: string, value: string) => {
        setSelectedLuggage((prevLuggage) =>
            prevLuggage.map((item) =>
                item.id === id ? { ...item, description: value } : item
            )
        );
    };

    const handleIssueChange = (id: string, value: string) => {
        setSelectedLuggage((prevLuggage) =>
            prevLuggage.map((item) =>
                item.id === id ? { ...item, issue: value } : item
            )
        );
    };

    const handleCreateCases = async () => {
        const session = await getSession();
        const token = session?.user.access_token;

        const formattedData = selectedLuggage.map((luggageItem) => {
            const pruebasUrl = luggageItem.issue === 'Daño' ? formData.address : null;
            const direccionEnvio = luggageItem.issue === 'Retraso' ? formData.address : null;

            return {
                baggage_code: luggageItem.luggage,
                pnr: pnr,
                contact: {
                    phone: luggageItem.phone,
                    email: luggageItem.email
                },
                flight_info: {
                    flightNumber: luggageItem.flightNum || "",
                    departureDate: luggageItem.departureDate || "",
                    fromAirport: luggageItem.fromAirport || "",
                    toAirport: luggageItem.toAirport || ""
                },
                passenger_name: luggageItem.passengerName || "",
                description: luggageItem.description || "",
                issue_type: luggageItem.issue || "",
                direccion_envio: direccionEnvio || "Null",
                pruebas_url: pruebasUrl || "Null",
                created_agente_name: session?.user.name || "",
                date_create: new Date().toISOString(),
                last_updated: new Date().toISOString(),
                number_ticket_zendesk: "12345",
            };
        });

        if (token) {
            try {
                const response = await createBaggageCases(formattedData, token);
                console.log("Respuesta del servidor:", response);
                setAlert({ type: 'success', message: 'Los casos de equipaje se han creado exitosamente.' });
            } catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes("400")) {
                        setAlert({ type: 'warning', message: "El caso ya existe en los registros." });
                    } else {
                        console.error("Error al crear los casos de equipaje:", error.message);
                        setAlert({ type: 'error', message: "Ocurrió un error al intentar crear los casos de equipaje." });
                    }
                } else {
                    console.error("Error desconocido:", error);
                    setAlert({ type: 'error', message: "Ocurrió un error desconocido." });
                }
            }
        } else {
            console.error('Token no disponible. No se puede realizar la operación.');
            setAlert({ type: 'error', message: 'Token no disponible. No se puede realizar la operación.' });
        }
    };

    return {
        loading,
        pnr,
        setPnr,
        pnrAdded,
        handleAddPnr,
        passengerData,
        selectedPassenger,
        setSelectedPassenger,
        luggageList,
        selectedLuggage,
        formData,
        setFormData,
        handlePassengerChange,
        handleLuggageSelect,
        handleRemoveLuggage,
        handleDescriptionChange,
        handleIssueChange,
        handleCreateCases,
        alert, // Retorna el estado de alertas
        setAlert, // Para poder actualizar el estado de alertas desde el componente padre
    };
};
