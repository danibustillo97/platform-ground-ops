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
            const baggageCaseId = uuidv4();
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
                <p>Estimado/a <strong>DELGADO/YHESICAPAOLAMRS</strong>,</p>
                <p>Se ha abierto el caso para la gestión de su equipaje: <strong>0000563569</strong>.</p>

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

                    const emailResponse = await fetch('http://localhost:8000/api/email/send-email/', {
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
