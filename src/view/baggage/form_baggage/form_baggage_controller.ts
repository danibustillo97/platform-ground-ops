"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "next-auth/react";
import { getPassengerData, createBaggageCases } from "../../../data/repositories/baggageRepository";
import { PassengerData } from "../../../domain/types/PassengerData";
import Alert from "@/components/Alerts/Alert";
import axios from "axios";

interface LogActionPayload {
    userId: string;
    actionType: string;
    actionDetails: string;
}

/**
 * Logs a user action to the backend.
 * @param userId - The ID of the user performing the action.
 * @param actionType - The type of action being performed.
 * @param actionDetails - Details about the action.
 */
const logUserAction = async (userId: string, actionType: string, actionDetails: string): Promise<void> => {
    const payload: LogActionPayload = { userId, actionType, actionDetails };
    try {
        await axios.post('/api/log-action', payload);
    } catch (error) {
        console.error('Error logging user action:', error);
    }
};

export const useFormBaggageController = () => {
    const [loading, setLoading] = useState(true);
    const [pnr, setPnr] = useState("");
    const [pnrAdded, setPnrAdded] = useState(false);
    const [passengerData, setPassengerData] = useState<PassengerData[]>([]);
    const [selectedPassenger, setSelectedPassenger] = useState<{
        Pax_Name: string;
        fromAirport: string;
        toAirport: string;
    } | null>(null);
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
    const [alert, setAlert] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Estado de carga

    /**
     * Fetches the current user session and sets the user ID.
     */
    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            if (session) {
                setCurrentUserId(session.user.access_token);
            }
        };
        fetchSession();
    }, []);

    /**
     * Fetches passenger data if PNR is added.
     */
    useEffect(() => {
        if (pnrAdded) {
            fetchPassengerData(pnr);
        }
        setLoading(false);
    }, [pnrAdded, pnr]);

    /**
     * Handles adding a PNR and logs the action.
     */
    const handleAddPnr = async () => {
        if (pnr.trim()) {
            setIsLoading(true);
            setPnrAdded(true);
            if (currentUserId) {
                await logUserAction(currentUserId, 'ADD_PNR', `PNR ${pnr} added`);
            }
            setIsLoading(false);
        }
    };

    /**
     * Fetches passenger data from the repository.
     * @param pnr - The PNR to fetch data for.
     */
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
        }
    };

    /**
     * Handles passenger change and logs the action.
     * @param e - The change event.
     */
    const handlePassengerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const passenger = e.target.value;
        const [Pax_Name, fromAirport, toAirport] = passenger.split('|');
        setSelectedPassenger({ Pax_Name, fromAirport, toAirport });
        const passengerInfo = passengerData.find((p) =>
            p.Pax_Name === Pax_Name &&
            p.From_Airport === fromAirport &&
            p.To_Airport === toAirport
        );
        if (passengerInfo) {
            setLuggageList(passengerInfo.Bag_Tags || []);
            setFormData({
                phone: passengerInfo.phone || "",
                email: passengerInfo.email || "",
                address: passengerInfo.address || "",
            });
            setSelectedLuggage((prevLuggage) =>
                prevLuggage.map((item) =>
                    item.passengerName === passengerInfo.Pax_Name &&
                        item.fromAirport === passengerInfo.From_Airport &&
                        item.toAirport === passengerInfo.To_Airport
                        ? { ...item, ...passengerInfo, passengerName: passengerInfo.Pax_Name }
                        : item
                )
            );
            if (currentUserId) {
                logUserAction(currentUserId, 'PASSENGER_CHANGE', `Passenger changed to ${Pax_Name}`);
            }
        }
    };

    /**
     * Handles luggage selection and logs the action.
     * @param e - The change event.
     */
    const handleLuggageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const luggage = e.target.value;
        const passengerInfo = passengerData.find((p) =>
            p.Pax_Name === selectedPassenger?.Pax_Name &&
            p.From_Airport === selectedPassenger?.fromAirport &&
            p.To_Airport === selectedPassenger?.toAirport
        );
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
            if (currentUserId) {
                logUserAction(currentUserId, 'LUGGAGE_SELECT', `Luggage ${luggage} selected for passenger ${passengerInfo.Pax_Name}`);
            }
        }
    };

    /**
     * Handles removing luggage and logs the action.
     * @param id - The ID of the luggage to remove.
     */
    const handleRemoveLuggage = (id: string) => {
        setSelectedLuggage(selectedLuggage.filter((item) => item.id !== id));
        if (currentUserId) {
            logUserAction(currentUserId, 'LUGGAGE_REMOVE', `Luggage with ID ${id} removed`);
        }
    };

    /**
     * Handles description change and logs the action.
     * @param id - The ID of the luggage.
     * @param value - The new description.
     */
    const handleDescriptionChange = (id: string, value: string) => {
        setSelectedLuggage((prevLuggage) =>
            prevLuggage.map((item) =>
                item.id === id ? { ...item, description: value } : item
            )
        );
        if (currentUserId) {
            logUserAction(currentUserId, 'DESCRIPTION_CHANGE', `Description changed for luggage with ID ${id}`);
        }
    };

    /**
     * Handles issue change and logs the action.
     * @param id - The ID of the luggage.
     * @param value - The new issue.
     */
    const handleIssueChange = (id: string, value: string) => {
        setSelectedLuggage((prevLuggage) =>
            prevLuggage.map((item) =>
                item.id === id ? { ...item, issue: value } : item
            )
        );
        if (currentUserId) {
            logUserAction(currentUserId, 'ISSUE_CHANGE', `Issue changed for luggage with ID ${id}`);
        }
    };

    /**
     * Handles creating cases and logs the action.
     */
    const handleCreateCases = async () => {
        setIsLoading(true);
        const session = await getSession();
        const token = session?.user.access_token;

        const formattedData = selectedLuggage.map((luggageItem) => {
            const baggageCaseId = luggageItem.id;
            const pruebasUrl = luggageItem.issue === 'Daño' ? formData.address : null;
            const direccionEnvio = luggageItem.issue === 'Retraso' ? formData.address : null;

            return {
                baggage_case_id: baggageCaseId,
                baggage_code: luggageItem.luggage || "",
                PNR: pnr || "",
                contact_phone: luggageItem.phone || "",
                contact_email: luggageItem.email || "",
                flight_number: luggageItem.flightNum || "",
                departure_date: luggageItem.departureDate || "",
                from_airport: luggageItem.fromAirport || "",
                to_airport: luggageItem.toAirport || "",
                passenger_name: luggageItem.passengerName || "",
                description: luggageItem.description || "",
                issue_type: luggageItem.issue || "",
                number_ticket_zendesk: "12345",
                pruebas_url: pruebasUrl || "Null",
                direccion_envio: direccionEnvio || "Null",
                comments: [],
            };
        });

        if (token) {
            try {
                const response = await createBaggageCases(formattedData, token);
                console.log("Respuesta del servidor:", response);

                const emailPromises = formattedData.map(async (caseInfo) => {
                    const emailTemplate = `
                        <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Equipaje - ARAJET</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: 'Ubuntu', Arial, sans-serif;
            color: #333;
        }
        .container {
            width: 100%;
            padding: 20px 0;
            background-color: #f4f4f4;
        }
        .email-content {
            width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #510C76;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 26px;
        }
        .header p {
            margin: 5px 0 0;
            font-size: 16px;
        }
        .content {
            padding: 20px;
        }
        .content p {
            margin: 15px 0;
            line-height: 1.5;
        }
        .content h2 {
            font-size: 20px;
            margin: 20px 0 10px;
            color: #510C76;
        }
        .details {
            background-color: #f9f9f9;
            border-left: 5px solid #510C76;
            padding: 15px 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .details ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .details li {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .details li:last-child {
            margin-bottom: 0;
        }
        .details li img {
            width: 24px;
            height: 24px;
            margin-right: 10px;
        }
        .footer {
            background-color: #510C76;
            color: #ffffff;
            text-align: center;
            padding: 15px;
            font-size: 12px;
        }
        .footer a {
            color: #ffffff;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-content">
            <!-- Header -->
            <div class="header">
                <h1>ARAJET</h1>
                <p>Gestión de Equipaje</p>
            </div>

            <!-- Content -->
            <div class="content">
                <p>Estimado/a <strong>${caseInfo.passenger_name}</strong>,</p>
                <p>Se ha abierto el caso para la gestión de su equipaje: <strong>${caseInfo.baggage_case_id}</strong>.</p>

                <h2>Detalles del caso:</h2>
                <div class="details">
                    <ul>
                        <li>
                            <img src="https://img.icons8.com/color/48/null/suitcase--v1.png" alt="Equipaje">
                            Código de equipaje: <strong>${caseInfo.baggage_code}</strong>
                        </li>
                        <li>
                            <img src="https://img.icons8.com/color/48/null/airplane-take-off.png" alt="Vuelo">
                            Número de vuelo: <strong>${caseInfo.flight_number}</strong>
                        </li>
                        <li>
                            <img src="https://img.icons8.com/color/48/null/calendar.png" alt="Fecha">
                            Fecha de salida: <strong>${caseInfo.departure_date}</strong>
                        </li>
                        <li>
                            <img src="https://img.icons8.com/color/48/null/airport.png" alt="Aeropuerto">
                            Aeropuerto de salida: <strong>${caseInfo.from_airport}</strong>
                        </li>
                        <li>
                            <img src="https://img.icons8.com/color/48/null/airport.png" alt="Aeropuerto">
                            Aeropuerto de llegada: <strong>${caseInfo.to_airport}</strong>
                        </li>
                        <li>
                            <img src="https://img.icons8.com/color/48/null/note.png" alt="Descripción">
                            Descripción: <strong>${caseInfo.description}</strong>
                        </li>
                        <li>
                            <img src="https://img.icons8.com/color/48/null/error--v1.png" alt="Problema">
                            Tipo de problema: <strong>${caseInfo.issue_type}</strong>
                        </li>
                    </ul>
                </div>

                <p>Estamos trabajando para resolver su caso con la mayor diligencia y profesionalismo.</p>
                <p>Atentamente,<br>El equipo de soporte ARAJET</p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>&copy; 2024 ARAJET. Todos los derechos reservados.</p>
                <p><a href="https://www.arajet.com">Visita nuestro sitio web</a></p>
            </div>
        </div>
    </div>
</body>
</html>
                    `;

                    const emailData = {
                        case_id: caseInfo.baggage_case_id,
                        to_email: caseInfo.contact_email,
                        subject: "Gestión de su equipaje",
                        body: emailTemplate
                            .replace("${caseInfo.passenger_name}", caseInfo.passenger_name)
                            .replace("${caseInfo.baggage_code}", caseInfo.baggage_code)
                            .replace("${caseInfo.baggage_code}", caseInfo.baggage_code)
                            .replace("${caseInfo.flight_number}", caseInfo.flight_number)
                            .replace("${caseInfo.departure_date}", caseInfo.departure_date)
                            .replace("${caseInfo.from_airport}", caseInfo.from_airport)
                            .replace("${caseInfo.to_airport}", caseInfo.to_airport)
                            .replace("${caseInfo.description}", caseInfo.description)
                            .replace("${caseInfo.issue_type}", caseInfo.issue_type),
                    };

                    const emailResponse = await fetch('https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/email/send-email/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify(emailData),
                    });

                    if (!emailResponse.ok) {
                        throw new Error(`Error: ${emailResponse.status}`);
                    }

                    return emailResponse.json();
                });

                await Promise.all(emailPromises);

                setAlert({ type: 'success', message: 'Los casos de equipaje se han creado exitosamente y se ha enviado un correo electrónico de confirmación.' });
                if (currentUserId) {
                    logUserAction(currentUserId, 'CREATE_CASES', 'Cases created successfully');
                }
                resetForm();
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
            } finally {
                setIsLoading(false);
            }
        } else {
            console.error('Token no disponible. No se puede realizar la operación.');
            setAlert({ type: 'error', message: 'Token no disponible. No se puede realizar la operación.' });
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            phone: "",
            email: "",
            address: "",
        });
        setPnr("");
        setAlert(null);
        setSelectedPassenger(null);
        setLuggageList([]);
        setSelectedLuggage([]);
        setPnrAdded(false);
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
        alert,
        setAlert,
        resetForm,
        isLoading, 
    };
};
