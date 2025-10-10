import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors";

export const validateCreateFlight = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    date,
    departureAirport,
    arrivalAirport,
    aircraftType,
    flightHours,
    isNight,
    isSolo,
  } = req.body;

  const errors: string[] = [];

  if (!date) errors.push("date is required");
  if (!departureAirport) errors.push("departureAirport is required");
  if (!arrivalAirport) errors.push("arrivalAirport is required");
  if (!aircraftType) errors.push("aircraftType is required");
  if (flightHours === undefined) errors.push("flightHours is required");
  if (typeof isNight !== "boolean") errors.push("isNight must be a boolean");
  if (typeof isSolo !== "boolean") errors.push("isSolo must be a boolean");

  if (errors.length > 0) {
    throw new ValidationError(`Validation failed: ${errors.join(", ")}`);
  }

  next();
};
