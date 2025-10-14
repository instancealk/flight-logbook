import { Router, Request, Response } from "express";
import { FlightRepository } from "../repositories/flight.repository";

const router = Router();
const flightRepository = new FlightRepository();

// Test user ID (in a real app, this would come from auth)
const TEST_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

router.post("/seed", async (_req: Request, res: Response) => {
  try {
    const sampleFlights = [
      {
        date: "2025-10-01",
        departureAirport: "KBOS",
        arrivalAirport: "KJFK",
        aircraftType: "Cessna 172",
        flightHours: 2.5,
        isNight: false,
        isSolo: true,
      },
      {
        date: "2025-10-05",
        departureAirport: "KJFK",
        arrivalAirport: "KPHL",
        aircraftType: "Piper PA-28",
        flightHours: 1.8,
        isNight: true,
        isSolo: false,
      },
      {
        date: "2025-10-10",
        departureAirport: "KPHL",
        arrivalAirport: "KBOS",
        aircraftType: "Cessna 172",
        flightHours: 3.2,
        isNight: false,
        isSolo: true,
      },
    ];

    const createdFlights = [];
    for (const flight of sampleFlights) {
      const created = await flightRepository.create(TEST_USER_ID, flight);
      createdFlights.push(created);
    }

    // Recalculate totals
    await flightRepository.recalculateTotals(TEST_USER_ID);

    res.json({
      success: true,
      message: `Created ${createdFlights.length} sample flights`,
      data: createdFlights,
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to seed data",
      error: (error as Error).message,
    });
  }
});

export default router;
