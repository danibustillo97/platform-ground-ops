  // src/domain/entities/User.ts
  export interface UserInfo {
    displayName: string;
    userPrincipalName: string;
  }


  export interface UserCreate {
    name: string;
    email: string;
    phone: string;
    rol: string;
    estacion: string[];
    password?: string;
  }

  export interface UserUpdate {
    name: string;
    email: string;
    phone: string;
    rol: string;
    estacion: string[];
    password?: string;
  }

  export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    rol: string;
    estacion: string[]; 
    isOnline: boolean;
    image?: string;
  }