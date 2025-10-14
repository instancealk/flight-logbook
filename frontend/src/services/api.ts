import axios from "axios";
import type {
  Flight,
  CreateFlightDto,
  UpdateFlightDto,
  FlightTotals,
  ApiResponse,
} from "../types";

// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flight API endpoints
export const flightApi = {
  // Get all flights
  getAllFlights: async (limit = 100, offset = 0): Promise<Flight[]> => {
    const response = await api.get<ApiResponse<Flight[]>>("/flights", {
      params: { limit, offset },
    });
    return response.data.data;
  },

  // Get flight by ID
  getFlightById: async (id: string): Promise<Flight> => {
    const response = await api.get<ApiResponse<Flight>>(`/flights/${id}`);
    return response.data.data;
  },

  // Create new flight
  createFlight: async (flight: CreateFlightDto): Promise<Flight> => {
    const response = await api.post<ApiResponse<Flight>>("/flights", flight);
    return response.data.data;
  },

  // Update flight
  updateFlight: async (
    id: string,
    flight: UpdateFlightDto
  ): Promise<Flight> => {
    const response = await api.put<ApiResponse<Flight>>(
      `/flights/${id}`,
      flight
    );
    return response.data.data;
  },

  // Delete flight
  deleteFlight: async (id: string): Promise<void> => {
    await api.delete(`/flights/${id}`);
  },

  // Get flight totals
  getFlightTotals: async (): Promise<FlightTotals> => {
    const response = await api.get<ApiResponse<FlightTotals>>(
      "/flights/totals"
    );
    return response.data.data;
  },
};

export default api;
