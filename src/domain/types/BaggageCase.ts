export enum Status{
    closed = "Cerrado",
    open = "Abierto",
    standby_form = "En espera de formulario",
    standby_pax = "En espera de pasajero"
}

export interface BaggageCase {
    id: string;
    pnr: string;
    address?: string;
    baggage_code: string;
    contact: {
        phone: string;
        email: string;
    };
    flight_info: string;
    passenger_name: string;
    description: string;
    issue_type: string;
    status: string;
    date_create: string; // formato '2024-08-28T01:07:00.223000'
    last_updated: string; // formato '2024-08-28T01:07:00.223000'
}
