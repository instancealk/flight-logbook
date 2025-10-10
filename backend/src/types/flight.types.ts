export interface Flight {
  id: string;
  userId: string;
  date: Date;
  departureAirport: string;
  arrivalAirport: string;
  aircraftType: string;
  flightHours: number;
  isNight: boolean;
  isSolo: boolean;
  createdAt: Date;
  updatedAt: Date;
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

export interface UpdateFlightDto extends Partial<CreateFlightDto> {}

export interface FlightTotals {
  userId: string;
  totalHours: number;
  dayHours: number;
  nightHours: number;
  soloHours: number;
  totalFlights: number;
  lastUpdated: Date;
}
