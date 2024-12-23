export enum Status {
  closed = "Cerrado",
  open = "Abierto",
  standby_form = "En espera de formulario",
  standby_pax = "En espera de pasajero"
}

export interface BaggageCase {
  id: string;
  baggage_code: string;
  PNR?: string;
  contact_phone: string;
  contact_email: string;
  flight_number: string;
  departure_date: string;
  from_airport: string; 
  to_airport: string;
  passenger_name: string;
  description: string;
  issue_type: string;
  status: string;
  date_create: string;
  number_ticket_zendesk: string;
  agentId?: string; 
  station?: string; 
  comments?: {
    id: string;
    text: string;
    created_at: string;
  }[];
  attachedFiles?: { fileUrl: string; file: File }[];
  history?: { action: string; date: string; description?: string }[];
}


export interface ComentsCases {
  baggage_case_id: string
  text: string
  created_at:string
}

export interface ChartData {
  name: string;
  value: number;
}