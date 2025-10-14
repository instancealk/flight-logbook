import { Router } from "express";
import flightRoutes from "./flight.routes";
import seedRoutes from "./seed.routes";

const router = Router();

router.use("/flights", flightRoutes);
router.use("/dev", seedRoutes);

// Health check endpoint
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Flight Logbook API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
