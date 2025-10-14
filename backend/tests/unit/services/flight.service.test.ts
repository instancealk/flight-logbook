import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { FlightService } from "../../../src/services/flight.service";
import { FlightRepository } from "../../../src/repositories/flight.repository";
import { CreateFlightDto } from "../../../src/types";
import { ValidationError } from "../../../src/utils/errors";

jest.mock("../../../src/repositories/flight.repository");
jest.mock("pg");

describe("FlightService", () => {
  let service: FlightService;
  let mockRepository: jest.Mocked<FlightRepository>;
  const userId = "550e8400-e29b-41d4-a716-446655440000";

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FlightService();
    mockRepository = (service as any)
      .flightRepository as jest.Mocked<FlightRepository>;
  });

  describe("createFlight", () => {
    it("should create a flight successfully with valid data", async () => {
      const createDto: CreateFlightDto = {
        date: "2025-10-09",
        departureAirport: "KBOS",
        arrivalAirport: "KJFK",
        aircraftType: "Cessna 172",
        flightHours: 2.5,
        isNight: false,
        isSolo: true,
      };

      const mockFlight = {
        id: "flight-123",
        userId,
        ...createDto,
        date: new Date(createDto.date),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(mockFlight as any);
      mockRepository.recalculateTotals.mockResolvedValue({} as any);

      const result = await service.createFlight(userId, createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(userId, createDto);
      expect(mockRepository.recalculateTotals).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockFlight);
    });

    it("should throw ValidationError for negative flight hours", async () => {
      const createDto: CreateFlightDto = {
        date: "2025-10-09",
        departureAirport: "KBOS",
        arrivalAirport: "KJFK",
        aircraftType: "Cessna 172",
        flightHours: -1,
        isNight: false,
        isSolo: true,
      };

      await expect(service.createFlight(userId, createDto)).rejects.toThrow(
        ValidationError
      );
      await expect(service.createFlight(userId, createDto)).rejects.toThrow(
        "Flight hours must be greater than 0"
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("should throw ValidationError for invalid airport codes", async () => {
      const createDto: CreateFlightDto = {
        date: "2025-10-09",
        departureAirport: "BO",
        arrivalAirport: "KJFK",
        aircraftType: "Cessna 172",
        flightHours: 2.5,
        isNight: false,
        isSolo: true,
      };

      await expect(service.createFlight(userId, createDto)).rejects.toThrow(
        ValidationError
      );
      await expect(service.createFlight(userId, createDto)).rejects.toThrow(
        "Invalid departure airport code"
      );
    });
  });

  describe("getFlightById", () => {
    it("should return a flight when found", async () => {
      const mockFlight = {
        id: "flight-123",
        userId,
        date: new Date("2025-10-09"),
        departureAirport: "KBOS",
        arrivalAirport: "KJFK",
        aircraftType: "Cessna 172",
        flightHours: 2.5,
        isNight: false,
        isSolo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(mockFlight);

      const result = await service.getFlightById("flight-123");

      expect(mockRepository.findById).toHaveBeenCalledWith("flight-123");
      expect(result).toEqual(mockFlight);
    });

    it("should throw ValidationError when flight not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getFlightById("non-existent")).rejects.toThrow(
        ValidationError
      );
      await expect(service.getFlightById("non-existent")).rejects.toThrow(
        "Flight not found"
      );
    });
  });

  describe("updateFlight", () => {
    it("should update flight and recalculate totals", async () => {
      const updateDto = {
        flightHours: 3.0,
        isNight: true,
      };

      const mockUpdatedFlight = {
        id: "flight-123",
        userId,
        date: new Date("2025-10-09"),
        departureAirport: "KBOS",
        arrivalAirport: "KJFK",
        aircraftType: "Cessna 172",
        flightHours: 3.0,
        isNight: true,
        isSolo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.update.mockResolvedValue(mockUpdatedFlight);
      mockRepository.recalculateTotals.mockResolvedValue({} as any);

      const result = await service.updateFlight(
        "flight-123",
        userId,
        updateDto
      );

      expect(mockRepository.update).toHaveBeenCalledWith(
        "flight-123",
        updateDto
      );
      expect(mockRepository.recalculateTotals).toHaveBeenCalledWith(userId);
      expect(result.flightHours).toBe(3.0);
    });
  });

  describe("deleteFlight", () => {
    it("should delete flight and recalculate totals", async () => {
      mockRepository.delete.mockResolvedValue();
      mockRepository.recalculateTotals.mockResolvedValue({} as any);

      await service.deleteFlight("flight-123", userId);

      expect(mockRepository.delete).toHaveBeenCalledWith("flight-123");
      expect(mockRepository.recalculateTotals).toHaveBeenCalledWith(userId);
    });
  });
});
