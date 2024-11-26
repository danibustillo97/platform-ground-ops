export interface BaggageRow {
    id: string;
    baggage_code: string;
    PNR: string;
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