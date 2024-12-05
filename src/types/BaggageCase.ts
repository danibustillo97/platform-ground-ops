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
    date_create: string; 
    last_updated: string; 
    number_ticket_zendesk:string
}


export interface UpdateBaggageCase{
    
}