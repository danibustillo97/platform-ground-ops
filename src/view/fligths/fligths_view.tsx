"use client";
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './FlightsTable.module.css';
import DataTable from 'react-data-table-component';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OverlayComponent from "@/components/Overlay/Overlay"

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
    const [loading, setLoading] = useState(true); // Añadido loading
    const [, setOtpSubmitted] = useState(false);
    const [counterSetup, setCounterSetup] = useState<File | null>(null);
    const apiURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true); // Activar loading
            try {
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
            } catch (error) {
                console.error("Error fetching flights:", error);
            } finally {
                setLoading(false); // Desactivar loading al terminar
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

    const columns = [
        { name: 'Estación', selector: (row: Flight) => row.itinerary[0].station_iata, sortable: true },
        { name: 'Número de Vuelo', selector: (row: Flight) => row.flight_number, sortable: true },
        { name: 'Aerolínea', selector: (row: Flight) => row.carrier_name, sortable: true },
        { name: 'Fecha de Salida', selector: (row: Flight) => row.itinerary[0].scheduled_departure_date, sortable: true },
        { name: 'Hora de Salida', selector: (row: Flight) => row.itinerary[0].scheduled_departure_time, sortable: true },
        { name: 'Estado del Vuelo', selector: (row: Flight) => row.itinerary[0].flight_status, sortable: true },
        { name: 'Puerta', selector: (row: Flight) => row.itinerary[0].gate, sortable: true },
    ];

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

            const response = await fetch(`${apiURL}/api/upload`, {
                method: 'POST',
                body: formData,
            });
            console.log(await response.json());
        }
    };

    const conditionalRowStyles = [
        {
            when: (row: Flight) => selectedFlight !== null && row.flight_number === selectedFlight?.flight_number,
            style: {
                backgroundColor: '#510c76b9',
                color: 'white',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },
    ];

    return (
        loading ? <OverlayComponent /> : (
            <div className={`${styles.container} card mt-4 m-auto`}>
            <h1 className={styles.title}>Lista de Vuelos desde {originStation}</h1>
            <div className={styles.tableWrapper}>
                <DataTable
                    columns={columns}
                    data={sortedFlights}
                    pagination
                    onRowClicked={handleFlightSelection}
                    highlightOnHover
                    pointerOnHover
                    conditionalRowStyles={conditionalRowStyles}
                />
            </div>
            {selectedFlight && (
                <div className={`${styles.detailsContainer} card mt-4`}>
                    <div className="card-body">
                        <h2 className={styles.formContactTitle}>Detalles del Vuelo: {selectedFlight.flight_number}</h2>
                        <button onClick={toggleContactForm} className={`btn btn-outline-primary mb-2 ${styles.btn_details}`}>
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
                                        className="form-control"
                                        placeholder="Nombre"
                                        value={contactInfo.serviceLeader.name}
                                        onChange={(e) => handleContactChange('serviceLeader', 'name', e.target.value)} />
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Teléfono"
                                        value={contactInfo.serviceLeader.phone}
                                        onChange={(e) => handleContactChange('serviceLeader', 'phone', e.target.value)} />
                                </label>
                                <label>
                                    Líder de Rampa:
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nombre"
                                        value={contactInfo.rampLeader.name}
                                        onChange={(e) => handleContactChange('rampLeader', 'name', e.target.value)} />
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Teléfono"
                                        value={contactInfo.rampLeader.phone}
                                        onChange={(e) => handleContactChange('rampLeader', 'phone', e.target.value)} />
                                </label>
                                <label>
                                    TRC:
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nombre"
                                        value={contactInfo.trc.name}
                                        onChange={(e) => handleContactChange('trc', 'name', e.target.value)} />
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Teléfono"
                                        value={contactInfo.trc.phone}
                                        onChange={(e) => handleContactChange('trc', 'phone', e.target.value)} />
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
        )
    );
};

export default FlightsPage;
