import { Request, Response, NextFunction } from "express";
import { FlightService } from "../services/flight.service";

// Demo user ID (hardcoded for now)
const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export class FlightController {
  private flightService: FlightService;

  constructor() {
    this.flightService = new FlightService();
  }

  createFlight = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const flight = await this.flightService.createFlight(
        DEMO_USER_ID,
        req.body
      );
      res.status(201).json({
        success: true,
        data: flight,
      });
    } catch (error) {
      next(error);
    }
  };

  getFlights = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;

      const flights = await this.flightService.getFlightsByUser(
        DEMO_USER_ID,
        limit,
        offset
      );
      res.json({
        success: true,
        data: flights,
        pagination: {
          limit,
          offset,
          count: flights.length,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getFlightById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const flight = await this.flightService.getFlightById(req.params.id);
      res.json({
        success: true,
        data: flight,
      });
    } catch (error) {
      next(error);
    }
  };

  updateFlight = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const flight = await this.flightService.updateFlight(
        req.params.id,
        DEMO_USER_ID,
        req.body
      );
      res.json({
        success: true,
        data: flight,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteFlight = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.flightService.deleteFlight(req.params.id, DEMO_USER_ID);
      res.json({
        success: true,
        message: "Flight deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getFlightTotals = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const totals = await this.flightService.getFlightTotals(DEMO_USER_ID);
      res.json({
        success: true,
        data: totals,
      });
    } catch (error) {
      next(error);
    }
  };
}
