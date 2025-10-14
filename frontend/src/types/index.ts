// Match your backend types
export interface Flight {
  id: string;
  userId: string;
  date: string | Date;
  departureAirport: string;
  arrivalAirport: string;
  aircraftType: string;
  flightHours: number;
  isNight: boolean;
  isSolo: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateFlightDto {
  date: string;
  departureAirport: string;
  arrivalAirport: string;
  aircraftType: string;
  flightHours: number;
  isNight: boolean;
  isSolo: boolean;
}

export interface UpdateFlightDto {
  date?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  aircraftType?: string;
  flightHours?: number;
  isNight?: boolean;
  isSolo?: boolean;
}

export interface FlightTotals {
  userId: string;
  totalHours: number;
  dayHours: number;
  nightHours: number;
  soloHours: number;
  totalFlights: number;
  lastUpdated: string | Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
