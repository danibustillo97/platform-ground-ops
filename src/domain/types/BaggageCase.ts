export enum Status{
    closed = "Cerrado",
    open = "Abierto",
    standby_form = "En espera de formulario",
    standby_pax = "En espera de pasajero"
}

export interface BaggageCase {
    id: string;
    baggage_code: string;
    PNR?: string; 
    contact: {
      phone: string;
      email: string;
    };
    flight_info: {
      flightNumber: string;
      departureDate: string;
      fromAirport: string;
      toAirport: string;
    };
    passenger_name: string;
    description: string;
    issue_type: string;
    status: string;
    date_create: string;
    number_ticket_zendesk: string;
}


export interface ChartData {
  name: string;
  value: number;
}