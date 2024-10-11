"use client";
import React, { useEffect, useState } from 'react';
import styles from './FlightsTable.module.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


interface Flight {
    carrier_name: string;
    flight_number: string;
    itinerary: {
        scheduled_departure_date: string;
        scheduled_departure_time: string;
        station_iata: string;
        flight_status: string;
        terminal: string;
        gate: string;
    }[];
}

interface ContactInfo {
    serviceLeader: { name: string; phone: string; };
    rampLeader: { name: string; phone: string; };
    trc: { name: string; phone: string; };
}

const FlightsPage = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [originStation, setOriginStation] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        serviceLeader: { name: '', phone: '' },
        rampLeader: { name: '', phone: '' },
        trc: { name: '', phone: '' },
    });
    const [isContactFormVisible, setIsContactFormVisible] = useState(false);
    const [otpSubmitted, setOtpSubmitted] = useState(false);
    const [counterSetup, setCounterSetup] = useState<File | null>(null);
    const apiURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  console.log(otpSubmitted)

    useEffect(() => {
        const fetchFlights = async () => {
            const response = await fetch(`${apiURL}/api/fligths_manifest/flights`, {
                method: 'GET',
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setFlights(data.flight_list || []);
            if (data.flight_list.length > 0) {
                setOriginStation(data.flight_list[0].itinerary[0].station_iata);
            }
        };

        fetchFlights();
    }, [apiURL]);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedFlights = Array.isArray(flights) && flights.length > 0
        ? [...flights].sort((a, b) => {
            if (!sortConfig) return 0;
            const { key, direction } = sortConfig;

            const flightA = key.includes('itinerary')
                ? a.itinerary[0][key.split('.')[1] as keyof Flight['itinerary'][0]]
                : a[key as keyof Flight];
            const flightB = key.includes('itinerary')
                ? b.itinerary[0][key.split('.')[1] as keyof Flight['itinerary'][0]]
                : b[key as keyof Flight];

            if (flightA && flightB && typeof flightA === 'string' && typeof flightB === 'string') {
                return direction === 'asc'
                    ? flightA.localeCompare(flightB)
                    : flightB.localeCompare(flightA);
            }
            return 0;
        })
        : [];

    const handleFlightSelection = (flight: Flight) => {
        setSelectedFlight(flight === selectedFlight ? null : flight);
        setContactInfo({
            serviceLeader: { name: '', phone: '' },
            rampLeader: { name: '', phone: '' },
            trc: { name: '', phone: '' },
        });
        setIsContactFormVisible(false);
        setOtpSubmitted(false);
    };

    const handleContactChange = (role: keyof ContactInfo, field: 'name' | 'phone', value: string) => {
        setContactInfo((prev) => ({
            ...prev,
            [role]: {
                ...prev[role],
                [field]: value,
            },
        }));
    };

    const toggleContactForm = () => {
        setIsContactFormVisible(!isContactFormVisible);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCounterSetup(file);
        }
    };

    const handleCounterSetupUpload = async () => {
        if (counterSetup) {
            const formData = new FormData();
            formData.append('counterSetup', counterSetup);

            // Implementar lógica para subir el archivo
            const response = await fetch(`${apiURL}/api/upload`, {
                method: 'POST',
                body: formData,
            });
            // Manejar la respuesta del servidor
            console.log(await response.json());
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Lista de Vuelos desde {originStation}</h1>
            <div className={styles.tableWrapper}>
                <table className={styles.flightsTable}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('itinerary.station_iata')}>Estación</th>
                            <th onClick={() => handleSort('flight_number')}>Número de Vuelo</th>
                            <th onClick={() => handleSort('carrier_name')}>Aerolínea</th>
                            <th onClick={() => handleSort('itinerary.scheduled_departure_date')}>Fecha de Salida</th>
                            <th onClick={() => handleSort('itinerary.scheduled_departure_time')}>Hora de Salida</th>
                            <th onClick={() => handleSort('itinerary.flight_status')}>Estado del Vuelo</th>
                            <th onClick={() => handleSort('itinerary.terminal')}>Terminal</th>
                            <th onClick={() => handleSort('itinerary.gate')}>Puerta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFlights.map((flight, index) => (
                            <tr
                                key={index}
                                onClick={() => handleFlightSelection(flight)}
                                className={selectedFlight === flight ? styles.selected : ''}>
                                <td>{flight.itinerary[0].station_iata}</td>
                                <td>{flight.flight_number}</td>
                                <td>{flight.carrier_name}</td>
                                <td>{flight.itinerary[0].scheduled_departure_date}</td>
                                <td>{flight.itinerary[0].scheduled_departure_time}</td>
                                <td>{flight.itinerary[0].flight_status}</td>
                                <td>{flight.itinerary[0].terminal}</td>
                                <td>{flight.itinerary[0].gate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedFlight && (
                <>
                    <div className={styles.detailsContainer}>
                        <h2 className={styles.formContactTitle}>Detalles del Vuelo: {selectedFlight.flight_number}</h2>
                        <button onClick={toggleContactForm} className={styles.toggleButton}>
                            {isContactFormVisible ? 'Ocultar Formulario' : 'Ver Formulario'}
                            <span className={`${styles.toggleIcon} ${isContactFormVisible ? styles.open : ''}`}>
                                <ExpandMoreIcon />
                            </span>
                        </button>
                        {isContactFormVisible && (
                            <div className={styles.contactForm}>
                                <h3>Contactos:</h3>
                                <label>
                                    Líder Servicio Al Pasajero:
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={contactInfo.serviceLeader.name}
                                        onChange={(e) => handleContactChange('serviceLeader', 'name', e.target.value)} />
                                    <input
                                        type="text"
                                        placeholder="Teléfono"
                                        value={contactInfo.serviceLeader.phone}
                                        onChange={(e) => handleContactChange('serviceLeader', 'phone', e.target.value)} />
                                </label>
                                <label>
                                    Líder Rampa:
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={contactInfo.rampLeader.name}
                                        onChange={(e) => handleContactChange('rampLeader', 'name', e.target.value)} />
                                    <input
                                        type="text"
                                        placeholder="Teléfono"
                                        value={contactInfo.rampLeader.phone}
                                        onChange={(e) => handleContactChange('rampLeader', 'phone', e.target.value)} />
                                </label>
                                <label>
                                    TRC:
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={contactInfo.trc.name}
                                        onChange={(e) => handleContactChange('trc', 'name', e.target.value)} />
                                    <input
                                        type="text"
                                        placeholder="Teléfono"
                                        value={contactInfo.trc.phone}
                                        onChange={(e) => handleContactChange('trc', 'phone', e.target.value)} />
                                </label>
                            </div>
                        )}
                        {/* <OTPForm onSubmit={handleOTPSubmit} /> */}
                    </div>
                    <div className={styles.counterSetupContainer}>
                        <h3 className={styles.counterTitle}>Configuración del Counter:</h3>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={styles.fileInput}
                        />
                        <button
                            onClick={handleCounterSetupUpload}
                            className={styles.uploadButton}
                        >
                            Subir Configuración
                        </button>
                    </div>

                </>
            )}
        </div>
    );
};

export default FlightsPage;