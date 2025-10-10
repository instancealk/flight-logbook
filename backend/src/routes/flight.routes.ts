import { Router } from "express";
import { FlightController } from "../controllers/flight.controller";
import { validateCreateFlight } from "../middleware/validateRequest";

const router = Router();
const flightController = new FlightController();

router.post("/", validateCreateFlight, flightController.createFlight);
router.get("/", flightController.getFlights);
router.get("/totals", flightController.getFlightTotals);
router.get("/:id", flightController.getFlightById);
router.put("/:id", flightController.updateFlight);
router.delete("/:id", flightController.deleteFlight);

export default router;
