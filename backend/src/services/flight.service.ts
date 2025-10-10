import { FlightRepository } from "../repositories/flight.repository";
import {
  Flight,
  CreateFlightDto,
  UpdateFlightDto,
  FlightTotals,
} from "../types";
import { ValidationError } from "../utils/errors";

export class FlightService {
  private flightRepository: FlightRepository;

  constructor() {
    this.flightRepository = new FlightRepository();
  }

  async createFlight(userId: string, data: CreateFlightDto): Promise<Flight> {
    this.validateFlightData(data);
    const flight = await this.flightRepository.create(userId, data);
    // Recalculate totals in background (for now synchronous, will be Lambda later)
    await this.flightRepository.recalculateTotals(userId);
    return flight;
  }

  async getFlightById(id: string): Promise<Flight> {
    const flight = await this.flightRepository.findById(id);
    if (!flight) {
      throw new ValidationError("Flight not found");
    }
    return flight;
  }

  async getFlightsByUser(
    userId: string,
    limit = 100,
    offset = 0
  ): Promise<Flight[]> {
    return this.flightRepository.findByUserId(userId, limit, offset);
  }

  async updateFlight(
    id: string,
    userId: string,
    data: UpdateFlightDto
  ): Promise<Flight> {
    if (Object.keys(data).length > 0) {
      this.validateFlightData(data, true);
    }
    const flight = await this.flightRepository.update(id, data);
    // Recalculate totals after update
    await this.flightRepository.recalculateTotals(userId);
    return flight;
  }

  async deleteFlight(id: string, userId: string): Promise<void> {
    await this.flightRepository.delete(id);
    // Recalculate totals after deletion
    await this.flightRepository.recalculateTotals(userId);
  }

  async getFlightTotals(userId: string): Promise<FlightTotals> {
    let totals = await this.flightRepository.getTotalsByUserId(userId);
    if (!totals) {
      // If no totals exist, calculate them
      totals = await this.flightRepository.recalculateTotals(userId);
    }
    return totals;
  }

  private validateFlightData(
    data: Partial<CreateFlightDto>,
    isUpdate = false
  ): void {
    if (!isUpdate || data.flightHours !== undefined) {
      if (data.flightHours !== undefined && data.flightHours <= 0) {
        throw new ValidationError("Flight hours must be greater than 0");
      }
    }

    if (!isUpdate || data.departureAirport !== undefined) {
      if (
        data.departureAirport &&
        !this.isValidAirportCode(data.departureAirport)
      ) {
        throw new ValidationError("Invalid departure airport code");
      }
    }

    if (!isUpdate || data.arrivalAirport !== undefined) {
      if (
        data.arrivalAirport &&
        !this.isValidAirportCode(data.arrivalAirport)
      ) {
        throw new ValidationError("Invalid arrival airport code");
      }
    }

    if (!isUpdate || data.date !== undefined) {
      if (data.date && !this.isValidDate(data.date)) {
        throw new ValidationError("Invalid date format");
      }
    }
  }

  private isValidAirportCode(code: string): boolean {
    // Simple validation: 3-4 uppercase letters
    return /^[A-Z]{3,4}$/.test(code);
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
}
