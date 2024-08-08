export interface User {
    id: number;
    name: string;
    station: string;
    email: string;
    distributionList: string[];
    contact: string;
    company: string;
    startDate: string;
    role: string;
}

export type Role =
    | "Super Usuario"
    | "Administrador"
    | "Gerente Outstations"
    | "Agente"
    | "Reportes SMS"
    | "SMS Proveedores"
    | "Equipajes";
