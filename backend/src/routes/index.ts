import { Router } from "express";
import flightRoutes from "./flight.routes";

const router = Router();

router.use("/flights", flightRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Flight Logbook API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
